import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";

export const runtime = "nodejs";

type ApiErr = {
  ok: false;
  code: "BAD_JSON" | "PAYLOAD_TOO_LARGE" | "INVALID_RUN" | "PDF_RENDER_FAILED" | "INTERNAL_ERROR";
  message: string;
};

function err(code: ApiErr["code"], message: string, status = 400) {
  return NextResponse.json(
    { ok: false, code, message } satisfies ApiErr,
    {
      status,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json",
      },
    }
  );
}

function safeFilename(input: string): string {
  const s = String(input ?? "").trim() || "run";
  let out = "";
  for (const ch of s) {
    const ok =
      (ch >= "a" && ch <= "z") ||
      (ch >= "A" && ch <= "Z") ||
      (ch >= "0" && ch <= "9") ||
      ch === "." ||
      ch === "_" ||
      ch === "-";
    out += ok ? ch : "_";
    if (out.length >= 120) break;
  }
  return out || "run";
}

function wrapLine(font: any, fontSize: number, line: string, maxWidth: number): string[] {
  const out: string[] = [];

  // Fast path
  if (font.widthOfTextAtSize(line, fontSize) <= maxWidth) return [line];

  // Word wrap
  const words = line.split(/\s+/g).filter(Boolean);
  if (!words.length) return [""];

  let cur = words[0];
  for (let i = 1; i < words.length; i++) {
    const next = cur + " " + words[i];
    if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
      cur = next;
    } else {
      out.push(cur);
      cur = words[i];
    }
  }
  out.push(cur);

  // If any “word” is too long, fallback to char wrap for that segment
  const final: string[] = [];
  for (const seg of out) {
    if (font.widthOfTextAtSize(seg, fontSize) <= maxWidth) {
      final.push(seg);
      continue;
    }
    let buf = "";
    for (const ch of seg) {
      const test = buf + ch;
      if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
        buf = test;
      } else {
        if (buf) final.push(buf);
        buf = ch;
      }
    }
    if (buf) final.push(buf);
  }

  return final;
}

async function renderPdfFromText(text: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Courier);

  // A4 portrait
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  const margin = 48;
  const fontSize = 10;
  const lineHeight = 12;

  const maxWidth = pageWidth - margin * 2;

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const rawLines = String(text ?? "").replace(/\r\n/g, "\n").split("\n");

  for (const raw of rawLines) {
    const wrapped = wrapLine(font, fontSize, raw, maxWidth);
    for (const line of wrapped) {
      if (y - lineHeight < margin) {
        page = pdf.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line, {
        x: margin,
        y: y - fontSize,
        size: fontSize,
        font,
      });
      y -= lineHeight;
    }
  }

  return await pdf.save();
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();

    // Minimal abuse gate (v0.1): hard payload cap (bytes, not characters)
    const MAX_BYTES = 300_000; // 300 KB
    const rawBytes = Buffer.byteLength(raw, "utf8");
    if (rawBytes > MAX_BYTES) {
      return err("PAYLOAD_TOO_LARGE", `Payload too large (${rawBytes} bytes; max ${MAX_BYTES} bytes).`, 413);
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return err("BAD_JSON", "Body must be valid JSON.", 400);
    }

    let run;
    try {
      run = parseEvalRunBundleV0_1(json);
    } catch (e) {
      return err("INVALID_RUN", (e as Error)?.message ?? "Invalid eval run bundle.", 400);
    }

    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
    const md = renderEvalReportMdV0_1(report);

    let pdfBytes: Uint8Array;
    try {
      pdfBytes = await renderPdfFromText(md);
    } catch (e) {
      return err("PDF_RENDER_FAILED", (e as Error)?.message ?? "PDF render failed.", 500);
    }

    const fname = `evals.${safeFilename(report.runId)}.v0.1.pdf`;

    // Use ArrayBuffer to satisfy BodyInit types cleanly.
    const body = new ArrayBuffer(pdfBytes.byteLength);
    new Uint8Array(body).set(pdfBytes);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${fname}"`,
      },
    });
  } catch (e) {
    return err("INTERNAL_ERROR", (e as Error)?.message ?? "Unknown error.", 500);
  }
}

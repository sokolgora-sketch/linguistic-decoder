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
    { status, headers: { "cache-control": "no-store" } }
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

function wrapLine(line: string, maxChars: number): string[] {
  if (line.length <= maxChars) return [line];
  const out: string[] = [];
  for (let i = 0; i < line.length; i += maxChars) out.push(line.slice(i, i + maxChars));
  return out;
}

function wrapText(text: string, maxChars: number): string[] {
  const raw = String(text ?? "").replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  const lines = raw.split("\n");
  const out: string[] = [];
  for (const l of lines) out.push(...wrapLine(l, maxChars));
  return out;
}

async function renderPdfFromText(text: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Courier);

  const pageW = 612;
  const pageH = 792;

  const margin = 48;
  const fontSize = 10;
  const lineH = 12;
  const maxChars = 95;

  const lines = wrapText(text, maxChars);

  let page = doc.addPage([pageW, pageH]);
  let y = pageH - margin;

  for (const line of lines) {
    if (y < margin) {
      page = doc.addPage([pageW, pageH]);
      y = pageH - margin;
    }
    page.drawText(line, { x: margin, y, size: fontSize, font });
    y -= lineH;
  }

  return await doc.save();
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();

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

    return new NextResponse(pdfBytes, {
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

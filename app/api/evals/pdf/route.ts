import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";
import { renderMarkdownToPdfV0_2 } from "@/shared/evals/renderMarkdownToPdf.v0.2";

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

// pdf-lib StandardFonts use WinAnsi (not full Unicode). Sanitize markdown to avoid hard failures.
function pdfSafeText(input: string): string {
  const s = String(input ?? "");

  const map: Record<string, string> = {
    "ρ": "rho",
    "—": "-",
    "–": "-",
    "→": "->",
    "·": "*",
    "•": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "\u00A0": " ", // nbsp
  };

  let out = "";
  for (const ch of s) {
    const rep = map[ch];
    if (rep !== undefined) {
      out += rep;
      continue;
    }

    const code = ch.codePointAt(0) ?? 0;

    // keep tabs/newlines
    if (code === 9 || code === 10 || code === 13) {
      out += ch;
      continue;
    }

    // ASCII printable
    if (code >= 32 && code <= 126) {
      out += ch;
      continue;
    }

    // Latin-1 printable (WinAnsi-ish)
    if (code >= 160 && code <= 255) {
      out += ch;
      continue;
    }

    out += "?";
  }

  return out;
}

function wrapLine(params: {
  line: string;
  maxWidth: number;
  font: any;
  size: number;
}): string[] {
  const { line, maxWidth, font, size } = params;

  if (!line) return [""];
  if (font.widthOfTextAtSize(line, size) <= maxWidth) return [line];

  const words = line.split(/\s+/g);
  const out: string[] = [];
  let cur = "";

  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      cur = next;
      continue;
    }
    if (cur) out.push(cur);

    // If a single word is too long, hard-split it.
    if (font.widthOfTextAtSize(w, size) > maxWidth) {
      let chunk = "";
      for (const ch of w) {
        const tryChunk = chunk + ch;
        if (font.widthOfTextAtSize(tryChunk, size) <= maxWidth) {
          chunk = tryChunk;
        } else {
          if (chunk) out.push(chunk);
          chunk = ch;
        }
      }
      cur = chunk;
    } else {
      cur = w;
    }
  }

  if (cur) out.push(cur);
  return out.length ? out : [line];
}

async function renderPdfFromText(text: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const fontSize = 10;
  const lineHeight = 14;
  const margin = 40;

  const pageSize: [number, number] = [612, 792]; // US Letter-ish
  let page = pdf.addPage(pageSize);

  const { width: w, height: h } = page.getSize();
  const maxWidth = w - margin * 2;

  let y = h - margin;

  const lines = String(text ?? "").split(/\r?\n/g);
  for (const rawLine of lines) {
    const wrapped = wrapLine({ line: rawLine, maxWidth, font, size: fontSize });

    for (const l of wrapped) {
      if (y < margin + lineHeight) {
        page = pdf.addPage(pageSize);
        y = h - margin;
      }

      page.drawText(l, {
        x: margin,
        y,
        size: fontSize,
        font,
      });

      y -= lineHeight;
    }
  }

  return pdf.save();
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
      return err("INVALID_RUN", ((e as Error)?.message ?? "Invalid eval run bundle.") + " Hint: expected run.evalRunVersion=\"evalRun.v0.1\" and run.evalSpecVersion=\"evalSpec.v0.1\". If you pasted a Corpus70 meta JSON (version/allowedTags/tags), that is NOT an eval run bundle.", 400);
    }

    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
    const md = renderEvalReportMdV0_1(report);

    let pdfBytes: Uint8Array;
    try {
        try {
          pdfBytes = await renderMarkdownToPdfV0_2(md);
        } catch {
          pdfBytes = await renderPdfFromText(pdfSafeText(md));
        }
      } catch (e) {
      return err("PDF_RENDER_FAILED", (e as Error)?.message ?? "PDF render failed.", 500);
    }

    const fname = `evals.${safeFilename(report.runId)}.v0.1.pdf`;

    // Force a real ArrayBuffer body to satisfy Next/TS BodyInit typing.
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

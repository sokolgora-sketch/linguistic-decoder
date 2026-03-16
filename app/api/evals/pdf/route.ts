import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

type TrendPoint = { bucket: string; meanPrimary: number };

function extractT2TrendFromMarkdown(md: string): TrendPoint[] {
  const lines = String(md ?? "").split(/\r?\n/g);
  const start = lines.findIndex(
    (line) => line.trim() === "## T2_LADDER_V0_1 — Full Ladder — V1..V7"
  );
  if (start < 0) return [];

  const out: TrendPoint[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith("## ")) break;

    const m =
      /^\|\s*(V[1-7])\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*([0-9.]+)\s*\|\s*([0-9.]+)\s*\|$/.exec(
        line
      );

    if (m) {
      out.push({
        bucket: m[1],
        meanPrimary: Number(m[2]),
      });
    }
  }

  return out.length === 7 ? out : [];
}

function trendPointColor(bucket: string) {
  if (bucket === "V4") return rgb(0.95, 0.78, 0.18);
  if (bucket === "V5" || bucket === "V6" || bucket === "V7") return rgb(0.94, 0.44, 0.44);
  return rgb(0.28, 0.82, 0.50);
}

function drawDashedLine(params: {
  page: any;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dash: number;
  gap: number;
  thickness: number;
  color: any;
}) {
  const { page, x1, y1, x2, y2, dash, gap, thickness, color } = params;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (!len) return;

  const ux = dx / len;
  const uy = dy / len;

  let pos = 0;
  while (pos < len) {
    const seg = Math.min(dash, len - pos);
    const sx = x1 + ux * pos;
    const sy = y1 + uy * pos;
    const ex = x1 + ux * (pos + seg);
    const ey = y1 + uy * (pos + seg);

    page.drawLine({
      start: { x: sx, y: sy },
      end: { x: ex, y: ey },
      thickness,
      color,
    });

    pos += dash + gap;
  }
}

function drawPolyline(params: {
  page: any;
  points: Array<{ x: number; y: number }>;
  thickness: number;
  color: any;
}) {
  const { page, points, thickness, color } = params;
  for (let i = 0; i < points.length - 1; i += 1) {
    page.drawLine({
      start: { x: points[i].x, y: points[i].y },
      end: { x: points[i + 1].x, y: points[i + 1].y },
      thickness,
      color,
    });
  }
}

async function appendTrendChartPage(pdfBytes: Uint8Array, md: string): Promise<Uint8Array> {
  const trend = extractT2TrendFromMarkdown(md);
  if (trend.length !== 7) return pdfBytes;

  const pdf = await PDFDocument.load(pdfBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.addPage([612, 792]);
  const { width, height } = page.getSize();

  const margin = 48;
  const chartX = 96;
  const chartY = 180;
  const chartW = 440;
  const chartH = 350;

  page.drawText("Aperture trend by bucket", {
    x: margin,
    y: height - 72,
    size: 18,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText("Mean aperture score from V1 to V7.", {
    x: margin,
    y: height - 94,
    size: 10,
    font,
    color: rgb(0.38, 0.38, 0.38),
  });

  page.drawText("Solid path = bucket means · dashed path = linear trend.", {
    x: margin,
    y: height - 108,
    size: 9,
    font,
    color: rgb(0.48, 0.48, 0.48),
  });

  page.drawLine({
    start: { x: chartX, y: chartY },
    end: { x: chartX, y: chartY + chartH },
    thickness: 1,
    color: rgb(0.45, 0.45, 0.45),
  });

  page.drawLine({
    start: { x: chartX, y: chartY },
    end: { x: chartX + chartW, y: chartY },
    thickness: 1,
    color: rgb(0.45, 0.45, 0.45),
  });

  for (const tick of [0, 0.5, 1.0]) {
    const y = chartY + chartH * tick;
    drawDashedLine({
      page,
      x1: chartX,
      y1: y,
      x2: chartX + chartW,
      y2: y,
      dash: 4,
      gap: 6,
      thickness: 0.8,
      color: rgb(0.82, 0.82, 0.82),
    });

    const label = tick.toFixed(1);
    page.drawText(label, {
      x: chartX - font.widthOfTextAtSize(label, 10) - 16,
      y: y - 4,
      size: 10,
      font,
      color: rgb(0.38, 0.38, 0.38),
    });
  }

  const points = trend.map((p, idx) => ({
    bucket: p.bucket,
    meanPrimary: p.meanPrimary,
    x: chartX + (chartW / 6) * idx,
    y: chartY + chartH * p.meanPrimary,
  }));

  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumXX = points.reduce((a, p) => a + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  const m = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const b0 = (sumY - m * sumX) / n;
  const x1 = chartX;
  const x2 = points[points.length - 1]?.x ?? chartX;

  drawPolyline({
    page,
    points,
    thickness: 2.2,
    color: rgb(0.96, 0.66, 0.70),
  });

  drawDashedLine({
    page,
    x1,
    y1: m * x1 + b0,
    x2,
    y2: m * x2 + b0,
    dash: 7,
    gap: 5,
    thickness: 2.2,
    color: rgb(0.88, 0.44, 0.48),
  });

  for (const p of points) {
    const color = trendPointColor(p.bucket);

    page.drawCircle({
      x: p.x,
      y: p.y,
      size: 7,
      color,
      borderColor: color,
      borderWidth: 1,
    });

    const value = p.meanPrimary.toFixed(3);
    page.drawText(value, {
      x: p.x - font.widthOfTextAtSize(value, 12) / 2,
      y: p.y + 18,
      size: 12,
      font,
      color: rgb(0.18, 0.18, 0.18),
    });

    page.drawText(p.bucket, {
      x: p.x - font.widthOfTextAtSize(p.bucket, 11) / 2,
      y: chartY - 32,
      size: 11,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  }

  const xLabel = "Bucket rank";
  page.drawText(xLabel, {
    x: chartX + chartW / 2 - font.widthOfTextAtSize(xLabel, 12) / 2,
    y: chartY - 64,
    size: 12,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  const note =
    "Chart page added from markdown export for T2_LADDER_V0_1 using mean(primary) values.";
  page.drawText(note, {
    x: margin,
    y: 92,
    size: 9,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });

  return pdf.save();
}

function extractMdFrontMatterValue(md: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\export async function POST(req: Request) {");
  const m = new RegExp("^- " + escaped + ":\\s*(.+)$", "m").exec(md);
  return m ? m[1].trim() : "—";
}

async function stampPdfProvenanceFooter(pdfBytes: Uint8Array, md: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const specId = extractMdFrontMatterValue(md, "specId");
  const runId = extractMdFrontMatterValue(md, "runId");
  const taskId = extractMdFrontMatterValue(md, "taskId");
  const taskVersion = extractMdFrontMatterValue(md, "taskVersion");
  const scorerBuild = extractMdFrontMatterValue(md, "scorerBuild");
  const exportedAtUtc = extractMdFrontMatterValue(md, "exportedAtUtc");
  const exportedAtUtcCompact =
    exportedAtUtc === "—"
      ? exportedAtUtc
      : String(exportedAtUtc).replace(/\.\d{3}Z$/, "Z");

  const seedPrimary = extractMdFrontMatterValue(md, "seedPrimary");
  const seedPresenceMean = extractMdFrontMatterValue(md, "seedPresenceMean");
  const permItersPrimary = extractMdFrontMatterValue(md, "permItersPrimary");
  const permItersPresenceMean = extractMdFrontMatterValue(md, "permItersPresenceMean");
  const promptHash = extractMdFrontMatterValue(md, "promptHash");
  const promptHashShort =
    promptHash === "—" || promptHash === "not available"
      ? promptHash
      : String(promptHash).slice(0, 16);

  for (const page of pdf.getPages()) {
    const pageWidth = page.getWidth();
    const footer1 =
      "specId " +
      specId +
      " · runId " +
      runId +
      " · taskId " +
      taskId +
      " · taskVersion " +
      taskVersion;

    const footer2 =
          "utc " +
          exportedAtUtcCompact +
          " · seedPrimary " +
          seedPrimary +
          " · iters " +
          permItersPrimary +
          "/" +
          permItersPresenceMean +
          " · promptHash " +
          promptHashShort;

    page.drawLine({
      start: { x: 36, y: 28 },
      end: { x: pageWidth - 36, y: 28 },
      thickness: 0.6,
      color: rgb(0.82, 0.82, 0.82),
    });

    page.drawText(footer1, {
      x: 36,
      y: 16,
      size: 7,
      font,
      color: rgb(0.42, 0.42, 0.42),
    });

    page.drawText(footer2, {
      x: 36,
      y: 8,
      size: 7,
      font,
      color: rgb(0.42, 0.42, 0.42),
    });
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
    const exportedAtUtc = new Date().toISOString();
    const md = renderEvalReportMdV0_1(report, { exportedAtUtc });

    let pdfBytes: Uint8Array;
    try {
      try {
        pdfBytes = await renderMarkdownToPdfV0_2(md);
      } catch {
        pdfBytes = await renderPdfFromText(pdfSafeText(md));
      }
      pdfBytes = await appendTrendChartPage(pdfBytes, md);
        pdfBytes = await stampPdfProvenanceFooter(pdfBytes, md);
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

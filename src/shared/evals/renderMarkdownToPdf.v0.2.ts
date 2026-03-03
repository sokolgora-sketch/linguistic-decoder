import { PDFDocument, StandardFonts } from "pdf-lib";

// Markdown → PDF renderer (v0.2)
// - No Chrome/Puppeteer.
// - Deterministic layout.
// - Supports:
//   * # / ## / ### headings
//   * bullet lines (- / *)
//   * paragraphs (wrapped)
//   * pipe tables (GFM-ish) rendered as real tables (cells + grid)

type Font = any;

function pdfSafeText(input: string): string {
  const s = String(input ?? "");
  const map: Record<string, string> = {
    "ρ": "rho",
    "—": "-",
    "–": "-",
    "→": "->",
    "·": "·", // keep middle dot if WinAnsi supports; if it fails it becomes '?'
    "•": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "\u00A0": " ",
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

function widthOf(font: Font, text: string, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

function wrapText(params: { text: string; maxWidth: number; font: Font; size: number }): string[] {
  const { text, maxWidth, font, size } = params;
  const t = pdfSafeText(text).trim();
  if (!t) return [""];

  if (widthOf(font, t, size) <= maxWidth) return [t];

  const words = t.split(/\s+/g);
  const out: string[] = [];
  let cur = "";

  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (widthOf(font, next, size) <= maxWidth) {
      cur = next;
      continue;
    }

    if (cur) out.push(cur);

    // hard split too-long words
    if (widthOf(font, w, size) > maxWidth) {
      let chunk = "";
      for (const ch of w) {
        const tryChunk = chunk + ch;
        if (widthOf(font, tryChunk, size) <= maxWidth) {
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
  return out.length ? out : [t];
}

function isPipeTableLine(line: string): boolean {
  const s = line.trim();
  return s.startsWith("|") && s.includes("|") && s.length >= 3;
}

function splitPipeRow(line: string): string[] {
  // Remove leading/trailing pipe, split, trim.
  const s = line.trim();
  const inner = s.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  // Matches: --- or :---: etc.
  return cells.every((c) => /^:?-{3,}:?$/.test(c));
}

export async function renderMarkdownToPdfV0_2(md: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  const fontBody = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdf.embedFont(StandardFonts.Courier);

  const pageSize: [number, number] = [612, 792]; // Letter-ish
  const margin = 42;

  const fontSizeBody = 10;
  const lineHeight = 14;

  let page = pdf.addPage(pageSize);
  let { width: W, height: H } = page.getSize();

  const maxWidth = W - margin * 2;

  let x = margin;
  let y = H - margin;

  const ensureLine = (need: number) => {
    if (y < margin + need) {
      page = pdf.addPage(pageSize);
      ({ width: W, height: H } = page.getSize());
      y = H - margin;
    }
  };

  const drawLines = (lines: string[], font: Font, size: number, extraGapAfter = 0) => {
    for (const l of lines) {
      ensureLine(lineHeight);
      page.drawText(l, { x, y, size, font });
      y -= lineHeight;
    }
    y -= extraGapAfter;
  };

  const drawHeading = (level: number, text: string) => {
    const t = text.trim();
    if (!t) return;
    const size = level === 1 ? 18 : level === 2 ? 14 : 12;
    const gapBefore = level === 1 ? 10 : 8;
    const gapAfter = level === 1 ? 6 : 4;

    y -= gapBefore;
    const lines = wrapText({ text: t, maxWidth, font: fontBold, size });
    drawLines(lines, fontBold, size, gapAfter);
  };

  const drawParagraph = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const lines = wrapText({ text: t, maxWidth, font: fontBody, size: fontSizeBody });
    drawLines(lines, fontBody, fontSizeBody, 4);
  };

  const drawBullet = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const bullet = "•";
    const indent = 14;

    const bulletWidth = widthOf(fontBody, bullet, fontSizeBody) + 6;
    const w = maxWidth - indent;

    const lines = wrapText({ text: t, maxWidth: w, font: fontBody, size: fontSizeBody });

    // first line has bullet
    ensureLine(lineHeight);
    page.drawText(bullet, { x, y, size: fontSizeBody, font: fontBody });
    page.drawText(lines[0] ?? "", { x: x + bulletWidth, y, size: fontSizeBody, font: fontBody });
    y -= lineHeight;

    for (let i = 1; i < lines.length; i++) {
      ensureLine(lineHeight);
      page.drawText(lines[i], { x: x + bulletWidth, y, size: fontSizeBody, font: fontBody });
      y -= lineHeight;
    }
    y -= 2;
  };

  const drawTable = (rowsRaw: string[]) => {
    // Parse rows
    const rows = rowsRaw.map(splitPipeRow);
    if (!rows.length) return;

    // Remove separator row if present
    const cleaned: string[][] = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (i === 1 && isSeparatorRow(r)) continue;
      cleaned.push(r);
    }
    if (!cleaned.length) return;

    const cols = Math.max(...cleaned.map((r) => r.length));
    cleaned.forEach((r) => {
      while (r.length < cols) r.push("");
    });

    // Column width heuristic: proportional to max measured cell width (clamped), scaled to fit.
    const meas = new Array(cols).fill(0).map(() => 0);
    const measFont = fontBody;
    const measSize = 9;

    for (const r of cleaned) {
      for (let c = 0; c < cols; c++) {
        const w = widthOf(measFont, pdfSafeText(r[c] ?? ""), measSize);
        if (w > meas[c]) meas[c] = w;
      }
    }

    const minCol = 60;
    const pad = 6;
    const gridW = maxWidth;
    const rawSum = meas.reduce((a, b) => a + Math.max(minCol, b + pad * 2), 0);
    const scale = rawSum > 0 ? Math.min(1, gridW / rawSum) : 1;

    const colW = meas.map((m) => Math.max(minCol, (m + pad * 2) * scale));

    // Normalize to exactly gridW (last column absorbs remainder)
    const sumW = colW.reduce((a, b) => a + b, 0);
    if (sumW !== gridW && cols > 0) colW[cols - 1] += gridW - sumW;

    // Render
    const header = cleaned[0];
    const bodyRows = cleaned.slice(1);

    const cellFontHeader = fontBold;
    const cellFontBody = fontBody;
    const cellSize = 9;

    const drawRow = (cells: string[], isHeader: boolean) => {
      const font = isHeader ? cellFontHeader : cellFontBody;

      // wrap each cell
      const wrapped: string[][] = [];
      let maxLines = 1;

      for (let c = 0; c < cols; c++) {
        const maxCellW = colW[c] - pad * 2;
        const lines = wrapText({ text: cells[c] ?? "", maxWidth: maxCellW, font, size: cellSize });
        wrapped.push(lines);
        if (lines.length > maxLines) maxLines = lines.length;
      }

      const rowH = maxLines * lineHeight;

      ensureLine(rowH + 10);

      // draw grid rect lines
      let cx = x;
      const topY = y;
      const bottomY = y - rowH;

      // optional header background (light gray)
      if (isHeader) {
        page.drawRectangle({
          x: cx,
          y: bottomY,
          width: gridW,
          height: rowH,
          color: undefined, // keep default (no fill) for portability
          borderWidth: 0,
        });
      }

      // vertical lines
      for (let c = 0; c <= cols; c++) {
        page.drawLine({
          start: { x: cx, y: topY },
          end: { x: cx, y: bottomY },
          thickness: 0.5,
        });
        if (c < cols) cx += colW[c];
      }

      // horizontal lines
      page.drawLine({ start: { x, y: topY }, end: { x: x + gridW, y: topY }, thickness: 0.5 });
      page.drawLine({ start: { x, y: bottomY }, end: { x: x + gridW, y: bottomY }, thickness: 0.5 });

      // cell text
      let tx = x;
      for (let c = 0; c < cols; c++) {
        const lines = wrapped[c];
        for (let i = 0; i < lines.length; i++) {
          page.drawText(pdfSafeText(lines[i]), {
            x: tx + pad,
            y: topY - lineHeight * (i + 1) + 4,
            size: cellSize,
            font,
          });
        }
        tx += colW[c];
      }

      y = bottomY - 8;
    };

    drawRow(header, true);
    for (const r of bodyRows) drawRow(r, false);
    y -= 4;
  };

  const lines = String(md ?? "").split(/\r?\n/g);

  let paraBuf: string[] = [];
  let tableBuf: string[] = [];

  const flushPara = () => {
    if (!paraBuf.length) return;
    drawParagraph(paraBuf.join(" ").trim());
    paraBuf = [];
  };

  const flushTable = () => {
    if (!tableBuf.length) return;
    flushPara();
    drawTable(tableBuf);
    tableBuf = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\t/g, "    ");
    const t = line.trim();

    // table block
    if (isPipeTableLine(line)) {
      tableBuf.push(line);
      continue;
    }
    if (tableBuf.length) {
      // end table on first non-table line
      flushTable();
    }

    // headings
    if (/^###\s+/.test(t)) {
      flushPara();
      drawHeading(3, t.replace(/^###\s+/, ""));
      continue;
    }
    if (/^##\s+/.test(t)) {
      flushPara();
      drawHeading(2, t.replace(/^##\s+/, ""));
      continue;
    }
    if (/^#\s+/.test(t)) {
      flushPara();
      drawHeading(1, t.replace(/^#\s+/, ""));
      continue;
    }

    // blank line ends paragraph
    if (!t) {
      flushPara();
      y -= 6;
      continue;
    }

    // bullets
    if (/^[-*]\s+/.test(t)) {
      flushPara();
      drawBullet(t.replace(/^[-*]\s+/, ""));
      continue;
    }

    // default paragraph accumulation
    paraBuf.push(t);
  }

  flushTable();
  flushPara();

  return pdf.save();
}

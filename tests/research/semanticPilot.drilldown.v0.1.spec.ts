import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type CanonCase = { id: string; word: string; ipa?: string };
type Dataset = { version: string; cases: CanonCase[] };

type Meta = {
  version: string;
  allowedTags: string[];
  tags: Record<string, string[]>;
};

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function arr(x: any): string[] {
  return Array.isArray(x) ? x.map(String) : [];
}

function arrEq(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function primaryOf(voices: string[]): string {
  return voices[0] ?? "NONE";
}

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

function loadCorpusV0_3(): CanonCase[] {
  const root = process.cwd();
  const trainPath = path.join(root, "tests/validation/datasets/canonC2.train.v0.3.json");
  const holdPath = path.join(root, "tests/validation/datasets/canonC2.holdout.v0.3.json");

  const train = readJson<Dataset>(trainPath);
  const hold = readJson<Dataset>(holdPath);

  const cases = [...(train.cases ?? []), ...(hold.cases ?? [])];
  if (cases.length !== 70) throw new Error(`Expected 70 cases; got ${cases.length}`);

  cases.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return cases;
}

function parseLowPTagsFromCompare(compareMd: string, metaVersion: string, pThresh: number): Array<{ tag: string; p: number }> {
  const lines = compareMd.split("\n");

  // find section header: "## Meta: <metaVersion>"
  const head = `## Meta: ${metaVersion}`;
  const start = lines.findIndex((l) => l.trim() === head);
  if (start < 0) return [];

  // scan forward to find the table header row containing "p("
  let headerRow = -1;
  for (let i = start; i < Math.min(lines.length, start + 200); i++) {
    const l = lines[i];
    if (l.startsWith("| Tag |") && l.includes("p(")) {
      headerRow = i;
      break;
    }
  }
  if (headerRow < 0) return [];

  const headerCols = lines[headerRow]
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);

  const tagIdx = headerCols.findIndex((c) => c.toLowerCase() === "tag");
  const pIdx = headerCols.findIndex((c) => c.toLowerCase().startsWith("p("));
  if (tagIdx < 0 || pIdx < 0) return [];

  const out: Array<{ tag: string; p: number }> = [];

  // rows start after separator line
  for (let i = headerRow + 2; i < Math.min(lines.length, headerRow + 200); i++) {
    const l = lines[i];
    if (!l.startsWith("|")) break; // end of table
    const cols = l
      .split("|")
      .map((x) => x.trim())
      .filter(Boolean);

    if (cols.length !== headerCols.length) continue;

    const tag = cols[tagIdx];
    const pRaw = cols[pIdx];
    const p = Number.parseFloat(pRaw);
    if (!Number.isFinite(p)) continue;

    if (p <= pThresh) out.push({ tag, p });
  }

  out.sort((a, b) => a.p - b.p || a.tag.localeCompare(b.tag));
  return out;
}

describe("Semantic Pilot drilldown v0.1 — list cases for low-p tags", () => {
  it("writes tests/validation/out/semanticPilot.drilldown.v0.1.md", () => {
    const root = process.cwd();

    const comparePath = path.join(root, "tests/validation/out/semanticPilot.compare.v0.1.md");
    if (!fs.existsSync(comparePath)) {
      throw new Error(`Missing compare report: ${comparePath}. Run: npm run research:semantic-pilot:compare`);
    }
    const compareMd = fs.readFileSync(comparePath, "utf8");

    const corpus = loadCorpusV0_3();
    const byId: Record<string, CanonCase> = {};
    for (const c of corpus) byId[String(c.id)] = c;

    const metaPaths = [
      path.join(root, "tests/research/corpus70.meta.v0.1.gemini.json"),
      path.join(root, "tests/research/corpus70.meta.v0.1.autotag.json"),
    ];

    const pThresh = 0.1;

    const outLines: string[] = [];
    outLines.push("# Semantic Pilot drilldown v0.1 — Low-p tag microscope");
    outLines.push("");
    outLines.push(`- p-threshold: **<= ${pThresh.toFixed(2)}** (from compare report)`);
    outLines.push(`- source: \`tests/validation/out/semanticPilot.compare.v0.1.md\``);
    outLines.push("");

    for (const mp of metaPaths) {
      if (!fs.existsSync(mp)) continue;
      const meta = readJson<Meta>(mp);

      const lowP = parseLowPTagsFromCompare(compareMd, meta.version, pThresh);

      outLines.push(`## Meta: ${meta.version}`);
      outLines.push("");

      if (!lowP.length) {
        outLines.push("_No tags under threshold in compare report._");
        outLines.push("");
        continue;
      }

      for (const { tag, p } of lowP) {
        // collect cases with this tag
        const ids = Object.keys(meta.tags ?? {}).filter((id) => (meta.tags[id] ?? []).includes(tag));
        ids.sort((a, b) => a.localeCompare(b));

        outLines.push(`### Tag: ${tag} (p=${p.toFixed(3)})`);
        outLines.push("");
        outLines.push("| ID | Word | Tags | Mask voices | Carrier voices | Mask P | Carrier P | Status |");
        outLines.push("|---:|------|------|------------|---------------|--------|-----------|--------|");

        for (const id of ids) {
          const c = byId[id];
          const word = c?.word ?? "(missing)";
          const ipa = c?.ipa;

          const mask = extractOrthographyVoicesFromWordV0_1({ word }).voices ?? [];
          const carrier = ipa ? extractCarrierVoicesFromIpaV0_1(ipa).voices ?? [] : [];

          const st = statusOf(mask, carrier);

          const tags = (meta.tags[id] ?? []).join(", ");
          const maskS = arr(mask).join(" ");
          const carS = arr(carrier).join(" ");

          outLines.push(
            `| ${id} | **${word}** | ${tags || "-"} | ${maskS || "-"} | ${carS || "-"} | ${primaryOf(mask)} | ${primaryOf(carrier)} | ${st} |`
          );
        }

        outLines.push("");
      }
    }

    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.drilldown.v0.1.md");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, outLines.join("\n") + "\n", "utf8");

    expect(fs.existsSync(outMd)).toBe(true);
  });
});

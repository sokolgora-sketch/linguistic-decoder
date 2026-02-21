import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type CanonCase = { id: string; word: string; mode?: string; ipa?: string };
type Dataset = { version: string; cases: CanonCase[] };
type Baseline = { version: string; cases: Record<string, any> };

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

function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

function normalizeCandidatePath(v: unknown): string | null {
  if (typeof v !== "string") return null;
  let s = v.trim();
  if (!s) return null;
  // common forms: "A-A", "A → A", "A->A"
  s = s.replace(/->/g, " → ").replace(/-/g, " → ");
  s = s.replace(/\s*→\s*/g, " → ").trim();
  return s || null;
}

function firstVoiceFromPath(pathStr: string | null): string {
  if (!pathStr) return "NONE";
  const parts = pathStr.split(/\s*(?:→)\s*/).map((x) => x.trim()).filter(Boolean);
  return parts[0] ?? "NONE";
}

type Row = {
  id: string;
  word: string;
  ortho: string[];
  phon: string[];
  heartPath: string | null;
  deepPath: string | null;
  status: "NO_PHONETIC" | "SYNC" | "DIVERGE";
};

describe("Canon C2 report v0.1 (baseline v0.3 + SSOT extractors)", () => {
  it("writes tests/validation/out/canonC2.report.v0.3.md", () => {
    const root = process.cwd();

    const baselinePath = path.join(root, "tests/validation/baselines/canonC2.baseline.v0.3.json");
    const trainPath = path.join(root, "tests/validation/datasets/canonC2.train.v0.3.json");
    const holdoutPath = path.join(root, "tests/validation/datasets/canonC2.holdout.v0.3.json");

    const outDir = path.join(root, "tests/validation/out");
    const reportPath = path.join(outDir, "canonC2.report.v0.3.md");

    const baseline = readJson<Baseline>(baselinePath);
    const train = readJson<Dataset>(trainPath);
    const holdout = readJson<Dataset>(holdoutPath);

    // Map id -> dataset record (so we can recover ipa)
    const caseMap = new Map<string, CanonCase>();
    for (const c of [...train.cases, ...holdout.cases]) caseMap.set(c.id, c);

    const ids = Object.keys(baseline.cases ?? {}).sort((a, b) => a.localeCompare(b));

    const rows: Row[] = ids.map((id) => {
      const rec = baseline.cases?.[id] ?? {};
      const ds = caseMap.get(id);

      const word = String(ds?.word ?? rec.word ?? "");
      const ipa = typeof ds?.ipa === "string" ? ds.ipa : null;

      const ortho = extractOrthographyVoicesFromWordV0_1({ word }).voices.map(String);
      const phon = ipa ? extractCarrierVoicesFromIpaV0_1(ipa).voices.map(String) : [];

      const status: Row["status"] =
        !ipa ? "NO_PHONETIC" : arrEq(ortho, phon) ? "SYNC" : "DIVERGE";

      const heartPath =
        (typeof rec.heartPrimaryVowelPath === "string" ? rec.heartPrimaryVowelPath : null) ??
        normalizeCandidatePath(rec?.candidates?.[0]?.vowelPath);

      const deepPath =
        typeof rec.deepRootFunctionalVowelPath === "string" ? rec.deepRootFunctionalVowelPath : null;

      return { id, word, ortho, phon, heartPath: heartPath ?? null, deepPath, status };
    });

    const total = rows.length;
    const noPhonetic = rows.filter((r) => r.status === "NO_PHONETIC").length;
    const sync = rows.filter((r) => r.status === "SYNC").length;
    const diverge = rows.filter((r) => r.status === "DIVERGE").length;

    // distribution by first voice of heartPath (fallbacks to candidates vowelPath)
    const dist = new Map<string, number>();
    for (const r of rows) {
      const k = firstVoiceFromPath(r.heartPath);
      dist.set(k, (dist.get(k) ?? 0) + 1);
    }
    const distSorted = [...dist.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    const lines: string[] = [];
    lines.push("# Canon C2 v0.3 — Research Report");
    lines.push("");
    lines.push("## Metrics");
    lines.push("");
    lines.push(`- Total cases: **${total}**`);
    lines.push(`- SYNC: **${sync}** (${pct(sync, total)})`);
    lines.push(`- DIVERGE: **${diverge}** (${pct(diverge, total)})`);
    lines.push(`- NO_PHONETIC: **${noPhonetic}** (${pct(noPhonetic, total)})`);
    lines.push("");
    lines.push("## Primary Heart vowel distribution (first in path)");
    lines.push("");
    for (const [k, v] of distSorted) lines.push(`- ${k}: **${v}**`);
    lines.push("");
    lines.push("## Case table");
    lines.push("");
    lines.push("| ID | Word | Ortho | Phonetic | Heart Primary | DeepRoot Functional | Status |");
    lines.push("|---:|------|-------|----------|--------------|---------------------|--------|");

    for (const r of rows) {
      const ortho = r.ortho.join(" ") || "-";
      const phon = r.phon.join(" ") || "-";
      const heart = r.heartPath ?? "NONE";
      const deep = r.deepPath ?? "NONE";
      lines.push(`| ${r.id} | **${r.word}** | ${ortho} | ${phon} | \`${heart}\` | \`${deep}\` | ${r.status} |`);
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(reportPath, lines.join("\n") + "\n", "utf8");

    // sanity
    expect(total).toBe(70);
  });
});

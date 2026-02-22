import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type Meta = { version: string; allowedTags: string[]; tags: Record<string, string[]> };
type WordRow = { id: string; word: string; ipa: string };

type CaseRow = {
  id: string;
  word: string;
  ipa: string | null;
  tags: string[];
  maskVoices: string[];
  carrierVoices: string[];
  maskP: string;
  carrierP: string;
  status: "NO_PHONETIC" | "SYNC" | "DIVERGE";
  kind: "positive" | "negative";
  liftA_case: number; // v0.1: event-lift for carrierPrimary==A vs perm mean (0 if not-A)
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
function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

// deterministic rng
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleInPlace<T>(xs: T[], rnd: () => number): void {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = xs[i];
    xs[i] = xs[j];
    xs[j] = tmp;
  }
}

function parseWordsFile(s: string): WordRow[] {
  const lines = s.split("\n").map((x) => x.trim()).filter(Boolean);
  const out: WordRow[] = [];
  for (const line of lines) {
    // id <ws> word <ws> /ipa/
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) throw new Error(`Bad words line (expected: id<ws>word<ws>/ipa/): ${line}`);
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

type CorpusItem = {
  id: string;
  word: string;
  ipa: string;
  tags: string[];
  maskVoices: string[];
  carrierVoices: string[];
  maskP: string;
  carrierP: string;
  status: "NO_PHONETIC" | "SYNC" | "DIVERGE";
};

function countA(items: Array<{ carrierP: string }>): number {
  return items.filter((x) => x.carrierP === "A").length;
}

function median(xs: number[]): number {
  const ys = xs.slice().sort((a, b) => a - b);
  if (!ys.length) return 0;
  const mid = Math.floor(ys.length / 2);
  return ys.length % 2 ? ys[mid]! : (ys[mid - 1]! + ys[mid]!) / 2;
}

function permutationStatsForPositionA(items: CorpusItem[], iters: number, seed: number): { p: number; meanRate: number } {
  const rnd = mulberry32(seed);
  const primaries = items.map((x) => x.carrierP);

  const posIdxs: number[] = [];
  for (let i = 0; i < items.length; i++) if (items[i].tags.includes("position")) posIdxs.push(i);

  if (!posIdxs.length) return { p: 1, meanRate: 0 };

  const obsA = posIdxs.reduce((s, i) => s + (items[i].carrierP === "A" ? 1 : 0), 0);

  let hits = 0;
  let sumA = 0;

  for (let it = 0; it < iters; it++) {
    const shuffled = primaries.slice();
    shuffleInPlace(shuffled, rnd);

    let aCount = 0;
    for (const i of posIdxs) if (shuffled[i] === "A") aCount++;

    sumA += aCount;
    if (aCount >= obsA) hits++;
  }

  const meanRate = (sumA / iters) / posIdxs.length;
  return { p: hits / iters, meanRate };
}

describe("Decomposition Harness (Position-scoped) v0.1 — prereg + negative controls", () => {
  it("writes tests/validation/out/decompositionHarness.position.v0.1.md", () => {
    const root = process.cwd();

    const preregPath = path.join(root, "tests/research/preregistration.decomp.v0.1.md");
    const wordsPath = path.join(root, "tests/research/albanian100.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/albanian100.meta.v0.1.gemini-blind.json");

    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "decompositionHarness.position.v0.1.md");

    if (!fs.existsSync(preregPath)) throw new Error(`Missing prereg: ${preregPath}`);
    if (!fs.existsSync(wordsPath)) throw new Error(`Missing words: ${wordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing meta: ${metaPath}`);

    const words = parseWordsFile(fs.readFileSync(wordsPath, "utf8"));
    if (words.length !== 100) throw new Error(`Expected 100 Albanian100 rows, got ${words.length}`);

    const meta = readJson<Meta>(metaPath);
    const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
    if (!allowedTags.length) throw new Error("Meta.allowedTags missing/empty");
    const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

    // Build corpus items (SSOT)
    const corpusItems: CorpusItem[] = words.map((w) => {
      const tags = arr(tagMap[w.id]).filter((t) => allowedTags.includes(t));

      const maskOut = extractOrthographyVoicesFromWordV0_1({ word: w.word, langHint: "sq" });
      const maskVoices = arr(maskOut?.voices);

      const carOut = extractCarrierVoicesFromIpaV0_1(w.ipa);
      const carrierVoices = arr(carOut?.voices);

      const maskP = primaryOf(maskVoices);
      const carrierP = primaryOf(carrierVoices);
      const st = statusOf(maskVoices, carrierVoices);

      return {
        id: w.id,
        word: w.word,
        ipa: w.ipa,
        tags,
        maskVoices,
        carrierVoices,
        maskP,
        carrierP,
        status: st,
      };
    });

    const noCarrier = corpusItems.filter((x) => x.carrierVoices.length === 0).length;
    if (noCarrier) throw new Error(`Expected 0 NO_PHONETIC in Albanian100 (IPA required), got ${noCarrier}`);

    // Preregistered positives (must exist in corpus)
    const positiveIds = ["sq.85", "sq.86", "sq.81", "sq.82", "sq.83", "sq.84", "sq.89", "sq.88"] as const;

    const positives: CorpusItem[] = positiveIds.map((id) => {
      const it = corpusItems.find((x) => x.id === id);
      if (!it) throw new Error(`Missing prereg positive in corpus: ${id}`);
      if (!it.tags.includes("position")) throw new Error(`Prereg positive missing 'position' tag: ${id}`);
      return it;
    });

    // Preregistered negatives (not in corpus; no tags)
    const negativesRaw: Array<{ id: string; word: string; ipa: string }> = [
      { id: "nc.01", word: "buba", ipa: "/ˈbuba/" },
      { id: "nc.02", word: "glabnif", ipa: "/ˈɡlab.nif/" },
      { id: "nc.03", word: "plojusht", ipa: "/ˈplɔ.juʃt/" },
      { id: "nc.04", word: "trenkal", ipa: "/ˈtɾen.kal/" },
    ];

    const negItems: Array<Omit<CorpusItem, "tags"> & { tags: string[] }> = negativesRaw.map((w) => {
      const maskOut = extractOrthographyVoicesFromWordV0_1({ word: w.word, langHint: "sq" });
      const maskVoices = arr(maskOut?.voices);

      const carOut = extractCarrierVoicesFromIpaV0_1(w.ipa);
      const carrierVoices = arr(carOut?.voices);

      const maskP = primaryOf(maskVoices);
      const carrierP = primaryOf(carrierVoices);
      const st = statusOf(maskVoices, carrierVoices);

      return {
        id: w.id,
        word: w.word,
        ipa: w.ipa,
        tags: [],
        maskVoices,
        carrierVoices,
        maskP,
        carrierP,
        status: st,
      };
    });

    const SEED = 777001;
    const ITERS = 5000;

    const posCorpus = corpusItems.filter((x) => x.tags.includes("position"));
    if (!posCorpus.length) throw new Error("No corpus items with tag 'position'");

    const obsAcount = countA(posCorpus);
    const obsRate = obsAcount / posCorpus.length;

    const perm = permutationStatsForPositionA(corpusItems, ITERS, SEED);
    const permMean = perm.meanRate;

    const liftA = permMean > 0 ? obsRate / permMean : 0;

    // Build report rows + per-row lift proxy:
    // v0.1: liftA_case is 0 if not A, else 1/permMean (event lift vs perm mean)
    const reportRows: CaseRow[] = [
      ...positives.map((r) => ({
        ...r,
        kind: "positive" as const,
        liftA_case: permMean > 0 && r.carrierP === "A" ? 1 / permMean : 0,
      })),
      ...negItems.map((r) => ({
        ...r,
        kind: "negative" as const,
        liftA_case: permMean > 0 && r.carrierP === "A" ? 1 / permMean : 0,
      })),
    ].slice();

    // Summary stats: A-rate separation (positives vs negatives)
    const posA = reportRows.filter((x) => x.kind === "positive" && x.carrierP === "A").length;
    const negA = reportRows.filter((x) => x.kind === "negative" && x.carrierP === "A").length;
    const posN = reportRows.filter((x) => x.kind === "positive").length;
    const negN = reportRows.filter((x) => x.kind === "negative").length;

    const posRateCases = posN ? posA / posN : 0;
    const negRateCases = negN ? negA / negN : 0;

    const medPosLift = median(reportRows.filter((x) => x.kind === "positive").map((x) => x.liftA_case));
      const medNegLift = median(reportRows.filter((x) => x.kind === "negative").map((x) => x.liftA_case));
      const maxNegLift = Math.max(...reportRows.filter((x) => x.kind === "negative").map((x) => x.liftA_case), 0);

      // Prereg gate (v0.1): baseline must show lift>1 and p<=0.10, and negatives must not match positives on MEDIAN.
      const PASS =
        liftA > 1 &&
        perm.p <= 0.10 &&
        medPosLift > medNegLift &&
        posRateCases > negRateCases;

    // Stable sort
    reportRows.sort(
      (a, b) =>
        String(a.kind).localeCompare(String(b.kind)) ||
        String(a.carrierP).localeCompare(String(b.carrierP)) ||
        String(a.word).localeCompare(String(b.word)) ||
        String(a.id).localeCompare(String(b.id))
    );

    const lines: string[] = [];
    lines.push("# Decomposition Harness (Position-scoped) v0.1");
    lines.push("");
    lines.push("Methodology-only harness. No semantic explanations. No Saussure claims.");
    lines.push("");
    lines.push("## Config");
    lines.push("");
    lines.push(`- prereg: \`tests/research/preregistration.decomp.v0.1.md\``);
    lines.push(`- corpus: \`tests/research/albanian100.words.v0.1.txt\` (100)`);
    lines.push(`- meta: \`${String(meta.version ?? "unknown")}\``);
    lines.push(`- seed: \`${SEED}\``);
    lines.push(`- permutation iters: \`${ITERS}\``);
    lines.push("");
    lines.push("## Position baseline (A concentration)");
    lines.push("");
    lines.push(`- observed P(A|position) on corpus: **${pct(obsAcount, posCorpus.length)}** (${obsAcount}/${posCorpus.length})`);
    lines.push(`- perm mean P(A|position): **${(permMean * 100).toFixed(2)}%**`);
    lines.push(`- lift_A = obs/permMean: **${liftA.toFixed(3)}**`);
    lines.push(`- permutation p-value (max>=obs): **${perm.p.toFixed(3)}**`);
    lines.push("");
    lines.push("## Result (prereg gate)");
      lines.push("");
      lines.push(`- gate: **${PASS ? "PASS" : "FAIL"}**`);
      lines.push(`- criteria: lift_A>1, p<=0.10, medianLift(pos)>medianLift(neg), posA-rate>negA-rate`);
      lines.push(`- med lift pos: **${medPosLift.toFixed(3)}**`);
      lines.push(`- med lift neg: **${medNegLift.toFixed(3)}**`);
      lines.push(`- max lift neg: **${maxNegLift.toFixed(3)}** (info only; collisions allowed)`);
      lines.push("");
      lines.push("## Positives vs negatives (sanity separation)");
    lines.push("");
    lines.push(`- positives A-rate: **${(posRateCases * 100).toFixed(1)}%** (${posA}/${posN})`);
    lines.push(`- negatives A-rate: **${(negRateCases * 100).toFixed(1)}%** (${negA}/${negN})`);
    lines.push(`- median liftA_case (positives): **${medPosLift.toFixed(3)}**`);
      lines.push(`- median liftA_case (negatives): **${medNegLift.toFixed(3)}**`);
      lines.push(`- max liftA_case (negatives): **${maxNegLift.toFixed(3)}** (info)`);
    lines.push("");
    lines.push("## Cases (prereg positives + prereg negatives)");
    lines.push("");
    lines.push("| Kind | ID | Word | IPA | Tags | Mask | Carrier | MaskP | CarrierP | lift_A_case | Status |");
    lines.push("|------|---:|------|-----|------|------|---------|-------|----------|------------:|--------|");
    for (const r of reportRows) {
      lines.push(
        `| ${r.kind} | ${r.id} | **${r.word}** | ${r.ipa ?? "-"} | ${r.tags.join(", ") || "-"} | ${
          r.maskVoices.join(" ") || "-"
        } | ${r.carrierVoices.join(" ") || "-"} | ${r.maskP} | ${r.carrierP} | ${r.liftA_case.toFixed(3)} | ${r.status} |`
      );
    }
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- lift_A_case is a v0.1 event-lift proxy (0 if not-A, else 1/permMean). This is NOT a semantic score.");
    lines.push("- We rely on permutation mean + p-value for the baseline; case table is only a sanity probe against gibberish.");
    lines.push("");

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});

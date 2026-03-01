import fs from "fs";
import path from "path";
import { projectForCanonC2V01 } from "./canonC2.projection.v0.1";
import { writeCanonC2DiffReportV01 } from "./canonC2.diffReport.v0.1";

type CanonCaseV02 = { id: string; word: string; mode?: string; ipa?: string };
type DatasetV01 = { version: string; cases: CanonCaseV02[] };
type Baseline = { version: string; cases: Record<string, any> };

async function loadAnalyzeFn(): Promise<(word: string, arg2?: any) => Promise<any> | any> {
  const overrideImport = process.env.CANON_C2_ANALYZE_IMPORT;
  const overrideExport = process.env.CANON_C2_ANALYZE_EXPORT;

  const importCandidates = [
    overrideImport,
    "@/v1/analyzeWordV1",
    "@/engine/analyzeWord",
    "@/engine/analyzeWordV1",
  ].filter(Boolean) as string[];

  const exportCandidates = [
    overrideExport,
    "analyzeWordV1",
    "analyzeWord",
    "analyzeWordWithMath7",
  ].filter(Boolean) as string[];

  const errors: string[] = [];

  for (const modPath of importCandidates) {
    try {
      const m: any = await import(modPath);
      for (const ex of exportCandidates) {
        const fn = m?.[ex];
        if (typeof fn === "function") return fn;
      }
      errors.push(`Imported ${modPath} but none of exports found: ${exportCandidates.join(", ")}`);
    } catch (e: any) {
      errors.push(`Failed import ${modPath}: ${String(e?.message || e)}`);
    }
  }

  throw new Error(
    [
      "Canon C2 cannot locate analyze function.",
      "If auto-detect fails, set env vars and rerun:",
      "  CANON_C2_ANALYZE_IMPORT='@/v1/analyzeWordV1' CANON_C2_ANALYZE_EXPORT='analyzeWordV1' npm run canon:c2:v0.4:update",
      "",
      "Auto-detect errors:",
      ...errors.map((x) => "  - " + x),
    ].join("\n")
  );
}

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function stableJson(x: any): string {
  const seen = new WeakSet();
  const sorter = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    if (seen.has(obj)) return "[[circular]]";
    seen.add(obj);
    if (Array.isArray(obj)) return obj.map(sorter);
    const out: Record<string, any> = {};
    for (const k of Object.keys(obj).sort()) out[k] = sorter(obj[k]);
    return out;
  };
  return JSON.stringify(sorter(x), null, 2);
}

async function callAnalyze(analyze: any, c: CanonCaseV02): Promise<any> {
  const mode = c.mode ?? "strict";
  const opts: any = { mode };
  if (typeof c.ipa === "string" && c.ipa.trim().length) opts.ipa = c.ipa;

  const tries = [
    () => analyze(c.word, opts),
    () => analyze(c.word, mode),
    () => analyze(c.word, { mode }),
    () => analyze(c.word),
  ];

  let lastErr: any = null;
  for (const t of tries) {
    try {
      return await Promise.resolve(t());
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

describe("Canon C2 v0.4 — compound stress (anti-regression)", () => {
  it("has no drift (or updates baseline in update mode)", async () => {
    const update = process.env.CANON_C2_UPDATE === "1";

    const root = process.cwd();
    const trainPath = path.join(root, "tests/validation/datasets/canonC2.train.v0.4.json");
    const holdoutPath = path.join(root, "tests/validation/datasets/canonC2.holdout.v0.4.json");
    const baselinePath = path.join(root, "tests/validation/baselines/canonC2.baseline.v0.4.json");

    const outCurrentPath = path.join(root, "tests/validation/out/canonC2.current.v0.4.json");
    const outDiffMdPath = path.join(root, "tests/validation/out/canonC2.diff.v0.4.md");

    const train = readJson<DatasetV01>(trainPath);
    const holdout = readJson<DatasetV01>(holdoutPath);

    const baselineExists = fs.existsSync(baselinePath);
    const baseline: Baseline = baselineExists
      ? readJson<Baseline>(baselinePath)
      : { version: "canonC2.baseline.v0.4", cases: {} };

    if (!baselineExists && !update) {
      throw new Error(
        [
          "Missing Canon C2 v0.4 baseline.",
          "Generate it once with:",
          "  npm run canon:c2:v0.4:update",
        ].join("\n")
      );
    }

    const analyze = await loadAnalyzeFn();

    const allCases: CanonCaseV02[] = [...train.cases, ...holdout.cases];

    const currentById: Record<string, any> = {};
    for (const c of allCases) {
      const raw = await callAnalyze(analyze as any, c);
      currentById[c.id] = projectForCanonC2V01(raw ?? {}, c.word);
    }

    fs.mkdirSync(path.dirname(outCurrentPath), { recursive: true });
    fs.writeFileSync(
      outCurrentPath,
      stableJson({ version: "canonC2.current.v0.4", cases: currentById }) + "\n",
      "utf8"
    );

    if (update) {
      const nextBaseline: Baseline = { version: baseline.version, cases: currentById };
      fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
      fs.writeFileSync(baselinePath, stableJson(nextBaseline) + "\n", "utf8");

      writeCanonC2DiffReportV01({
        outPathMd: outDiffMdPath,
        baselineVersion: baseline.version,
        trainVersion: train.version,
        holdoutVersion: holdout.version,
        totals: { cases: allCases.length, ok: allCases.length, drift: 0 },
        drifts: [],
      });

      expect(true).toBe(true);
      return;
    }

    const drifts: Array<{ id: string; word: string; baseline: any; current: any }> = [];
    let ok = 0;

    for (const c of allCases) {
      const b = baseline.cases?.[c.id];
      const cur = currentById[c.id];

      if (!b) {
        drifts.push({ id: c.id, word: c.word, baseline: null, current: cur });
        continue;
      }

      const same = stableJson(b) === stableJson(cur);
      if (same) ok++;
      else drifts.push({ id: c.id, word: c.word, baseline: b, current: cur });
    }

    writeCanonC2DiffReportV01({
      outPathMd: outDiffMdPath,
      baselineVersion: baseline.version,
      trainVersion: train.version,
      holdoutVersion: holdout.version,
      totals: { cases: allCases.length, ok, drift: drifts.length },
      drifts,
    });

    if (drifts.length) {
      throw new Error(
        [
          `Canon C2 v0.4 drift detected: ${drifts.length}/${allCases.length}`,
          `See: ${path.relative(root, outDiffMdPath)}`,
          "",
          "If this drift is intentional:",
          "  npm run canon:c2:v0.4:update",
        ].join("\n")
      );
    }
  });
});

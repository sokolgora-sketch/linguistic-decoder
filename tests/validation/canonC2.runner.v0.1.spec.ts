import fs from "fs";
import path from "path";
import { projectForCanonC2V01 } from "./canonC2.projection.v0.1";
import { writeCanonC2DiffReportV01 } from "./canonC2.diffReport.v0.1";

type CanonCase = { id: string; word: string };
type Dataset = { version: string; cases: CanonCase[] };
type Baseline = { version: string; cases: Record<string, any> };

async function loadAnalyzeFn(): Promise<(word: string) => Promise<any> | any> {
  const overrideImport = process.env.CANON_C2_ANALYZE_IMPORT;
  const overrideExport = process.env.CANON_C2_ANALYZE_EXPORT;

  // IMPORTANT: your entrypoints are in src/v1 and src/engine (not src/shared)
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
      "We found these engine exports in your repo:",
      "  - src/v1/analyzeWordV1.ts (export analyzeWordV1)",
      "  - src/engine/analyzeWord.ts (export analyzeWord, analyzeWordWithMath7)",
      "  - src/engine/analyzeWordV1.ts (export analyzeWordV1)",
      "",
      "If auto-detect fails, set env vars and rerun:",
      "  CANON_C2_ANALYZE_IMPORT='@/v1/analyzeWordV1' CANON_C2_ANALYZE_EXPORT='analyzeWordV1' npm run canon:c2:update",
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

describe("Canon C2 v0.1 — anti-regression", () => {
  it("matches baseline (or updates baseline in update mode)", async () => {
    const update = process.env.CANON_C2_UPDATE === "1";

    const root = process.cwd();
    const trainPath = path.join(root, "tests/validation/datasets/canonC2.train.v0.1.json");
    const holdoutPath = path.join(root, "tests/validation/datasets/canonC2.holdout.v0.1.json");
    const baselinePath = path.join(root, "tests/validation/baselines/canonC2.baseline.v0.1.json");

    const outCurrentPath = path.join(root, "tests/validation/out/canonC2.current.v0.1.json");
    const outDiffMdPath = path.join(root, "tests/validation/out/canonC2.diff.v0.1.md");

    const train = readJson<Dataset>(trainPath);
    const holdout = readJson<Dataset>(holdoutPath);
    const baseline = readJson<Baseline>(baselinePath);

    const analyze = await loadAnalyzeFn();

    const allCases: CanonCase[] = [...train.cases, ...holdout.cases];

    const currentById: Record<string, any> = {};
    for (const c of allCases) {
      let raw: any;
      try {
        raw = await (analyze as any)(c.word);
      } catch (e1) {
        // rare fallback if a chosen entrypoint needs a second arg
        try {
          raw = await (analyze as any)(c.word, "strict");
        } catch {
          raw = await (analyze as any)(c.word, { mode: "strict" });
        }
      }
      currentById[c.id] = projectForCanonC2V01(raw ?? {}, c.word);
    }

    fs.mkdirSync(path.dirname(outCurrentPath), { recursive: true });
    fs.writeFileSync(outCurrentPath, stableJson({ version: "canonC2.current.v0.1", cases: currentById }), "utf8");

    if (update) {
      const nextBaseline: Baseline = { version: baseline.version, cases: currentById };
      fs.writeFileSync(baselinePath, stableJson(nextBaseline), "utf8");

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
          `Canon C2 drift detected: ${drifts.length}/${allCases.length}`,
          `See: ${path.relative(root, outDiffMdPath)}`,
          "",
          "If this drift is intentional:",
          "  npm run canon:c2:update",
        ].join("\n")
      );
    }
  });
});

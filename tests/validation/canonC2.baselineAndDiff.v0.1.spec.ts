import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { computeValidationResultsV0_2, type ValidationRecordV01 } from "../../src/shared/validation/metrics.v0.2";

function readJson<T>(rel: string): T {
  const p = path.join(process.cwd(), rel);
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

function isObj(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

// canonicalize for stable JSON (key order) + stable diffs
function canon(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(canon);
  if (!isObj(x)) return x;
  const keys = Object.keys(x).sort();
  const out: Record<string, unknown> = {};
  for (const k of keys) out[k] = canon(x[k]);
  return out;
}

function loadSplit(splitPath: string, all: ValidationRecordV01[]): ValidationRecordV01[] {
  const raw = readJson<unknown>(splitPath);
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "string") {
    const ids = raw as string[];
    const byId = new Map(all.map((r) => [r.id, r]));
    return ids.map((id) => byId.get(id)).filter(Boolean) as ValidationRecordV01[];
  }
  return raw as ValidationRecordV01[];
}

type Diff = { path: string; a: unknown; b: unknown };

function diff(a: unknown, b: unknown, p = "$", out: Diff[] = [], limit = 200): Diff[] {
  if (out.length >= limit) return out;
  const ta = Array.isArray(a) ? "array" : typeof a;
  const tb = Array.isArray(b) ? "array" : typeof b;
  if (ta !== tb) { out.push({ path: p, a, b }); return out; }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) out.push({ path: `${p}.length`, a: a.length, b: b.length });
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) diff(a[i], b[i], `${p}[${i}]`, out, limit);
    return out;
  }

  if (isObj(a) && isObj(b)) {
    const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).sort();
    for (const k of keys) {
      if (out.length >= limit) break;
      const ha = Object.prototype.hasOwnProperty.call(a, k);
      const hb = Object.prototype.hasOwnProperty.call(b, k);
      if (!ha || !hb) out.push({ path: `${p}.${k}`, a: ha ? a[k] : undefined, b: hb ? b[k] : undefined });
      else diff(a[k], b[k], `${p}.${k}`, out, limit);
    }
    return out;
  }

  if (a !== b) out.push({ path: p, a, b });
  return out;
}

function short(v: unknown): string {
  try {
    const s = typeof v === "string" ? v : JSON.stringify(v);
    if (!s) return String(v);
    return s.length <= 140 ? s : s.slice(0, 137) + "...";
  } catch {
    return String(v);
  }
}

function renderMd(diffs: Diff[], baselineRel: string): string {
  const lines: string[] = [];
  lines.push("# Canon C2 Diff Report (v0.1)");
  lines.push("");
  lines.push("- Dataset: v0.2");
  lines.push(`- Baseline: \`${baselineRel}\``);
  lines.push(`- Diff count: ${diffs.length}`);
  lines.push("");
  if (!diffs.length) {
    lines.push("✅ No diffs. Baseline matches current output.");
    lines.push("");
    return lines.join("\n");
  }
  lines.push("| path | baseline | current |");
  lines.push("|---|---|---|");
  for (const d of diffs) lines.push(`| \`${d.path}\` | \`${short(d.a)}\` | \`${short(d.b)}\` |`);
  lines.push("");
  lines.push("> Note: diffs are truncated to 200 rows for stability.");
  lines.push("");
  return lines.join("\n");
}

function computeNow(): unknown {
  const all = readJson<ValidationRecordV01[]>("tests/validation/datasets/validation.dataset.v0.2.json");
  const train = loadSplit("tests/validation/datasets/validation.train.v0.2.json", all);
  const holdout = loadSplit("tests/validation/datasets/validation.holdout.v0.2.json", all);
  const trainOut = computeValidationResultsV0_2(train);
  const holdOut = computeValidationResultsV0_2(holdout);
  return canon({ schema: "canonC2.baseline.v0.1", dataset: "v0.2", train: trainOut, holdout: holdOut });
}

const BASELINE_REL = "tests/validation/baselines/canonC2.baseline.v0.1.v0.2.json";

const ARTIFACTS_DIR_REL = "docs/validation";
const CURRENT_REL = "docs/validation/canonC2.current.v0.2.json";
const REPORT_REL = "docs/validation/CANON_C2_DIFF_LATEST_v0.2.md";

function maybeWriteArtifacts(now: unknown) {
  if (process.env.CANON_C2_WRITE_ARTIFACTS !== "1") return;

  mkdirSync(path.join(process.cwd(), ARTIFACTS_DIR_REL), { recursive: true });
  writeFileSync(path.join(process.cwd(), CURRENT_REL), JSON.stringify(now, null, 2) + "\n", "utf8");

  const baselinePath = path.join(process.cwd(), BASELINE_REL);
  const baseline = existsSync(baselinePath) ? readJson<unknown>(BASELINE_REL) : null;
  const diffs = baseline ? diff(baseline, now) : [];
  const report = renderMd(diffs, BASELINE_REL);

  writeFileSync(path.join(process.cwd(), REPORT_REL), report + "\n", "utf8");
}

test("canonC2 baseline v0.1 (v0.2 dataset) matches current output", () => {
  const now = computeNow();
    maybeWriteArtifacts(now);

  if (process.env.CANON_C2_WRITE_BASELINE === "1") {
    mkdirSync(path.join(process.cwd(), "tests/validation/baselines"), { recursive: true });
    writeFileSync(path.join(process.cwd(), BASELINE_REL), JSON.stringify(now, null, 2) + "\n", "utf8");
      maybeWriteArtifacts(now);
      expect(true).toBe(true);
      return;
  }

  if (!existsSync(path.join(process.cwd(), BASELINE_REL))) {
    throw new Error(
      "Missing Canon C2 baseline. Generate it once with:\n" +
        "  CANON_C2_WRITE_BASELINE=1 npm test -- tests/validation/canonC2.baselineAndDiff.v0.1.spec.ts -u"
    );
  }

  const baseline = readJson<unknown>(BASELINE_REL);
  expect(now).toEqual(baseline);
});

test("canonC2 diff report v0.1 (markdown snapshot)", () => {
  const now = computeNow();
  if (!existsSync(path.join(process.cwd(), BASELINE_REL))) {
    expect(renderMd([], BASELINE_REL)).toMatchSnapshot();
    return;
  }
  const baseline = readJson<unknown>(BASELINE_REL);
  const diffs = diff(baseline, now);
  const report = renderMd(diffs, BASELINE_REL);
  expect(report).toMatchSnapshot();
});

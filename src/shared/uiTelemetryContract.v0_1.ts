/* UI Telemetry Contract v0.1
   Purpose:
   - Provide a single deterministic read-model over the engine JSON.
   - UI MUST NOT invent meaning. Only pick/format what exists.
   - Everything is null-safe and stable.
*/

export type TelemetryMode = "strict" | "open" | "unknown";

export type StageStatus = "RAN" | "SKIPPED" | "FAILED" | "UNKNOWN";

export interface StageFlag {
  id: "vowelExtract" | "math7" | "canonCheck" | "deepRoot" | "originClaim";
  label: string;
  status: StageStatus;
  detail?: string;
}

export interface ReadoutModelV0_1 {
  word: string;
  normalizedWord: string | null;

  mode: TelemetryMode;
  strictInput: string | null;

  engineVersion: string | null;
  contractVersion: string;

  vowelPath: string[] | null;
  vowelPathText: string | null;

  detected: boolean;

  latencyMs: number | null;

  candidatesCount: number;
  opsCount: number | null;
  signalsCount: number | null;

  stages: StageFlag[];
}

const CONTRACT_VERSION = "ui-telemetry-v0.1";

// ---------- helpers ----------
function isObj(x: unknown): x is Record<string, any> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function asString(x: unknown): string | null {
  return typeof x === "string" && x.trim().length > 0 ? x : null;
}

function asNumber(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

function asStringArray(x: unknown): string[] | null {
  if (!Array.isArray(x)) return null;
  const out = x.filter((v) => typeof v === "string" && v.length > 0);
  return out.length ? out : null;
}

function joinVowelPath(vowels: string[] | null): string | null {
  if (!vowels || vowels.length === 0) return null;
  return vowels.join(" → ");
}

function safeGet(root: any, path: string[]): any {
  let cur = root;
  for (const k of path) {
    if (!isObj(cur)) return undefined;
    cur = cur[k];
  }
  return cur;
}

// ---------- pickers ----------
export function pickWord(result: unknown): string {
  const w = asString(safeGet(result, ["word"]));
  return w ?? "";
}

export function pickNormalizedWord(result: unknown): string | null {
  // In your payload, "sanitized" is the closest stable normalized form.
  return (
    asString(safeGet(result, ["normalizedWord"])) ??
    asString(safeGet(result, ["sanitized"])) ??
    asString(safeGet(result, ["word", "normalized"])) ??
    asString(safeGet(result, ["word", "normalizedWord"]))
  );
}

export function pickMode(result: unknown): TelemetryMode {
  const m =
    asString(safeGet(result, ["mode"])) ??
    asString(safeGet(result, ["engineMeta", "mode"])) ??
    asString(safeGet(result, ["engine_meta", "mode"])) ??
    asString(safeGet(result, ["heart", "mode"]));

  if (!m) return "unknown";
  const mm = m.toLowerCase();
  if (mm === "strict") return "strict";
  if (mm === "open" || mm === "loose") return "open";
  return "unknown";
}

export function pickStrictInput(result: unknown): string | null {
  // Your system uses "evidence.basis" / "heartInstrumentV1.basisNfc" as the stable
  // input evidence string. We display it as strictInput telemetry.
  return (
    asString(safeGet(result, ["strictInput"])) ??
    asString(safeGet(result, ["telemetry", "strictInput"])) ??
    asString(safeGet(result, ["evidence", "basis"])) ??
    asString(safeGet(result, ["raw", "evidence", "basis"])) ??
    asString(safeGet(result, ["heartInstrumentV1", "basisNfc"])) ??
    asString(safeGet(result, ["heart", "math7", "primary", "basis"]))
  );
}

export function pickEngineVersion(result: unknown): string | null {
  return (
    asString(safeGet(result, ["engineVersion"])) ??
    asString(safeGet(result, ["engineMeta", "engineVersion"])) ??
    asString(safeGet(result, ["engine_meta", "version"])) ??
    asString(safeGet(result, ["meta", "version"])) ??
    asString(safeGet(result, ["heart", "engineVersion"]))
  );
}

export function pickLatencyMs(result: unknown): number | null {
  return (
    asNumber(safeGet(result, ["telemetry", "ms"])) ??
    asNumber(safeGet(result, ["telemetry", "durationMs"])) ??
    asNumber(safeGet(result, ["evidence", "solveMs"])) ??
    asNumber(safeGet(result, ["raw", "evidence", "solveMs"])) ??
    asNumber(safeGet(result, ["ms"]))
  );
}

export function pickVowelPath(result: unknown): string[] | null {
  // PRECEDENCE (important):
  // 1) evidence.surfaceVowels (your actual contract evidence for surface vowels)
  // 2) heart.math7.primary.vowels (basis-level vowel extraction)
  // 3) primaryPath.voicePath (UI-friendly surface voice path)
  // 4) fallbacks
  //
  // NOTE: heartInstrumentV1.surfaceVowels may differ by layer; we do NOT prefer it.
  return (
    asStringArray(safeGet(result, ["evidence", "surfaceVowels"])) ??
    asStringArray(safeGet(result, ["raw", "evidence", "surfaceVowels"])) ??
    asStringArray(safeGet(result, ["heart", "math7", "primary", "vowels"])) ??
    asStringArray(safeGet(result, ["raw", "heart", "math7", "primary", "vowels"])) ??
    asStringArray(safeGet(result, ["primaryPath", "voicePath"])) ??
    asStringArray(safeGet(result, ["raw", "primaryPath", "voicePath"])) ??
    asStringArray(safeGet(result, ["sevenVoices", "vowels"])) ??
    asStringArray(safeGet(result, ["vowelPath"]))
  );
}

export function pickCandidatesCount(result: unknown): number {
  const cands = safeGet(result, ["candidates"]);
  if (Array.isArray(cands)) return cands.length;

  const deepRoot = safeGet(result, ["deepRoot", "candidates"]);
  if (Array.isArray(deepRoot)) return deepRoot.length;

  const rawCands = safeGet(result, ["raw", "candidates"]);
  if (Array.isArray(rawCands)) return rawCands.length;

  return 0;
}

export function pickOpsCount(result: unknown): number | null {
  const ops =
    safeGet(result, ["evidence", "ops"]) ??
    safeGet(result, ["raw", "evidence", "ops"]) ??
    safeGet(result, ["ops"]);
  if (!Array.isArray(ops)) return null;
  return ops.length;
}

export function pickSignalsCount(result: unknown): number | null {
  const sig =
    safeGet(result, ["evidence", "signals"]) ??
    safeGet(result, ["raw", "evidence", "signals"]) ??
    safeGet(result, ["signals"]);
  if (!Array.isArray(sig)) return null;
  return sig.length;
}

// ---------- stage flags ----------
function stageFromPresence(
  id: StageFlag["id"],
  label: string,
  present: boolean | null,
  failed?: boolean,
  detail?: string
): StageFlag {
  if (failed) return { id, label, status: "FAILED", detail };
  if (present === true) return { id, label, status: "RAN", detail };
  if (present === false) return { id, label, status: "SKIPPED", detail };
  return { id, label, status: "UNKNOWN", detail };
}

export function computeStages(result: unknown): StageFlag[] {
  const vowelPath = pickVowelPath(result);
  const hasVowelExtract = !!(vowelPath && vowelPath.length > 0);

  const hasMath7 =
    !!safeGet(result, ["evidence", "math7"]) ||
    !!safeGet(result, ["raw", "evidence", "math7"]) ||
    !!safeGet(result, ["heart", "math7"]) ||
    !!safeGet(result, ["heartInstrumentV1", "math7"]);

  const hasCanon =
    !!safeGet(result, ["canon"]) ||
    !!safeGet(result, ["canonCheck"]) ||
    !!safeGet(result, ["canonResult"]) ||
    (Array.isArray(safeGet(result, ["wordMatrix", "canon"])) && safeGet(result, ["wordMatrix", "canon"]).length > 0);

  const hasDeepRoot =
    !!safeGet(result, ["deepRoot"]) ||
    !!safeGet(result, ["raw", "deepRoot"]);

  const hasOriginClaim =
    !!safeGet(result, ["originClaim"]) ||
    !!safeGet(result, ["raw", "originClaim"]);

  const originClaimFailed =
    safeGet(result, ["originClaim", "policy"]) === "FAILED" ||
    safeGet(result, ["originClaim", "status"]) === "FAILED" ||
    safeGet(result, ["raw", "originClaim", "policy"]) === "FAILED" ||
    safeGet(result, ["raw", "originClaim", "status"]) === "FAILED";

  return [
    stageFromPresence("vowelExtract", "vowelExtract", hasVowelExtract, false, hasVowelExtract ? undefined : "No surfaceVowels/voicePath present"),
    stageFromPresence("math7", "math7", !!hasMath7),
    stageFromPresence("canonCheck", "canonCheck", !!hasCanon),
    stageFromPresence("deepRoot", "deepRoot", !!hasDeepRoot),
    stageFromPresence("originClaim", "originClaim", !!hasOriginClaim, !!originClaimFailed),
  ];
}

export function buildReadoutModelV0_1(result: unknown): ReadoutModelV0_1 {
  const word = pickWord(result);
  const normalizedWord = pickNormalizedWord(result);
  const mode = pickMode(result);
  const strictInput = pickStrictInput(result);
  const engineVersion = pickEngineVersion(result);

  const vowelPath = pickVowelPath(result);
  const vowelPathText = joinVowelPath(vowelPath);
  const detected = !!(vowelPath && vowelPath.length > 0);

  const latencyMs = pickLatencyMs(result);
  const candidatesCount = pickCandidatesCount(result);

  const opsCount = pickOpsCount(result);
  const signalsCount = pickSignalsCount(result);

  const stages = computeStages(result);

  return {
    word,
    normalizedWord,
    mode,
    strictInput,
    engineVersion,
    contractVersion: CONTRACT_VERSION,
    vowelPath,
    vowelPathText,
    detected,
    latencyMs,
    candidatesCount,
    opsCount,
    signalsCount,
    stages,
  };
}

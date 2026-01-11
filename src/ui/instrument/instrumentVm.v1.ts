/**
 * Instrument VM (v0.1)
 *
 * UI must render ONLY this VM shape — never raw engine payload objects.
 * Input is `unknown`, output is stable and safe for React rendering.
 */

export type InstrumentVmV1 = {
  v: "instrument.vm.v0.1";
  wordShown: string | null;
  engineVersion: string | null;
  mode: string | null;
  topLang: string | null;
  vowelPath: string | null;

  // telemetry surfaces (VM-only; may be empty for now)
  claims: Array<{ id: string; summary: string; confidence?: string | null; evidenceRefs?: string[] }>;
  evidenceRefs: string[];
  signals: Array<{ k: string; v?: string | number | boolean | null }>;
};

/* ----------------------------- safe pickers ----------------------------- */

type Obj = Record<string, unknown>;

function asObj(x: unknown): Obj | null {
  return x && typeof x === "object" ? (x as Obj) : null;
}

function get(o: unknown, k: string): unknown {
  const obj = asObj(o);
  return obj ? obj[k] : undefined;
}

function getStr(o: unknown, k: string): string | null {
  const v = get(o, k);
  return typeof v === "string" ? v : null;
}

function getArr(o: unknown, k: string): unknown[] | null {
  const v = get(o, k);
  return Array.isArray(v) ? v : null;
}

function firstCandidate(root: unknown): Obj | null {
  const candidates = getArr(root, "candidates");
  const first = candidates?.[0];
  return asObj(first);
}

/* ----------------------------- VM builders ----------------------------- */

function pickWordShown(result: unknown): string | null {
  // prefer `word` (contract), then `normalizedWord`, then `input.word`
  return (
    getStr(result, "word") ??
    getStr(result, "normalizedWord") ??
    getStr(get(result, "input"), "word")
  );
}

function pickEngineVersion(result: unknown): string | null {
  // common placements across versions
  return (
    getStr(result, "engineVersion") ??
    getStr(get(result, "meta"), "engineVersion") ??
    getStr(get(result, "contract"), "engineVersion")
  );
}

function pickMode(result: unknown): string | null {
  return (
    getStr(result, "mode") ??
    getStr(get(result, "input"), "mode") ??
    getStr(get(result, "meta"), "mode")
  );
}

function pickTopLang(result: unknown): string | null {
  // candidate[0].language is the most common
  const c0 = firstCandidate(result);
  return getStr(c0, "language") ?? getStr(result, "topLang");
}

function pickVowelPath(result: unknown): string | null {
  // Try the common places in your payload family:
  // - primaryPath.voicePath (array) => join with "-"
  // - candidates[0].vowelPath (string)
  // - vowelPath (string)
  const primaryPath = get(result, "primaryPath");
  const voicePath = get(primaryPath, "voicePath");
  if (Array.isArray(voicePath) && voicePath.every((x) => typeof x === "string")) {
    return (voicePath as string[]).join("-");
  }

  const c0 = firstCandidate(result);
  return getStr(c0, "vowelPath") ?? getStr(result, "vowelPath");
}

export function buildInstrumentVmV1(result: unknown): InstrumentVmV1 {
  // IMPORTANT: do not include `result` or any raw objects in the VM
  // Only pick small primitives/arrays of primitives.

  const wordShown = pickWordShown(result);
  const engineVersion = pickEngineVersion(result);
  const mode = pickMode(result);
  const topLang = pickTopLang(result);
  const vowelPath = pickVowelPath(result);

  return {
    v: "instrument.vm.v0.1",
    wordShown,
    engineVersion,
    mode,
    topLang,
    vowelPath,
    claims: [],
    evidenceRefs: [],
    signals: [],
  };
}

/**
 * Engine Contract v1 (draft scaffold)
 *
 * Goal:
 * - Define a single canonical output shape for the engine.
 * - Provide runtime validation hooks (guards/asserts).
 * - Provide stable JSON serialization for golden tests and caching.
 *
 * IMPORTANT:
 * - This file is intentionally not wired into runtime yet.
 * - Next step will be: capture real engine output for canon words and align this contract.
 */

export const ENGINE_CONTRACT_VERSION = "v1" as const;

type UnknownRecord = Record<string, unknown>;

function isRecord(x: unknown): x is UnknownRecord {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every(isString);
}

/**
 * Candidate-level contract (minimal fields; will be tightened after we snapshot real output).
 */
export type EngineCandidateV1 = {
  language: string;
  form: string;
  decomposition: {
    parts: string[];
    ops?: string[];
  };
  functional: {
    statement: string;
    action?: string;
    instrument?: string;
    unit?: string;
  };
  vowel_path: string;
  ring_fit?: string;
  signals?: string[];
  notes?: string[];
};

export type EngineResultV1 = {
  version: typeof ENGINE_CONTRACT_VERSION;
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string;
  candidates: EngineCandidateV1[];
  meta?: UnknownRecord;
};

export function isEngineCandidateV1(x: unknown): x is EngineCandidateV1 {
  if (!isRecord(x)) return false;

  if (!isString(x.language)) return false;
  if (!isString(x.form)) return false;

  if (!isRecord(x.decomposition)) return false;
  if (!isStringArray(x.decomposition.parts)) return false;
  if (x.decomposition.ops !== undefined && !isStringArray(x.decomposition.ops)) return false;

  if (!isRecord(x.functional)) return false;
  if (!isString(x.functional.statement)) return false;
  if (x.functional.action !== undefined && !isString(x.functional.action)) return false;
  if (x.functional.instrument !== undefined && !isString(x.functional.instrument)) return false;
  if (x.functional.unit !== undefined && !isString(x.functional.unit)) return false;

  if (!isString(x.vowel_path)) return false;
  if (x.ring_fit !== undefined && !isString(x.ring_fit)) return false;
  if (x.signals !== undefined && !isStringArray(x.signals)) return false;
  if (x.notes !== undefined && !isStringArray(x.notes)) return false;

  return true;
}

export function isEngineResultV1(x: unknown): x is EngineResultV1 {
  if (!isRecord(x)) return false;

  if (x.version !== ENGINE_CONTRACT_VERSION) return false;
  if (!isString(x.word)) return false;
  if (!isString(x.mode)) return false;
  if (!isString(x.alphabet)) return false;
  if (!isString(x.engineVersion)) return false;

  if (!Array.isArray(x.candidates) || !x.candidates.every(isEngineCandidateV1)) return false;
  if (x.meta !== undefined && !isRecord(x.meta)) return false;

  return true;
}

export function assertEngineResultV1(x: unknown): asserts x is EngineResultV1 {
  if (!isEngineResultV1(x)) {
    const preview =
      typeof x === "string" ? x.slice(0, 200) : JSON.stringify(safeJson(x), null, 2).slice(0, 500);
    throw new Error(`EngineResultV1 validation failed. Preview: ${preview}`);
  }
}

/**
 * Stable JSON stringify for goldens/caching.
 * - Sorts object keys recursively.
 * - Preserves array order (engine must be deterministic).
 * - Detects cycles and throws with a clear message.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(stableSort(value), null, 2);
}

function stableSort(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null) return null;

  const t = typeof value;

  if (t === "string" || t === "number" || t === "boolean") return value;
  if (t === "bigint") return value.toString();
  if (t === "undefined") return null;

  if (Array.isArray(value)) {
    return value.map((v) => stableSort(v, seen));
  }

  if (t === "object") {
    const obj = value as object;

    if (seen.has(obj)) {
      throw new Error("stableStringify: circular reference detected");
    }
    seen.add(obj);

    if (value instanceof Date) return value.toISOString();

    const rec = value as UnknownRecord;
    const keys = Object.keys(rec).sort();

    const out: UnknownRecord = {};
    for (const k of keys) {
      const v = rec[k];
      if (v === undefined) continue;
      out[k] = stableSort(v, seen);
    }

    return out;
  }

  return null;
}

function safeJson(x: unknown): unknown {
  try {
    return stableSort(x);
  } catch {
    return { error: "unserializable value" };
  }
}

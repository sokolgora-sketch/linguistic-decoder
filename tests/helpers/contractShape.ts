// tests/helpers/contractShape.ts
//
// Contract smoke helpers: lock public JSON *shape* while ignoring volatile internals.

export type Jsonish =
  | null
  | boolean
  | number
  | string
  | Jsonish[]
  | { [k: string]: Jsonish };

/**
 * Throws if value is not JSON-serializable in a stable way.
 * (No functions, undefined, symbols, bigint, NaN/Infinity, Date, Map/Set, etc.)
 */
export function assertJsonSafe(value: any, path = "$"): void {
  const t = typeof value;

  if (
    value === undefined ||
    t === "function" ||
    t === "symbol" ||
    t === "bigint"
  ) {
    throw new Error(`Non-JSON value at ${path}: ${t}`);
  }

  if (value === null) return;

  if (t === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Non-finite number at ${path}: ${value}`);
    }
    return;
  }

  if (t === "string" || t === "boolean") return;

  // Arrays
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      assertJsonSafe(value[i], `${path}[${i}]`);
    }
    return;
  }

  // Objects
  if (t === "object") {
    // Reject known non-plain objects
    const proto = Object.getPrototypeOf(value);
    const isPlain = proto === Object.prototype || proto === null;
    if (!isPlain) {
      const name = value?.constructor?.name ?? "Object";
      throw new Error(`Non-plain object at ${path}: ${name}`);
    }

    for (const [k, v] of Object.entries(value)) {
      assertJsonSafe(v, `${path}.${k}`);
    }
    return;
  }

  throw new Error(`Unhandled type at ${path}: ${t}`);
}

/**
 * Returns a stable "shape digest" for top-level keys:
 * - sorted keys
 * - does NOT include values (so we avoid churn)
 */
export function topLevelKeysDigest(obj: Record<string, any>): string[] {
  return Object.keys(obj).sort((a, b) => a.localeCompare(b));
}

/**
 * Minimal type-checker for tag fields: must exist and be JSON-ish object/array.
 * (We do NOT lock inner tag contents here.)
 */
export function expectJsonishTag(value: any, label: string): void {
  // allow null if you ever intentionally disable a tag set
  if (value === null) return;

  const t = typeof value;
  const ok =
    t === "object" && value !== undefined; // arrays are also "object", ok

  if (!ok) {
    throw new Error(`Tag field '${label}' must be object/array/null, got: ${t}`);
  }
}

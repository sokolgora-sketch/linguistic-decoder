/**
 * Engine Contract v1 (scaffold)
 *
 * This file provides:
 * - A version constant
 * - Deterministic, JSON-safe normalization (stable key ordering)
 * - Deterministic JSON stringification for goldens/caching
 *
 * IMPORTANT:
 * - stableStringify() MUST output real JSON text (no wrapper quotes).
 * - It MUST throw on circular structures (tests rely on this).
 */

export const ENGINE_CONTRACT_VERSION = "v1" as const;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [k: string]: JsonValue };

export type StableNormalizeOptions = {
  onCircular?: "throw" | "replace";
  circularValue?: string; // used when onCircular="replace"
};

/**
 * Convert arbitrary JS values into JSON-safe values with:
 * - deterministic object key ordering
 * - safe representations for non-JSON primitives
 * - circular handling (throw by default)
 *
 * Note: we detect circulars using an active recursion stack, not a global visited set,
 * so shared references (DAG) do not falsely trigger circular errors.
 */
export function stableNormalize(
  input: unknown,
  opts: StableNormalizeOptions = {}
): JsonValue {
  const onCircular = opts.onCircular ?? "throw";
  const circularValue = opts.circularValue ?? "[Circular]";
  const stack = new WeakSet<object>();

  const norm = (x: unknown): JsonValue => {
    if (x === null) return null;

    const t = typeof x;

    if (t === "string" || t === "number" || t === "boolean") return x;
    if (t === "bigint") return `${x}n`;
    if (t === "undefined") return null;
    if (t === "function") return "[Function]";
    if (t === "symbol") return String(x);

    if (x instanceof Date) return x.toISOString();

    if (x instanceof Error) {
      return {
        name: x.name,
        message: x.message,
        stack: x.stack ?? null,
      };
    }

    if (Array.isArray(x)) {
      return x.map((v) => norm(v));
    }

    if (x instanceof Map) {
      const entries = Array.from(x.entries()).map(([k, v]) => [norm(k), norm(v)]);
      entries.sort((a, b) => JSON.stringify(a[0]).localeCompare(JSON.stringify(b[0])));
      return entries as unknown as JsonValue;
    }

    if (x instanceof Set) {
      const items = Array.from(x.values()).map((v) => norm(v));
      items.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      return items;
    }

    if (t === "object") {
      const obj = x as object;

      if (stack.has(obj)) {
        if (onCircular === "throw") throw new Error("circular structure");
        return circularValue;
      }

      stack.add(obj);
      try {
        const rec = x as Record<string, unknown>;
        const out: Record<string, JsonValue> = {};

        for (const key of Object.keys(rec).sort()) {
          if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
          out[key] = norm(rec[key]);
        }

        return out;
      } finally {
        stack.delete(obj);
      }
    }

    return String(x);
  };

  return norm(input);
}

/**
 * Deterministic JSON text. This is what we snapshot/cache.
 * Throws on circulars (by design).
 */
export function stableStringify(input: unknown, space: number = 2): string {
  const normalized = stableNormalize(input, { onCircular: "throw" });
  return JSON.stringify(normalized, null, space);
}

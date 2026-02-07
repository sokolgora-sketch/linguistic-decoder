// tests/_helpers/snapshotNormalize.v0.1.ts
// Snapshot Normalization Doctrine v0.1
// Only strip volatile timestamps from ANY `meta` object: created/generatedAt.
// Do not strip anything else.

export const VOLATILE_META_KEYS_V0_1 = ["created", "generatedAt"] as const;
type VolatileMetaKey = (typeof VOLATILE_META_KEYS_V0_1)[number];

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

export function normalizeForSnapshotV0_1<T>(input: T): T {
  return walk(input) as T;

  function walk(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(walk);
    if (!isPlainObject(node)) return node;

    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "meta" && isPlainObject(v)) {
        const metaOut: Record<string, unknown> = {};
        for (const [mk, mv] of Object.entries(v)) {
          if ((VOLATILE_META_KEYS_V0_1 as readonly string[]).includes(mk as VolatileMetaKey)) continue;
          metaOut[mk] = walk(mv);
        }
        out[k] = metaOut;
        continue;
      }

      out[k] = walk(v);
    }
    return out;
  }
}

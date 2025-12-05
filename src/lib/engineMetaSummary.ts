// src/lib/engineMetaSummary.ts

/**
 * Minimal metadata we care about for displaying engine info.
 */
export type EngineMetaInput = {
  engineVersion?: string | null;
  mode?: string | null;
  alphabet?: string | null;
};

export type EngineMetaSummary = {
  version: string;
  created: string;
};


/**
 * Build a compact, human-friendly summary of the engine meta.
 *
 * Examples:
 *  - { engineVersion: "2025-11-16-core-2", mode: "strict", alphabet: "auto" }
 *    → "2025-11-16-core-2 · strict · auto"
 *
 *  - { engineVersion: "core-v1" }
 *    → "core-v1"
 *
 *  - {} or all fields empty
 *    → "unknown"
 */
export function buildEngineMetaSummary(meta: EngineMetaInput): string {
  const parts: string[] = [];

  const v = meta.engineVersion?.trim();
  const m = meta.mode?.trim();
  const a = meta.alphabet?.trim();

  if (v) parts.push(v);
  if (m) parts.push(m);
  if (a) parts.push(a);

  if (parts.length === 0) {
    return "unknown";
  }

  return parts.join(" · ");
}

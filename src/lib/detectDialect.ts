// src/lib/detectDialect.ts

export type AlbanianDialect = "geg" | "tosk";

export function detectAlbanianDialect(raw: string): AlbanianDialect {
  // Normalize, just in case
  const normalized = raw.normalize("NFC");

  // Very simple heuristic for now:
  // - Words with ë → Tosk-orthography
  // - Words without ë → default to Geg
  const hasEWithDots = /ë/i.test(normalized);
  return hasEWithDots ? "tosk" : "geg";
}

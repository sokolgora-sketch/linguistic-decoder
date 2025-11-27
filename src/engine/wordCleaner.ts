// src/engine/wordCleaner.ts

export interface WordInput {
  raw: string;            // original user input
  normalized: string;     // cleaned, lowercase, stripped
  languageHint?: string;  // e.g. "en", "sq"
  phoneticHint?: string;  // reserved for later (IPA, etc.)
}

export function cleanWord(raw: string, languageHint?: string): WordInput {
  const trimmed = (raw ?? "").trim();

  // basic lowercase
  const lower = trimmed.toLowerCase();

  // strip accents/diacritics (é -> e, ë -> e, etc.)
  const normalized = lower
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")   // remove combining marks
    .replace(/\s+/g, "");              // remove spaces for now

  return {
    raw,
    normalized,
    languageHint,
    phoneticHint: undefined,
  };
}

// src/engine/wordCleaner.ts
// Basic normalisation for ZË-RO: 7-Vowel Etymology Engine

export interface WordInput {
  raw: string;            // original user input
  normalized: string;     // cleaned form (lowercase, no spaces, no accents)
  languageHint?: string;  // optional, e.g. "en"
  phoneticHint?: string;  // reserved for later
}

export function cleanWord(raw: string, languageHint?: string): WordInput {
  const trimmed = raw.trim();

  // lower-case
  const lower = trimmed.toLowerCase();

  // strip accents (e.g. é -> e), remove spaces
  const normalized = lower
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");

  return {
    raw,
    normalized,
    languageHint,
    phoneticHint: undefined,
  };
}

// src/engine/wordCleaner.ts

export interface WordInput {
  raw: string;            // original user input
  normalized: string;     // cleaned form (lowercase, no spaces/diacritics)
  languageHint?: string;  // optional ISO-ish code, e.g. "en"
  phoneticHint?: string;  // reserved for later
}

export function cleanWord(raw: string, languageHint?: string): WordInput {
  const trimmed = raw.trim();

  // basic lowercase
  const lower = trimmed.toLowerCase();

  // strip combining accents (NFKD) – keeps just base letters
  const normalized = lower
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ""); // remove spaces for now

  return {
    raw,
    normalized,
    languageHint,
    phoneticHint: undefined,
  };
}

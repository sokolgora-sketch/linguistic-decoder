// src/engine/wordCleaner.ts

export interface WordInput {
  raw: string;            // original user input
  normalized: string;     // cleaned, lowercase
  languageHint?: string;
  phoneticHint?: string;  // reserved for later
}

export function cleanWord(raw: string, languageHint?: string): WordInput {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  // strip diacritics
  const normalized = lower.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

  return {
    raw,
    normalized,
    languageHint,
    phoneticHint: undefined,
  };
}

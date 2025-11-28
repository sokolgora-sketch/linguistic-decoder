// src/engine/wordCleaner.ts
export function cleanWord(word: string, hint?: string) {
  // Some older builds returned { word, languageHint }
  // Normalize it so everything downstream works
  if (!word) return "";
  return typeof word === "string" ? word.trim().toLowerCase() : String(word);
}

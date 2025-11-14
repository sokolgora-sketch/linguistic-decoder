
import type { Alphabet } from "./engineConfig";

export function normalizeAlphabet(input?: unknown, fallback: Alphabet = "auto"): Alphabet {
  const v = String(input ?? "").trim().toLowerCase();
  if (v === "auto" || v === "albanian" || v === "latin") return v as Alphabet;
  return fallback;
}

export function detectAlphabet(word: string): Exclude<Alphabet, "auto"> {
  // Heuristics for Albanian
  return /[ëç]|xh|zh|sh|dh|th|nj|gj|ll|rr|q/i.test(word) ? "albanian" : "latin";
}

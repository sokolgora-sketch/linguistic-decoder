import type { AnalysisResult, Candidate } from "./types";

export const ENGINE_VERSION_V1 = "v1.0.0";

/**
 * v1 normalization (intentionally simple + deterministic)
 * - trims
 * - lowercases
 * - collapses whitespace
 * - if multiple tokens, uses the first token (v1 is single-word)
 */
export function normalizeWordV1(input: string): { normalizedWord: string; notes: string[] } {
  const notes: string[] = [];

  const raw = String(input ?? "");
  const trimmed = raw.trim();

  if (!trimmed) return { normalizedWord: "", notes };

  const collapsed = trimmed.replace(/\s+/g, " ");
  const tokens = collapsed.split(" ").filter(Boolean);

  if (tokens.length > 1) {
    notes.push(`Input contained spaces; v1 uses the first token: "${tokens[0]}"`);
  }

  // Keep diacritics (ë stays ë). Normalize Unicode form to reduce weird edge cases.
  const normalized = tokens[0].normalize("NFKC").toLowerCase();

  return { normalizedWord: normalized, notes };
}

/**
 * Extracts Seven-vowel vowel path from a normalized word.
 * Supported vowels: A, E, I, O, U, Y, Ë (case-insensitive)
 * Output: "A-I-Ë" or "" if none.
 */
export function extractVowelPathV1(normalizedWord: string): string {
  const map: Record<string, string> = {
    a: "A",
    e: "E",
    i: "I",
    o: "O",
    u: "U",
    y: "Y",
    "ë": "Ë",
    "Ë": "Ë",
    A: "A",
    E: "E",
    I: "I",
    O: "O",
    U: "U",
    Y: "Y",
  };

  const out: string[] = [];
  for (const ch of normalizedWord) {
    const v = map[ch];
    if (v) out.push(v);
  }
  return out.join("-");
}

/**
 * v1 minimal engine contract:
 * - deterministic
 * - text-only candidates
 * - no scores, no modes
 */
export function analyzeWordV1(word: string): AnalysisResult {
  const { normalizedWord, notes } = normalizeWordV1(word);

  const vowelPath = normalizedWord ? extractVowelPathV1(normalizedWord) : "";

  const candidateNotes: string[] = [];
  if (notes.length) candidateNotes.push(...notes);

  if (!normalizedWord) {
    const emptyCandidate: Candidate = {
      language: "unknown",
      form: "",
      decomposition: [],
      vowelPath: "",
      functionalStatement:
        "No analysis produced because the input was empty after normalization.",
      notes: candidateNotes.length ? candidateNotes : undefined,
    };

    return {
      word,
      normalizedWord: "",
      candidates: [emptyCandidate],
      engineVersion: ENGINE_VERSION_V1,
    };
  }

  const c0: Candidate = {
    language: "unknown",
    form: normalizedWord,
    decomposition: [normalizedWord],
    vowelPath,
    functionalStatement:
      "v1 returns a minimal deterministic analysis: surface form is preserved, decomposition is the whole word, and the vowel path is extracted from the Seven-vowel set (A/E/I/O/U/Y/Ë).",
    notes: candidateNotes.length ? candidateNotes : undefined,
  };

  return {
    word,
    normalizedWord,
    candidates: [c0],
    engineVersion: ENGINE_VERSION_V1,
  };
}

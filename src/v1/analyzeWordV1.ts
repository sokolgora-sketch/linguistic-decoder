import type { AnalysisResult, Candidate, EvidenceV1, SevenVowel } from "./types";
import { ENGINE_VERSION_V1, CONTRACT_VERSION_V1, RULESET_VERSION_V1, CANON_VERSION_V1 } from "./versions.v1";
const VOWEL_INDEX: Record<SevenVowel, number> = {
  A: 0,
  E: 1,
  I: 2,
  O: 3,
  U: 4,
  Y: 5,
  Ë: 6,
};

function extractSevenVowelsV1(normalizedWord: string): SevenVowel[] {
  // Uses same logic as extractVowelPathV1 but returns typed vowels
  const out: SevenVowel[] = [];
  for (const ch of normalizedWord) {
    switch (ch) {
      case "a":
        out.push("A");
        break;
      case "e":
        out.push("E");
        break;
      case "i":
        out.push("I");
        break;
      case "o":
        out.push("O");
        break;
      case "u":
        out.push("U");
        break;
      case "y":
        out.push("Y");
        break;
      case "ë":
        out.push("Ë");
        break;
      default:
        break;
    }
  }
  return out;
}

function buildEvidenceV1(basis: string): EvidenceV1 {
  const surfaceVowels = extractSevenVowelsV1(basis);
  const indices = surfaceVowels.map((v) => VOWEL_INDEX[v]);
  const sum = indices.reduce((a, b) => a + b, 0);
  const totalMod7 = ((sum % 7) + 7) % 7;

  return {
    basis,
    surfaceVowels,
    surfacePath: surfaceVowels.join("-"),
    math7: { vowels: surfaceVowels, indices, sum, totalMod7 },
  };
}

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
 * v1 minimal engine contract:
 * - deterministic
 * - text-only candidates
 * - no scores, no modes
 */
export function analyzeWordV1(word: string): AnalysisResult {
  const { normalizedWord, notes } = normalizeWordV1(word);

  const warnings: string[] = [];
  if (notes.length) warnings.push(...notes);


  const meta = {
    engineVersion: ENGINE_VERSION_V1,
    contractVersion: CONTRACT_VERSION_V1,
    rulesetVersion: RULESET_VERSION_V1,
    canonVersion: CANON_VERSION_V1,
  };
  if (!normalizedWord) {
const emptyCandidate: Candidate = {
      language: "unknown",
      form: "",
      decomposition: [],
      vowelPath: "",
      functionalStatement:
        "No analysis produced because the input was empty after normalization.",
      notes: warnings.length ? warnings : undefined,
    };

    return {
      word,
      normalizedWord: "",
      candidates: [emptyCandidate],
      engineVersion: ENGINE_VERSION_V1,
      evidence: buildEvidenceV1(""), // stable, deterministic
      meta,

      warnings: warnings.length ? warnings : undefined,
    };
  }

  const basis = normalizedWord; // Phase 1: exact basis used for surface analysis
  const evidence = buildEvidenceV1(basis);

  const c0: Candidate = {
    language: "unknown",
    form: normalizedWord,
    decomposition: [normalizedWord],
    vowelPath: evidence.surfacePath,
    functionalStatement:
      "v1 returns a minimal deterministic analysis: surface form is preserved, decomposition is the whole word, and the vowel path is extracted from the Seven-vowel set (A/E/I/O/U/Y/Ë).",
    notes: warnings.length ? warnings : undefined,
  };

  return {
    word,
    normalizedWord,
    candidates: [c0],
    engineVersion: ENGINE_VERSION_V1,
    evidence,
    meta,

    warnings: warnings.length ? warnings : undefined,
  };
}

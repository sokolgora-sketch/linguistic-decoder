
import { buildDeepRoot } from "../shared/deepRoot.v1";
import type { AnalysisResult, Candidate, EvidenceV1, SevenVowel } from "./types";
import { buildRootMapV1 } from "@/shared/deepRoot.rootMap.builder.v1";
import {
  CANON_VERSION_V1,
  CONTRACT_VERSION_V1,
  ENGINE_VERSION_V1,
  RULESET_VERSION_V1,
} from "./versions.v1";
import { totalMod7FromSum0to6 } from "./math7.core.v1";
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

function buildEvidenceV1(
  basis: string,
  normalizationSteps: string[]
): EvidenceV1 {
  const surfaceVowels = extractSevenVowelsV1(basis);
  const indices = surfaceVowels.map((v) => VOWEL_INDEX[v]);
  const sum0to6 = indices.reduce((a, b) => a + b, 0);
  const totalMod7 = totalMod7FromSum0to6(sum0to6);

  const signals: string[] = ["EVIDENCE_V1"];
  if (!basis) signals.push("EMPTY_BASIS");

  return {
    basis,
    surfaceVowels,
    surfacePath: surfaceVowels.join("-"),
    math7: { vowels: surfaceVowels, indices, sum: sum0to6, totalMod7 },
    normalizationSteps: normalizationSteps ?? [],
    ops: [],
    notes: [],
    signals,
  };
}

/**
 * v1 normalization (intentionally simple + deterministic)
 * - trims
 * - lowercases
 * - collapses whitespace
 * - if multiple tokens, uses the first token (v1 is single-word)
 */
export function normalizeWordV1(
  input: string
): { normalizedWord: string; notes: string[] } {
  const notes: string[] = [];

  const raw = String(input ?? "");
  const trimmed = raw.trim();

  if (!trimmed) return { normalizedWord: "", notes };

  const collapsed = trimmed.replace(/\s+/g, " ");
  const tokens = collapsed.split(" ").filter(Boolean);

  if (tokens.length > 1) {
    notes.push(
      `Input contained spaces; v1 uses the first token: "${tokens[0]}"`
    );
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
      evidence: buildEvidenceV1("", notes), // stable, deterministic
      meta,

      warnings: warnings.length ? warnings : undefined,
    };
  }

  const basis = normalizedWord; // Phase 1: exact basis used for surface analysis
  const evidence = buildEvidenceV1(basis, notes);

  const result: AnalysisResult = {
    word,
    normalizedWord,
    candidates: [],
    engineVersion: ENGINE_VERSION_V1,
    evidence,
    meta,

    warnings: warnings.length ? warnings : undefined,
  };

  const payload = { basis: normalizedWord, evidence };
  const deepRoot = buildDeepRoot(payload);
  if (deepRoot) {
    (result as any).deepRoot = deepRoot;
  }

  const minRootsForRootMap =
    Array.isArray((deepRoot as any)?.hypotheses)
      ? (deepRoot as any).hypotheses
      : [];

  const rootMap = buildRootMapV1({
    basis: normalizedWord, // stable basis
    minRoots: minRootsForRootMap,
    heartPrimaryPath:
    // Prefer canonical Heart math7 primary vowels (stable contract)
    // Fallback: primaryPath.voicePath (if present in this pipeline layer)
    (result as any)?.heart?.math7?.primary?.vowels ??
    (result as any)?.primaryPath?.voicePath ??
    null,
});

  // Emit at top-level (contract field)
  if (rootMap) {
    (result as any).rootMap = rootMap;
  }

  const c0: Candidate = {
    language: "unknown",
    form: normalizedWord,
    decomposition: [normalizedWord],
    vowelPath: evidence.surfacePath,
    functionalStatement:
      "v1 returns a minimal deterministic analysis: surface form is preserved, decomposition is the whole word, and the vowel path is extracted from the Seven-vowel set (A/E/I/O/U/Y/Ë).",
    notes: warnings.length ? warnings : undefined,
  };

  result.candidates.push(c0);

  return result;
}

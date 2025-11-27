// src/engine/wordAnalyzer.ts

import type { WordInput } from "./wordCleaner";
import {
  generateCandidates,
  type CandidateForm,
  type LanguageCode,
} from "./wordCandidates";

import type { VowelId } from "../core/sevenVowelsCore";
import { VOWEL_TRAITS } from "../core/sevenVowelsTraits";

export interface CandidateAnalysis {
  language: LanguageCode;
  form: string;

  decomposition: string[];       // e.g. ["DA", "M"]
  functionalStatement: string;   // short explanation in plain language
  vowelPath: VowelId[];          // ["A", "Ë"], etc.
  notes: string[];               // extra comments / reasoning

  dominantVowel?: VowelId;
  traitsSummary?: string;
}

export interface WordAnalysisResult {
  word: WordInput;
  candidates: CandidateAnalysis[];
}

/**
 * Main ZË-RO analyzer entry point.
 * You give it a cleaned word, it returns all PASS candidates.
 */
export function analyzeWord(cleaned: WordInput): WordAnalysisResult {
  const candidateForms = generateCandidates(cleaned);
  const analyses: CandidateAnalysis[] = [];

  for (const c of candidateForms) {
    const analysis = analyzeCandidate(c);
    if (analysis) {
      analyses.push(analysis);
    }
  }

  return {
    word: cleaned,
    candidates: analyses,
  };
}

// ---------------------------------------------------------------------------
// INTERNAL HELPERS
// ---------------------------------------------------------------------------

function analyzeCandidate(c: CandidateForm): CandidateAnalysis | null {
  const { language, form, fromWord } = c;
  const normalizedForm = form.toLowerCase();

  // v1: only handle canonical test word "damage"
  if (fromWord === "damage") {
    if (
      language === "sq" &&
      ["dëm", "dem", "dam", "dom"].includes(normalizedForm)
    ) {
      return buildDamageSqAnalysis(c);
    }

    if (language === "la" && normalizedForm === "damnum") {
      return buildDamageLaAnalysis(c);
    }

    // Others (en/fr) are currently treated as non-passing.
    return null;
  }

  // TODO: handle "study", "mathematics", etc. later.
  return null;
}

function buildDamageSqAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "Ë"]; // DA (A) + Ë closure

  const dominantVowel: VowelId = "A";
  const aTraits = VOWEL_TRAITS["A"];
  const eTraits = VOWEL_TRAITS["Ë"];

  const traitsSummary =
    `Dominant vowel A (${aTraits.polarity}, ${aTraits.role}): ${aTraits.personality} ` +
    `Ë (${eTraits.polarity}, ${eTraits.role}) closes the process: ${eTraits.personality}`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DA", "M"],
    functionalStatement:
      "DA = divide, cut, separate; M = the affected body/unit. " +
      "Together they express the act of cutting or harming a unit – the core function of 'damage'.",
    vowelPath,
    notes: [
      "DA element survives across dëm/dam/dom, always tied to harm/loss.",
      "A at the start marks an initiating, outward cutting action.",
      "Ë marks consequence settling back into the unit (loss that remains).",
    ],
    dominantVowel,
    traitsSummary,
  };
}

function buildDamageLaAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "U"]; // DAM + NUM → A → U

  const dominantVowel: VowelId = "A";
  const aTraits = VOWEL_TRAITS["A"];
  const uTraits = VOWEL_TRAITS["U"];

  const traitsSummary =
    `A (${aTraits.polarity}, ${aTraits.role}) initiates the cut. ` +
    `U (${uTraits.polarity}, ${uTraits.role}) pulls the effect down into stored loss.`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DAM", "NUM"],
    functionalStatement:
      "DAM = act of harm/cut based on DA; NUM = counted unit/amount. " +
      "Together they express 'a quantified harm' – damage as measurable loss.",
    vowelPath,
    notes: [
      "Shares DA-root with Albanian dëm/dam/dom: cutting/harming action is stable.",
      "Latin -num adds the sense of counted amount (NUM), turning harm into measurable loss.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

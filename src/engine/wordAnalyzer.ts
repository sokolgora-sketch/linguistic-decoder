// src/engine/wordAnalyzer.ts

import type { WordInput } from "./wordCleaner";
import type { CandidateForm, LanguageCode } from "./wordCandidates";
import { generateCandidates } from "./wordCandidates";
import type { VowelId } from "@/core/sevenVowelsCore";
import { VOWEL_TRAITS } from "@/core/sevenVowelsTraits";

export interface CandidateAnalysis {
  language: LanguageCode;
  form: string;

  decomposition: string[];       // ["DA", "M"], ["DAM", "NUM"], ...
  functionalStatement: string;   // human explanation
  vowelPath: VowelId[];          // ["A", "Ë"], ["A", "U"], ...

  notes: string[];               // reasoning trail

  dominantVowel?: VowelId;
  traitsSummary?: string;
}

export interface WordAnalysisResult {
  word: WordInput;
  candidates: CandidateAnalysis[];
}

/**
 * Top-level: given a cleaned word, run candidates + analysis.
 */
export function analyzeWord(cleaned: WordInput): WordAnalysisResult {
  const candidateForms = generateCandidates(cleaned);
  const analyses: CandidateAnalysis[] = [];

  for (const c of candidateForms) {
    const analysis = analyzeCandidate(c);
    if (analysis) analyses.push(analysis);
  }

  return {
    word: cleaned,
    candidates: analyses,
  };
}

/**
 * For now, we implement explicit logic for our canon test words.
 * Later we generalize this into rule-based decomposition.
 */
function analyzeCandidate(c: CandidateForm): CandidateAnalysis | null {
  const base = c.fromWord.toLowerCase();
  const form = c.form.toLowerCase();

  if (base === "damage") {
    if (c.language === "sq" && ["dëm", "dem", "dam", "dom"].includes(form)) {
      return buildDamageSqAnalysis(c);
    }
    if (c.language === "la" && form === "damnum") {
      return buildDamageLaAnalysis(c);
    }
    // ignore other candidates for now
    return null;
  }

  // TODO: add similar specialised analyzers for "study", "mathematics", etc.
  return null;
}

// ---- Canon word: DAMAGE ----

function buildDamageSqAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "Ë"]; // DA core + Ë closure

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
      "DA = divide, cut, separate; M = the affected unit/body. " +
      "Together they express the act of cutting or harming a unit – the living function of 'damage'.",
    vowelPath,
    notes: [
      "DA element appears across dëm/dam/dom with the sense of harm or loss.",
      "A at the front marks an initiating, outward cut.",
      "Ë marks the consequence settling back into the material unit.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

function buildDamageLaAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "U"]; // DA(M) + NU(M) simplified

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
      "DAM = act of harm/cut (same DA root plus consonant dressing); " +
      "NUM = counted unit or amount. Together they express 'a quantified harm' – damage as measurable loss.",
    vowelPath,
    notes: [
      "Shares DA-root with Albanian dëm/dam: the cutting, harming action is stable.",
      "Latin -num adds the sense of counted amount, making damage a measurable loss.",
    ],
    dominantVowel,
    traitsSummary,
  };
}
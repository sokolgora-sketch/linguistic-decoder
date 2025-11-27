// src/engine/wordAnalyzer.ts
// Takes CandidateForm[] and applies functional + 7-vowel logic.

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
  decomposition: string[];       // ["DA", "M"] etc.
  functionalStatement: string;   // short human explanation
  vowelPath: VowelId[];          // e.g. ["A", "Ë"]
  notes: string[];               // extra logic
  dominantVowel?: VowelId;
  traitsSummary?: string;
}

export interface WordAnalysisResult {
  word: WordInput;
  candidates: CandidateAnalysis[];
}

export function analyzeWord(cleaned: WordInput): WordAnalysisResult {
  const candidateForms = generateCandidates(cleaned);
  const analyses: CandidateAnalysis[] = [];

  for (const c of candidateForms) {
    const a = analyzeCandidate(cleaned, c);
    if (a) analyses.push(a);
  }

  return {
    word: cleaned,
    candidates: analyses,
  };
}

// ---- internal per-word logic ----

function analyzeCandidate(
  cleaned: WordInput,
  c: CandidateForm
): CandidateAnalysis | null {
  const key = cleaned.normalized;

  switch (key) {
    case "damage":
      return analyzeDamageCandidate(c);
    default:
      // no structured logic yet
      return null;
  }
}

function buildDamageSqAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "Ë"]; // DA core + Ë closure
  const dominantVowel: VowelId = "A";

  const aTraits = VOWEL_TRAITS["A"];
  const eTraits = VOWEL_TRAITS["Ë"];

  const traitsSummary =
    `A (${aTraits.polarity}, ${aTraits.role}) starts a cutting action. ` +
    `Ë (${eTraits.polarity}, ${eTraits.role}) closes it as a settled loss in the body/unit.`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DA", "M"],
    functionalStatement:
      "DA = divide, cut, separate; M = the affected unit/body. " +
      "Together they express the act of cutting or harming a unit – the function of 'damage'.",
    vowelPath,
    notes: [
      "Albanian dëm/dam/dom keep the DA cutting root and mark harm/loss.",
      "A at the start shows an initiating outward cut.",
      "Ë marks the loss settling into the condition of the thing.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

function buildDamageLaAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "U"]; // simplified reading for damnum
  const dominantVowel: VowelId = "A";

  const aTraits = VOWEL_TRAITS["A"];
  const uTraits = VOWEL_TRAITS["U"];

  const traitsSummary =
    `A (${aTraits.polarity}, ${aTraits.role}) initiates the cut. ` +
    `U (${uTraits.polarity}, ${uTraits.role}) pulls the effect down as stored loss.`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DAM", "NUM"],
    functionalStatement:
      "DAM = act of harm/cut (DA root dressed with M); " +
      "NUM = counted amount/unit. " +
      "Together they express 'a quantified harm' – damage as measurable loss.",
    vowelPath,
    notes: [
      "Shares DA root with Albanian dëm/dam: same cutting/harming action.",
      "Latin -num adds the idea of counted amount, turning harm into measurable damage.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

function buildDamageEnAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "Ë"]; // English surface still carries DA-Ë logic underneath
  const dominantVowel: VowelId = "A";

  const aTraits = VOWEL_TRAITS["A"];
  const eTraits = VOWEL_TRAITS["Ë"];

  const traitsSummary =
    `English "damage" keeps the same DA-Ë pattern logically: ` +
    `A starts the harming act, Ë closes it as a condition of loss.`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DA", "M", "AGE"],
    functionalStatement:
      "Surface form damage = DA (cut) + M (unit) + AGE (state/condition) – " +
      "a unit that has entered a condition of harm.",
    vowelPath,
    notes: [
      "Even in English, core sense is a unit that has been cut/ harmed and stays in that state.",
      "AGE behaves as a state/condition marker, echoing Latin -atio / -age families.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

function buildDamageFrAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "O", "Ë"]; // DA → DO (rounded) → closure

  const dominantVowel: VowelId = "O";
  const oTraits = VOWEL_TRAITS["O"];

  const traitsSummary =
    `O as mediator rounds the sharp A-cut into a state, matching French 'dommage' as condition or situation. ` +
    `O (${oTraits.polarity}, ${oTraits.role}): ${oTraits.personality}`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DOMM", "-AGE"],
    functionalStatement:
      "DOMM continues the DA/DM harm-root with a rounded O; -age again packages it into a condition. " +
      "Functionally: 'a harmed condition / situation', aligned with legal and everyday French usage.",
    vowelPath,
    notes: [
      "Romance layer that still carries the original DA harm root.",
      "Rounded O softens the cut – from pure act to condition/state.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

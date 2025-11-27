
// src/engine/wordAnalyzer.ts
// Takes CandidateForm[] and applies functional + 7-vowel logic.

import type { WordInput } from "./wordCleaner";
import {
  generateCandidates,
  type CandidateForm,
  type LanguageCode,
} from "./wordCandidates";
import type { VowelId } from "@/core/sevenVowelsCore";
import { VOWEL_TRAITS } from "@/core/sevenVowelsTraits";

export interface CandidateAnalysis {
  language: LanguageCode;
  form: string;

  // Structural reading
  decomposition: string[];      // ["DA", "M"] etc.
  functionalStatement: string;  // one short paragraph
  vowelPath: VowelId[];         // e.g. ["A", "Ë"]
  notes: string[];              // bullet points

  // Enrichment for UI
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

// -------- "damage" family analyses --------

function analyzeDamageCandidate(c: CandidateForm): CandidateAnalysis | null {
  const form = c.form.toLowerCase();

  if (c.language === "sq" && ["dëm", "dem", "dam", "dom"].includes(form)) {
    return buildDamageSqAnalysis(c);
  }

  if (c.language === "la" && form === "damnum") {
    return buildDamageLaAnalysis(c);
  }

  if (c.language === "en" && form === "damage") {
    return buildDamageEnAnalysis(c);
  }

  if (c.language === "fr" && form === "dommage") {
    return buildDamageFrAnalysis(c);
  }

  return null;
}

function buildDamageSqAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "Ë"]; // DA core (A) closing in Ë

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
      "DA = divide / cut / separate; M = the affected unit or body. " +
      "Together they encode a cut that leaves a mark or loss in the unit – the function of damage.",

    vowelPath,
    notes: [
      "Albanian dëm/dam/dom keeps the DA root for cutting or harming.",
      "The shift A→Ë in dëm signals the consequence settling back into matter.",
      "Same DA core appears in other languages where the meaning is harm or loss.",
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
    `A (${aTraits.polarity}, ${aTraits.role}) initiates the cut; ` +
    `U (${uTraits.polarity}, ${uTraits.role}) pulls the result down into stored loss.`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DAM", "NUM"],
    functionalStatement:
      "DAM = act of cutting / harming (DA root dressed with consonants); " +
      "NUM = counted amount or unit. " +
      "Together: a quantified harm or loss – damage as measurable loss.",

    vowelPath,
    notes: [
      "Shares the DA cut-root with Albanian dëm/dam.",
      "Latin -num adds the sense of counted amount: loss you can measure.",
    ],
    dominantVowel,
    traitsSummary,
  };
}

function buildDamageEnAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "Ë"]; // surface word carries the same DA→Ë story

  const dominantVowel: VowelId = "A";
  const aTraits = VOWEL_TRAITS["A"];
  const eTraits = VOWEL_TRAITS["Ë"];

  const traitsSummary =
    `English keeps the DA cut-root in 'dam-', initiated by A. ` +
    `The hidden closure behaves like Ë – consequence embedded in the object. ` +
    `A: ${aTraits.personality} / Ë: ${eTraits.personality}`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DAM", "-AGE"],

    functionalStatement:
      "DAM = the cut / harm root; -AGE is a noun-forming layer that turns the action into a state or result. " +
      "Functionally: 'the state/result of being harmed or cut'.",

    vowelPath,
    notes: [
      "English keeps the same DA root but dresses it in a French/Latin casing.",
      "-age packages the action into a condition or result (state of being harmed).",
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

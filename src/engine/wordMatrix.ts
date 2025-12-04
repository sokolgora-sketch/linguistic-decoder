import { WordMatrix } from "./types";

export const wordMatrixExamples: WordMatrix[] = [
  {
    word: "study",
    languageFamily: "Latin",
    morphology: {
      root: "stud",
      suffixes: ["ium", "ens"],
      gloss: "deliberate effort / inner state of focus"
    },
    meaning: "A deliberate effort of knowing that leads to an inner state of focus.",
    wordSums: ["stud + ium → studium", "stud + ens → students"],
    consonantPattern: "st (plosive + sibilant) supports focused effort",
    principles: ["Expansion", "Insight", "Balance"],
    symbolicNotes:
      "U–I path suggests unified insight; consonants 'st' and 'd' create a focused inner process."
  },
  {
    word: "damage",
    languageFamily: "Latin",
    morphology: {
      root: "dam",
      suffixes: ["num", "atio"],
      gloss: "cut / act that leaves something in a harmed state"
    },
    meaning: "An act that breaks or reduces something, leaving it harmed.",
    wordSums: ["dam + num → damnum", "dam + atio → damatio"],
    consonantPattern: "Plosive + nasal (d + m) = 'cut that leaves a harmed state'",
    principles: ["Action", "Evolution"],
    symbolicNotes: "A–Ë path suggests a cut in matter that becomes new condition."
  }
];

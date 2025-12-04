// src/shared/wordMatrix.v1.ts

import type { AnalyzeWordResultV1 } from "./resultShape.v1";

// This is the compact, “engine-facing” matrix.
export interface WordMatrixEntryV1 {
  layer: "heart" | "canon" | "deeproot";
  label: string;          // e.g. "Primary path", "Latin", "Albanian", "Proto-root"
  language?: string;      // only for canon / deepRoot if relevant
  form?: string;          // e.g. studium, studim, etc.
  voicePath?: string;     // "U → I", "A → E", etc.
  notes?: string;         // free text for now
}

export interface WordMatrixV1 {
  word: string;
  primary: WordMatrixEntryV1;
  canon: WordMatrixEntryV1[];
  deepRoot?: WordMatrixEntryV1;
}

// Build a matrix from the *final* analysis result
export function buildWordMatrix(result: AnalyzeWordResultV1): WordMatrixV1 {
  const primary = result.heart;

  return {
    word: result.word,
    primary: {
      layer: "heart",
      label: "Primary path",
      voicePath: primary?.principlePath.join(" → "),
      notes: result.symbolicCore?.notes.join("\n"),
    },
    canon: (result.candidates ?? []).map((fam) => ({
      layer: "canon",
      label: fam.language,
      language: fam.language,
      form: fam.form,
      voicePath: (fam.voices?.voiceSequence ?? []).join(" → "),
    })),
    deepRoot: result.deepRoot
      ? {
          layer: "deeproot",
          label: "Proto-root",
          language: result.deepRoot.language,
          form: result.deepRoot.form,
          voicePath: result.deepRoot.vowelPath,
          notes: result.deepRoot.notes,
        }
      : undefined,
  };
}

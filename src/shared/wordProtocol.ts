
// src/shared/wordProtocol.ts
import type { AnalysisResult_DEPRECATED } from "./engineShape";

export interface WordProtocolCore {
  expression: string;          // e.g. "U → I"
  decimal: number;             // 8
  base7: number[];             // [1, 1]
  voices: string[];            // ["A", "A"]
  principle: string;           // "A"
  state: string;               // "open" | "balanced" | "overloaded" | ...
  totalMod7: number;           // 6
  principlesPath: string[];    // ["Unity", "Insight"]
}

export interface WordProtocolProtoRoot {
  root: string;                // proto root syllable
  meaning: string;             // short gloss
  axis: string;                // functional axis
  examples: string[];          // example words
}

export interface WordProtocolMatrix {
  languageFamily: string;      // e.g. "latin"
  meaning: string;             // compact meaning sentence
  morphology: {
    root: string;
    suffixes: string[];
    gloss: string;
  };
  principlesPath: string[];
  wordSums: string[];
  symbolic?: string;
}

export interface WordProtocolCandidate {
  language: string;
  form: string;
  family?: string;
  function?: string;
}

export interface WordProtocolRecord {
  word: string;
  mode?: string;
  alphabet?: string;
  engineId?: string;

  core: WordProtocolCore;
  protoRoot?: WordProtocolProtoRoot;
  matrix?: WordProtocolMatrix;
  candidates?: WordProtocolCandidate[];

  raw?: {
    engineVersion?: string;    // for debugging only
  };
}

/**
 * Map the big internal AnalysisResult into a compact, stable
 * "Word Protocol" record that we can export and later feed into
 * Firebase / Genkit.
 */
export function toWordProtocol(
  analysis: AnalysisResult_DEPRECATED
): WordProtocolRecord {
  const a: any = analysis; // relax type for now, keep TS quiet

  const heart = a.math7?.heart ?? a.math7?.primary;

  const core: WordProtocolCore = {
    expression: heart?.expression ?? a.core?.primaryPath?.voicePath ?? "",
    decimal: heart?.decimal ?? 0,
    base7: heart?.base7 ?? [],
    voices: heart?.voices ?? a.core?.primaryPath?.voicePath ?? [],
    principle: heart?.principle ?? "",
    state: a.math7?.primary?.cycleState ?? "",
    totalMod7: a.math7?.primary?.totalMod7 ?? 0,
    principlesPath: a.math7?.primary?.principlesPath ?? [],
  };

  const protoRoot: WordProtocolProtoRoot | undefined = a.deepRoot
    ? {
        root: a.deepRoot.protoRoot,
        meaning: a.deepRoot.meaning,
        axis: a.deepRoot.functionAxis,
        examples: a.deepRoot.examples ?? [],
      }
    : undefined;

  const matrix: WordProtocolMatrix | undefined = a.wordMatrix
    ? {
        languageFamily: a.wordMatrix.languageFamily,
        meaning: a.wordMatrix.meaning,
        morphology: {
          root: a.wordMatrix.morphology.root,
          suffixes: a.wordMatrix.morphology.suffixes ?? [],
          gloss: a.wordMatrix.morphology.gloss,
        },
        principlesPath: a.wordMatrix.principles ?? [],
        wordSums: a.wordMatrix.wordSums ?? [],
        symbolic: a.wordMatrix.symbolicNotes,
      }
    : undefined;

  const candidates: WordProtocolCandidate[] | undefined = a.candidates
    ? a.candidates.map((c: any) => ({
        language: c.language,
        form: c.form,
        family: c.family,
        function: c.functionalSummary,
      }))
    : undefined;

  const word =
    a.meta?.word ??
    a.core?.word ??
    a.input?.word ??
    a.debug?.rawEnginePayload?.word ??
    "unknown";

  return {
    word,
    mode: a.meta?.mode,
    alphabet: a.meta?.alphabet,
    engineId: a.debug?.engineVersion ?? a.debug?.engineId,

    core,
    protoRoot,
    matrix,
    candidates,

    raw: {
      engineVersion: a.debug?.engineVersion,
    },
  };
}

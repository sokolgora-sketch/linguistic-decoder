export type SevenVoice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export type HeartFunctionHint = {
  voice: SevenVoice;
  hints: string[];
  functionHintSource: "ZE-RO doctrine";
};

export type HeartSegmentationType =
  | "visible_syllable_like"
  | "vowel_anchor_split"
  | "soft_variant_split"
  | "root_like_split"
  | "micro_chunk_split"
  | "whole_form_with_terminal_vowel";

export type HeartLegalTransform =
  | "S_TO_SH"
  | "SH_TO_S"
  | "FINAL_Y_TO_I"
  | "SEVEN_VOICE_VOWEL_NORMALIZATION";

export type HeartChunk = string;

export type HeartChunkVariant = {
  chunk: HeartChunk;
  variantOf: HeartChunk;
  legalTransform: HeartLegalTransform;
  notes: string[];
};

export type HeartChunkSegmentation = {
  segmentationId: string;
  word: string;
  normalizedWord: string;
  chunks: HeartChunk[];
  chunkVariants: HeartChunkVariant[];
  voicePath: SevenVoice[];
  normalizationNotes: string[];
  segmentationType: HeartSegmentationType;
  legalTransforms: HeartLegalTransform[];
  functionHints: HeartFunctionHint[];
  status: "candidate_structure" | "unsupported_word";
  riskNotes: string[];
};

const HEART_FUNCTION_HINT_SOURCE = "ZE-RO doctrine" as const;

const FUNCTION_HINTS: Record<SevenVoice, string[]> = {
  A: ["opening", "field", "breath"],
  E: ["edge", "relation", "extension"],
  I: ["insight", "intellect", "knowing", "line/point"],
  O: ["rounding", "whole", "containment"],
  U: ["container", "inside", "adding", "holding", "depth"],
  Y: ["fork", "branch", "choice", "transition"],
  Ë: ["threshold", "between", "central voice"],
};

function hintsFor(voices: SevenVoice[]): HeartFunctionHint[] {
  return [...new Set(voices)].map((voice) => ({
    voice,
    hints: FUNCTION_HINTS[voice],
    functionHintSource: HEART_FUNCTION_HINT_SOURCE,
  }));
}

function unsupportedSegmentation(word: string): HeartChunkSegmentation[] {
  const normalizedWord = word.trim().toLowerCase();
  const safeIdPrefix = normalizedWord || "empty";

  return [
    {
      segmentationId: `${safeIdPrefix}.segmentation.001`,
      word,
      normalizedWord,
      chunks: normalizedWord ? [normalizedWord.toUpperCase()] : [],
      chunkVariants: [],
      voicePath: [],
      normalizationNotes: [
        "No v0.1 Heart segmentation policy exists for this word.",
      ],
      segmentationType: "root_like_split",
      legalTransforms: [],
      functionHints: [],
      status: "unsupported_word",
      riskNotes: [
        "Unsupported word returns safe whole-form placeholder; do not treat as validated segmentation.",
      ],
    },
  ];
}

export function buildHeartChunkSegmentations(
  word: string,
): HeartChunkSegmentation[] {
  const normalizedWord = word.trim().toLowerCase();

  if (normalizedWord !== "study") {
    return unsupportedSegmentation(word);
  }

  return [
    {
      segmentationId: "study.segmentation.001",
      word,
      normalizedWord,
      chunks: ["STU", "DY"],
      chunkVariants: [],
      voicePath: ["U", "Y"],
      normalizationNotes: [
        "Keeps visible final Y; final Y comparison risk remains explicit.",
      ],
      segmentationType: "visible_syllable_like",
      legalTransforms: [],
      functionHints: hintsFor(["U", "Y"]),
      status: "candidate_structure",
      riskNotes: [
        "DY may need final Y→I comparison before Brain candidate search.",
      ],
    },
    {
      segmentationId: "study.segmentation.002",
      word,
      normalizedWord,
      chunks: ["STU", "DI"],
      chunkVariants: [
        {
          chunk: "DI",
          variantOf: "DY",
          legalTransform: "FINAL_Y_TO_I",
          notes: ["DI is a final Y→I comparison variant of DY."],
        },
      ],
      voicePath: ["U", "I"],
      normalizationNotes: [
        "Normalizes final Y to I only as an explicit comparison transform.",
      ],
      segmentationType: "vowel_anchor_split",
      legalTransforms: ["FINAL_Y_TO_I"],
      functionHints: hintsFor(["U", "I"]),
      status: "candidate_structure",
      riskNotes: [
        "Final Y→I is explicit and must not be treated as automatic proof.",
      ],
    },
    {
      segmentationId: "study.segmentation.003",
      word,
      normalizedWord,
      chunks: ["SHTU", "DI"],
      chunkVariants: [
        {
          chunk: "SHTU",
          variantOf: "STU",
          legalTransform: "S_TO_SH",
          notes: ["SHTU is an S_TO_SH soft comparison variant of STU."],
        },
        {
          chunk: "DI",
          variantOf: "DY",
          legalTransform: "FINAL_Y_TO_I",
          notes: ["DI is a final Y→I comparison variant of DY."],
        },
      ],
      voicePath: ["U", "I"],
      normalizationNotes: [
        "Combines explicit s↔sh comparison with final Y→I comparison.",
      ],
      segmentationType: "soft_variant_split",
      legalTransforms: ["S_TO_SH", "FINAL_Y_TO_I"],
      functionHints: hintsFor(["U", "I"]),
      status: "candidate_structure",
      riskNotes: [
        "s↔sh must be justified by later Brain evidence, not assumed from spelling.",
      ],
    },
    {
      segmentationId: "study.segmentation.004",
      word,
      normalizedWord,
      chunks: ["S", "TU", "DI"],
      chunkVariants: [
        {
          chunk: "DI",
          variantOf: "DY",
          legalTransform: "FINAL_Y_TO_I",
          notes: ["DI is a final Y→I comparison variant of DY."],
        },
      ],
      voicePath: ["U", "I"],
      normalizationNotes: [
        "Splits consonant-only prefix material from vowel-bearing chunks.",
      ],
      segmentationType: "micro_chunk_split",
      legalTransforms: ["FINAL_Y_TO_I"],
      functionHints: hintsFor(["U", "I"]),
      status: "candidate_structure",
      riskNotes: [
        "S is consonant-only prefix/material and short chunks increase false-positive risk.",
      ],
    },
    {
      segmentationId: "study.segmentation.005",
      word,
      normalizedWord,
      chunks: ["STUD", "I"],
      chunkVariants: [
        {
          chunk: "I",
          variantOf: "Y",
          legalTransform: "FINAL_Y_TO_I",
          notes: ["Terminal I is a final Y→I comparison variant."],
        },
      ],
      voicePath: ["U", "I"],
      normalizationNotes: [
        "Preserves larger root-like material before terminal I comparison.",
      ],
      segmentationType: "root_like_split",
      legalTransforms: ["FINAL_Y_TO_I"],
      functionHints: hintsFor(["U", "I"]),
      status: "candidate_structure",
      riskNotes: [
        "Root-like STUD preserves larger material and terminal I still needs final Y→I justification.",
      ],
    },
  ];
}

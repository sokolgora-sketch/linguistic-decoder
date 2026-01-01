import type { WordMatrixV1 } from "@/shared/wordMatrix.v1";

/**
 * Dev-only examples used by cards/tests in some branches.
 * Keep these aligned with WordMatrixV1 (the UI summary shape).
 */
export const wordMatrixExamples: WordMatrixV1[] = [
  {
    word: "study",
    primary: {
      layer: "heart",
      label: "Primary path",
      voicePath: "Unity → > Insight",
      notes: "Example only (dev fixture).",
    },
    canon: [
      {
        layer: "canon",
        label: "Latin",
        language: "Latin",
        form: "studium",
        voicePath: "U → I",
      },
      {
        layer: "canon",
        label: "Albanian",
        language: "Albanian",
        form: "studim",
        voicePath: "U → I",
      },
    ],
    deepRoot: {
      layer: "deeproot",
      label: "Proto-root",
      language: "",
      form: "",
      voicePath: "",
      notes: "",
    },
  },
  {
    word: "damage",
    primary: {
      layer: "heart",
      label: "Primary path",
      voicePath: "Truth → > Truth",
      notes: "Example only (dev fixture).",
    },
    canon: [
      {
        layer: "canon",
        label: "Latin",
        language: "Latin",
        form: "damnum",
        voicePath: "A → A",
      },
      {
        layer: "canon",
        label: "Albanian",
        language: "Albanian",
        form: "dë",
        voicePath: "Ë",
      },
    ],
    deepRoot: {
      layer: "deeproot",
      label: "Proto-root",
      language: "",
      form: "",
      voicePath: "",
      notes: "",
    },
  },
];

export type CanonCandidate = {
  id: string;
  language: string;
  form: string;
  gloss?: string;
  status?: "pass" | "experimental" | "fail";
  confidenceTag?: "speculative" | "provisional" | "strong";
  fitTag?: "strong" | "weak";
  consonantProfile?: "build" | "cut";
  consonantProfileOk?: boolean;
  consonantSignals?: any[];
  axes?: {
    principles?: "pass" | "fail";
    morphology?: "pass" | "fail";
    consonants?: "pass" | "fail";
  };
  voices?: {
    voiceSequence?: string[];
    ringPath?: number[];
  };
  morphology?: {
    root?: string;
    suffixes?: string[];
  };
  morphologyMatrix?: any;
  function?: string;
  note?: string;
  decomposition?: {
    functionalStatement?: string;
    parts?: string[];
  };
  symbolic?: any;
};

export const CANON_CANDIDATES: Record<string, CanonCandidate[]> = {
  study: [
    {
      id: "latin-studium",
      language: "Latin",
      form: "studium",
      gloss: "study, zeal, pursuit",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      consonantProfile: "build",
      consonantProfileOk: true,
      consonantSignals: ["sibilant-fricative", "plosive"],
      axes: {
        principles: "pass",
        morphology: "pass",
        consonants: "pass",
      },
      morphology: { root: "stud-", suffixes: ["-ium"] },
      function: "Deliberate effort of knowing that leads to a formed inner state.",
      note: "Base concept influencing English 'study'.",
      morphologyMatrix: {
        pivot: "stud",
      },
      symbolic: [
        {
          tag: "effort",
          note: "Represents a conscious application of will.",
          axis: "energy",
        },
      ],
      voices: {
        voiceSequence: ["U", "I"],
        ringPath: [1, 1],
      },
    },
    {
      id: "albanian-studim",
      language: "Albanian",
      form: "studim",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      consonantProfile: "build",
      consonantProfileOk: true,
      consonantSignals: ["sibilant-fricative", "plosive"],
      axes: {
        principles: "pass",
        morphology: "pass",
        consonants: "pass",
      },
      morphology: { root: "stud-", suffixes: ["-im"] },
      morphologyMatrix: {
        pivot: "s'tu",
      },
      voices: {
        voiceSequence: ["U", "I"],
        ringPath: [1, 1],
      },
    },
  ],
  damage: [
    {
      id: "latin-damnum",
      language: "Latin",
      form: "damnum",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      consonantProfile: "cut",
      consonantProfileOk: true,
      consonantSignals: ["plosive", "nasal"],
      axes: {
        principles: "pass",
        morphology: "pass",
        consonants: "pass",
      },
      morphology: { root: "dam-", suffixes: ["-num"] },
      morphologyMatrix: {
        pivot: "dam",
      },
      symbolic: [
        {
          tag: "loss",
          note: "A foundational sense of loss or harm.",
          axis: "substance",
        },
      ],
    },
    {
      id: "albanian-dëm",
      language: "Albanian",
      form: "dëm",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      consonantProfile: "cut",
      consonantProfileOk: true,
      consonantSignals: ["plosive"],
      axes: {
        principles: "pass",
        morphology: "pass",
        consonants: "pass",
      },
      morphology: { root: "dëm", suffixes: [] },
      morphologyMatrix: {
        pivot: "dëm",
      },
    },
  ],
  love: [
    {
      id: "latin-amor",
      language: "Latin",
      form: "amor",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      consonantProfileOk: true,
      axes: {
        principles: "pass",
        morphology: "pass",
        consonants: "pass",
      },
      morphology: { root: "am-", suffixes: ["-or"] },
      morphologyMatrix: {
        pivot: "am-",
        source: "auto"
      },
      decomposition: {
        parts: ["am-", "or"],
      },
      symbolic: [
        {
          tag: "attraction",
          note: "A force that draws things together.",
          axis: "energy",
        },
      ],
    },
    {
      id: "albanian-dashuri",
      language: "Albanian",
      form: "dashuri",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      consonantProfileOk: true,
      axes: {
        principles: "pass",
        morphology: "pass",
        consonants: "pass",
      },
      morphology: { root: "dash-", suffixes: ["-uri"] },
      morphologyMatrix: {
        pivot: "dash",
      },
      decomposition: {
        parts: ["dash", "-uri"],
      },
      symbolic: [
        {
          tag: "attraction",
          note: "A force that draws things together.",
          axis: "energy",
        },
      ],
    },
  ],
  mode: [
    {
      id: "latin-modus",
      language: "Latin",
      form: "modus",
      status: "pass",
      confidenceTag: "strong",
      morphologyMatrix: {
        pivot: "mode",
      },
    },
  ],
};

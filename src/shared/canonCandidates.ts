import { CANDIDATE_RECORD_VERSION } from "./brain/candidateRecord.v0.1";

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
  candidateRecord?: unknown;
};

/* BRAIN-0: canon emits CandidateRecord */
function mkCanonCandidateRecord(c: CanonCandidate) {
  // Canon root tags MUST obey CandidateRecord token law: ^[A-Z0-9_-]{1,24}$.
  // We strip diacritics (NFD) + drop non-token chars to keep determinism.
  function canonRootToken(x: unknown): string {
    const raw = String(x ?? "CANON").replace(/\s+/g, "");
    const ascii = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const up = ascii.toUpperCase();
    const cleaned = up.replace(/[^A-Z0-9_-]/g, "");
    return cleaned || "CANON";
  }
  // CandidateRecord.v0.1 requires:
  // source.kind ∈ {"SEED","DATASET"} and all required strings non-empty.
  return {
    v: CANDIDATE_RECORD_VERSION,
    languageId: `wlt:canon.${String(c.language || "unknown").toLowerCase()}`,
    languageName: c.language || "Unknown",
    form: c.form || "∅",
    gloss: c.gloss || c.function || c.note || c.form || "canon candidate",
    roots: [canonRootToken(c.morphology?.root || "CANON")],
    opsUsed: [],
    explains: [],
    functionTag: "UNKNOWN",
    source: {
      kind: "SEED",
      ref: "canonCandidates.ts",
      version: "canon.v0.1",
    },
  };
}

const withCR = (c: CanonCandidate) => ({
  ...c,
  candidateRecord: (c as any).candidateRecord ?? mkCanonCandidateRecord(c),
});

export const CANON_CANDIDATES: Record<string, CanonCandidate[]> = {
  "father": [
    {
      id: "latin-pater",
      language: "Latin",
      form: "pater",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      morphology: { root: "pat-", suffixes: ["-er"] },
      morphologyMatrix: { pivot: "pat" },
      consonantProfile: "cut",
      consonantProfileOk: true,
      consonantSignals: ["plosive"],
      axes: { principles: "pass", morphology: "pass", consonants: "pass" },
      symbolic: [{ tag: "lineage", note: "Authority/lineage carrier (reference).", axis: "function" }],
    },
    {
      id: "albanian-atë",
      language: "Albanian",
      form: "atë",
      status: "pass",
      confidenceTag: "strong",
      fitTag: "strong",
      morphology: { root: "atë", suffixes: [] },
      morphologyMatrix: { pivot: "atë" },
      consonantProfile: "build",
      consonantProfileOk: true,
      consonantSignals: ["dental"],
      axes: { principles: "pass", morphology: "pass", consonants: "pass" },
    },
  ],
  study: [
    {
      id: "latin-studium",
      language: "Latin",
      form: "studium",
      gloss: "study, zeal, pursuit",
      status: "experimental",
      confidenceTag: "speculative",
      fitTag: "weak",
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
      status: "experimental",
      confidenceTag: "speculative",
      fitTag: "weak",
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
      status: "experimental",
      confidenceTag: "speculative",
      fitTag: "weak",
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
      status: "experimental",
      confidenceTag: "speculative",
      fitTag: "weak",
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


/* BRAIN-0: decorate all canon entries */
for (const k of Object.keys(CANON_CANDIDATES)) {
  const list = CANON_CANDIDATES[k] || [];
  CANON_CANDIDATES[k] = list.map(withCR);
}

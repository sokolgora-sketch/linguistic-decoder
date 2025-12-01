// src/shared/canonCandidates.ts

export type CanonCandidate = {
  id: string;                    // unique ID
  language: string;              // e.g. "Latin", "Greek", "Albanian"
  form: string;                  // word form, e.g. "studium"
  gloss?: string;                // short meaning like "study / zeal / focus"
  morphology?: {                 // breakdown if available
    root?: string;
    suffixes?: string[];
  };
  function?: string;             // e.g. "deliberate effort of knowing"
  note?: string;                 // free commentary
};

export const CANON_CANDIDATES: Record<string, CanonCandidate[]> = {
  study: [
    {
      id: "latin-studium",
      language: "Latin",
      form: "studium",
      gloss: "study, zeal, pursuit",
      morphology: { root: "stud-", suffixes: ["-ium"] },
      function: "Deliberate effort of knowing that leads to a formed inner state.",
      note: "Base concept influencing English 'study'.",
    },
  ],
  damage: [
    {
      id: "latin-damnum",
      language: "Latin",
      form: "damnum",
    },
  ],
};

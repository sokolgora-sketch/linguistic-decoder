
export type Alphabet = "auto" | "albanian" | "latin";

export const ENGINE_VERSION = "2025-11-14-core-5";

export const CFG = {
  beamWidth: 8,
  maxOpsStrict: 1,
  maxOpsOpen: 2,
  cost: { sub: 1, del: 3, insClosure: 2 },
  preferClosureË: true,
  ringJumpPenalty: 1,
  cWeight: 1,
  alphabet: "auto" as Alphabet,     // default: auto-detect
  norm: { foldDiacritics: true, terminalYtoI: true, collapseDupes: true },
};

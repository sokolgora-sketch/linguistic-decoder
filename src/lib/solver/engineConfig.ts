
export const ENGINE_VERSION = "2025-11-14-core-3";

export type EngineConfig = {
  // Search
  beamWidth: number;
  maxOpsStrict: number;
  maxOpsOpen: number;
  frontierDeltaE: number;

  // Ops (costs)
  cost: { sub: number; del: number; insClosure: number };

  // Preferences
  preferClosureË: boolean;
  ringJumpPenalty: number;  // +1 per |Δring|>1 jump

  // Normalizations (cost 0, pre-solver)
  norm: {
    foldDiacritics: boolean;  // á→A etc., keep Ë
    terminalYtoI: boolean;    // study→…UI (not an op)
    collapseDupes: boolean;   // AA→A
  };
};

export const CFG: EngineConfig = {
  beamWidth: 8,
  maxOpsStrict: 1,
  maxOpsOpen: 2,
  frontierDeltaE: 2,
  cost: { sub: 1, del: 3, insClosure: 2 },
  preferClosureË: true,
  ringJumpPenalty: 1,
  norm: { foldDiacritics: true, terminalYtoI: true, collapseDupes: true },
};

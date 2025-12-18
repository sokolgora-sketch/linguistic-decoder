/**
 * Central solver defaults used by tests and (optionally) the engine.
 * Keep this file small and stable — tests import it directly.
 */
export const CFG = {
  // Beam search width (how many candidate states we keep per step)
  beamWidth: 8,

  // Max edit operations allowed by mode
  maxOpsStrict: 4,
  maxOpsOpen: 8,

  // Operation costs (lower = preferred)
  cost: {
    sub: 1,        // substitution
    del: 2,        // deletion
    insClosure: 2, // inserting a closure marker / boundary (Ë)
  },
} as const;

export type EngineConfig = typeof CFG;

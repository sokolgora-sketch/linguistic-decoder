// Core history types + helpers. No Firestore or UI here.
// This is just a stable interface the rest of the app can use.

export type HistoryEngineMeta = {
  engineVersion: string;  // e.g. "2025-11-16-core-2"
  mode: string;           // e.g. "strict" | "open"
  alphabet: string;       // e.g. "auto" | "latin"
  solveMs: number | null; // null if unknown
};

export type HistoryItemCore = {
  // Word or token the user analyzed
  word: string;

  // For quick filtering without opening the payload
  mode: string;
  alphabet: string;

  // Engine meta for that run
  engineMeta: HistoryEngineMeta;

  // When this run happened (ISO string – Firestore can map to this easily)
  createdAt: string;
};

/**
 * Formats a one-line engine meta summary, same style as the footer.
 * Example:
 *   "engine=2025-11-16-core-2  mode=strict  alphabet=auto  solveMs=2"
 */
export function formatHistoryEngineMeta(meta: HistoryEngineMeta): string {
  const solve =
    meta.solveMs === null || Number.isNaN(meta.solveMs)
      ? "?"
      : String(meta.solveMs);

  return [
    `engine=${meta.engineVersion}`,
    `mode=${meta.mode}`,
    `alphabet=${meta.alphabet}`,
    `solveMs=${solve}`,
  ].join("  ");
}

/**
 * Small helper to create a stable key for a history item.
 * This is just for client-side maps / React keys – NOT a Firestore ID.
 */
export function makeHistoryKey(item: HistoryItemCore): string {
  return `${item.word}::${item.mode}::${item.alphabet}::${item.createdAt}`;
}

// A minimal shape that matches what our analyze result exposes.
// We keep this generic so we don't depend on internal types.
export type AnalysisLikeForHistory = {
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string;
  solveMs?: number | null;
};

/**
 * Create a HistoryItemCore from an analysis-like object.
 * This is what the API / UI will call after each successful run.
 */
export function makeHistoryItemFromAnalysis(
  src: AnalysisLikeForHistory,
  now: () => Date = () => new Date()
): HistoryItemCore {
  const engineMeta: HistoryEngineMeta = {
    engineVersion: src.engineVersion,
    mode: src.mode,
    alphabet: src.alphabet,
    solveMs:
      src.solveMs === undefined || Number.isNaN(src.solveMs)
        ? null
        : src.solveMs,
  };

  return {
    word: src.word,
    mode: src.mode,
    alphabet: src.alphabet,
    engineMeta,
    createdAt: now().toISOString(),
  };
}

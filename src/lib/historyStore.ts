// src/lib/historyStore.ts
// Central hook for logging analysis runs.
// Right now it's a no-op stub; later we plug in Firestore.

export interface HistoryRunInput {
  word: string;
  engineVersion: string;
  mode: string;
  alphabet: string;
  result: unknown;
}

/**
 * Main hook. Engine calls this after every successful run.
 * It must NEVER throw – failures are swallowed internally.
 */
export async function recordHistoryRun(input: HistoryRunInput): Promise<void> {
  // Guard: history off by default; flip when we actually wire Firestore.
  if (process.env.NEXT_PUBLIC_HISTORY_ENABLED !== "1") {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        "[history] disabled; would record:",
        input.word,
        input.engineVersion,
        input.mode,
        input.alphabet,
      );
    }
    return;
  }

  // TODO: future step – write to Firestore here.
  // For now, just log in dev so we know the hook works.
  if (process.env.NODE_ENV === "development") {
    console.debug("[history] stub record:", {
      word: input.word,
      engineVersion: input.engineVersion,
      mode: input.mode,
      alphabet: input.alphabet,
    });
  }
}

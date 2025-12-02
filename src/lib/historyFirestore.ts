import type {
  HistoryItemCore,
  HistoryEngineMeta,
} from "./history";

/**
 * Plain data shape as it will live in Firestore.
 * Keep this flat and JSON-friendly.
 */
export type HistoryDocData = {
  word: string;
  mode: string;
  alphabet: string;

  engineVersion: string;
  solveMs?: number | null;

  // ISO string
  createdAt: string;

  // optional: room for future extensions (e.g. raw analysis snapshot)
  payloadVersion?: number;
};

/**
 * Map a HistoryItemCore into Firestore-ready data.
 */
export function historyItemToDoc(item: HistoryItemCore): HistoryDocData {
  const { word, mode, alphabet, engineMeta, createdAt } = item;

  return {
    word,
    mode,
    alphabet,
    engineVersion: engineMeta.engineVersion,
    solveMs: engineMeta.solveMs ?? null,
    createdAt,
    payloadVersion: 1,
  };
}

/**
 * Map Firestore data back into HistoryItemCore.
 * `id` is not used in the core model yet, but we accept it in case we
 * want to surface it in the UI later as a stable key.
 */
export function docToHistoryItem(
  data: HistoryDocData
): HistoryItemCore {
  const engineMeta: HistoryEngineMeta = {
    engineVersion: data.engineVersion,
    mode: data.mode,
    alphabet: data.alphabet,
    solveMs:
      data.solveMs === undefined || Number.isNaN(data.solveMs as number)
        ? null
        : (data.solveMs as number | null),
  };

  return {
    word: data.word,
    mode: data.mode,
    alphabet: data.alphabet,
    engineMeta,
    createdAt: data.createdAt,
  };
}

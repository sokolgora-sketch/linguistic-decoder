/**
 * History <-> Firestore mapping (stable adapter surface)
 *
 * This file is the contract used by tests:
 *   tests/history.firestore.spec.ts
 *
 * Firestore doc is FLAT (engine meta fields top-level):
 *   { word, mode, alphabet, engineVersion, solveMs, createdAt, payloadVersion }
 */

import type { HistoryItemCore, HistoryEngineMeta } from "./history";

export type HistoryDocData = {
  word: string;
  mode: HistoryEngineMeta["mode"];
  alphabet: HistoryEngineMeta["alphabet"];
  engineVersion: string;
  solveMs: number | null;
  createdAt: string;
  payloadVersion: 1;
};

const PAYLOAD_VERSION: 1 = 1;

function normalizeSolveMs(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? input : null;
}

/**
 * Convert app history item -> Firestore flat doc
 */
export function historyItemToDoc(item: HistoryItemCore): HistoryDocData {
  const meta = item.engineMeta;

  return {
    word: item.word,
    mode: item.mode,
    alphabet: item.alphabet,
    engineVersion: meta.engineVersion,
    solveMs: normalizeSolveMs(meta.solveMs),
    createdAt: item.createdAt,
    payloadVersion: PAYLOAD_VERSION,
  };
}

/**
 * Convert Firestore flat doc -> app history item
 */
export function docToHistoryItem(doc: HistoryDocData): HistoryItemCore {
  const engineMeta: HistoryEngineMeta = {
    engineVersion: doc.engineVersion,
    mode: doc.mode,
    alphabet: doc.alphabet,
    solveMs: normalizeSolveMs(doc.solveMs),
  };

  return {
    word: doc.word,
    mode: doc.mode,
    alphabet: doc.alphabet,
    engineMeta,
    createdAt: doc.createdAt,
  };
}

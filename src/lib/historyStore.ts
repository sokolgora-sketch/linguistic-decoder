// src/lib/historyStore.ts
// Central history API for the app. UI must NOT touch Firestore directly.

import type { EnginePayload } from "@/shared/engineShape";
import {
  saveHistoryRecord,
  loadHistoryPage as loadPageFirestore,
  deleteHistoryDoc,
  deleteAnalysisCacheDoc,
  type HistoryRow,
} from "./historyFirestore";

export interface HistoryRunInput {
  word: string;
  engineVersion: string;
  mode: string;
  alphabet: string;
  result: unknown;
  uid?: string | null;
}

export type HistoryQuery = {
  uid?: string | null;
  mode?: "strict" | "open" | null;
  alphabet?: string | null;
  limitCount?: number;
  cursor?: any | null; // Firestore QueryDocumentSnapshot; kept as any for UI boundary
  wordFilter?: string;
};

export async function recordHistoryRun(input: HistoryRunInput): Promise<void> {
  // Guard: history off by default; flip when we actually wire Firestore.
  if (process.env.NEXT_PUBLIC_HISTORY_ENABLED !== "1") {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        "[history] disabled; would record:",
        input.word,
        input.engineVersion,
        input.mode,
        input.alphabet
      );
    }
    return;
  }

  const payload = input.result as EnginePayload;

  const heartSummary = extractHeartSummary(payload);

  // cacheId: if your engine stores analyses separately, you can set this later.
  // leaving undefined is fine; UI will fall back to doc id.
  await saveHistoryRecord(
    {
      word: input.word,
      engineVersion: input.engineVersion,
      mode: input.mode || "strict",
      alphabet: input.alphabet || "auto",
      heartSummary: heartSummary || "",
      createdAt: Date.now(),
    },
    input.uid
  );
}

function extractHeartSummary(payload: EnginePayload): string | undefined {
  if (!payload?.primaryPath?.voicePath) return;
  return payload.primaryPath.voicePath.map((v) => v.symbol).join("");
}

/**
 * Canonical read used by HistoryPanel.
 * Applies a lightweight client-side wordFilter (no index required).
 */
export async function loadHistoryPage(q: HistoryQuery): Promise<{
  rows: HistoryRow[];
  cursor: any | null;
  hasMore: boolean;
}> {
  const res = await loadPageFirestore({
    uid: q.uid ?? null,
    mode: q.mode ?? null,
    alphabet: q.alphabet ?? null,
    limitCount: q.limitCount ?? 50,
    cursor: q.cursor ?? null,
  });

  let rows = res.rows;

  const wf = (q.wordFilter ?? "").trim().toLowerCase();
  if (wf) rows = rows.filter((r) => (r.word || "").toLowerCase().includes(wf));

  return { rows, cursor: res.cursor as any, hasMore: res.hasMore };
}

export async function deleteHistoryItem(params: {
  uid?: string | null;
  id: string;
  cacheId?: string | null;
  alsoDeleteCache?: boolean;
}): Promise<void> {
  await deleteHistoryDoc({ uid: params.uid ?? null, id: params.id });

  if (params.alsoDeleteCache && params.cacheId) {
    await deleteAnalysisCacheDoc(params.cacheId);
  }
}

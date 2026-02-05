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
  uid?: string | null; // currently ignored by historyFirestore.ts
  mode?: "strict" | "open" | null; // currently ignored by historyFirestore.ts
  alphabet?: string | null; // currently ignored by historyFirestore.ts
  limitCount?: number;
  cursor?: any | null; // Firestore QueryDocumentSnapshot; kept as any for UI boundary
  wordFilter?: string;
};

export async function recordHistoryRun(input: HistoryRunInput): Promise<void> {
  // Guard: history off by default; flip when we actually wire Firestore.
  if (process.env.NEXT_PUBLIC_HISTORY_ENABLED !== "1") {
    if (process.env.NODE_ENV === "development") {
}
    return;
  }

  const payload = input.result as EnginePayload;

  const cacheId =
    (payload as any)?.cacheId ??
    (payload as any)?.meta?.cacheId ??
    (payload as any)?.raw?.meta?.cacheId ??
    undefined;

  const heartSummary = extractHeartSummary(payload);

  await saveHistoryRecord(
    {
      cacheId: cacheId ?? "",
      payload,
      word: input.word,
      engineVersion: input.engineVersion,
      mode: input.mode || "strict",
      alphabet: input.alphabet || "auto",
      heartSummary: heartSummary || "",
      createdAt: Date.now(),
    },
    input.uid ?? undefined
  );
}

function extractHeartSummary(payload: EnginePayload): string | undefined {
  const hs = (payload as any)?.heart?.narrative;
  if (typeof hs === "string" && hs.trim()) return hs;

  const vp = (payload as any)?.primaryPath?.voicePath;
  if (Array.isArray(vp)) {
    return vp
      .map((v: any) => (typeof v === "string" ? v : v?.symbol ?? ""))
      .filter(Boolean)
      .join("");
  }

  return;
}

/**
 * Canonical read used by HistoryPanel.
 * historyFirestore.ts currently supports only {limit,cursor}.
 * Everything else is filtered client-side here.
 */
export async function loadHistoryPage(q: HistoryQuery): Promise<{
  rows: HistoryRow[];
  cursor: any | null;
  hasMore: boolean;
}> {
  const limitCount = q.limitCount ?? 50;

  const res = await loadPageFirestore({
    limit: limitCount,
    cursor: q.cursor ?? null,
  });

  let rows = res.items as HistoryRow[];

  const wf = (q.wordFilter ?? "").trim().toLowerCase();
  if (wf) rows = rows.filter((r) => (r.word || "").toLowerCase().includes(wf));

  const hasMore = rows.length >= limitCount;

  return { rows, cursor: res.cursor as any, hasMore };
}

export async function deleteHistoryItem(params: {
  uid?: string | null; // currently ignored by historyFirestore.ts
  id: string;
  cacheId?: string | null;
  alsoDeleteCache?: boolean;
}): Promise<void> {
  // historyFirestore.ts delete expects cacheId/id string (doc id)
  await deleteHistoryDoc(params.id);

  if (params.alsoDeleteCache && params.cacheId) {
    await deleteAnalysisCacheDoc(params.cacheId);
  }
}

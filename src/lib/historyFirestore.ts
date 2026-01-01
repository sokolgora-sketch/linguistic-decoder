import "server-only";

import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "firebase/firestore";

import type { EnginePayload } from "@/shared/engineShape";
import { db } from "./firebase";

const COL_HISTORY = "history";
const COL_ANALYSIS_CACHE = "analysisCache";

/**
 * Types expected by src/lib/history.firestore.ts re-export file.
 * Keep these stable even if the underlying storage changes.
 */
export type HistoryItem = {
  cacheId?: string;
  word?: string;
  mode?: string;
  engineVersion?: string | null;
  createdAt?: number; // millis
};

// Back-compat alias for older code (historyStore.ts)
export type HistoryRow = HistoryItem;


export type HistoryDocData = {
  cacheId: string;
  word?: string;
  mode?: string;
  engineVersion?: string | null;
  createdAt: number;
  heartSummary?: string;
  extra?: Record<string, unknown>;
};

/**
 * Adapter helpers expected by history.firestore.ts
 */
export function historyItemToDoc(item: HistoryItem): HistoryDocData {
  return {
    cacheId: item.cacheId ?? "",
    word: item.word,
    mode: item.mode,
    engineVersion: item.engineVersion ?? null,
    createdAt: item.createdAt ?? Date.now(),
  };
}

export function docToHistoryItem(id: string, data: Partial<HistoryDocData>): HistoryItem {
  return {
    cacheId: data.cacheId ?? id,
    word: data.word,
    mode: data.mode,
    engineVersion: data.engineVersion ?? null,
    createdAt: data.createdAt,
  };
}

/**
 * Exports expected by src/lib/historyStore.ts
 */
export async function saveHistoryRecord(
  args: {
    cacheId: string;
    payload: EnginePayload;
    createdAt?: number;
    word?: string;
    engineVersion?: string;
    mode?: string;
    alphabet?: string;
    heartSummary?: string;
    // Future-proofing: optional bag for new metadata without breaking build again.
    extra?: Record<string, unknown>;
  },
  _uid?: string,
): Promise<void> {
  void _uid;
  const { cacheId, payload } = args;
  const createdAt = args.createdAt ?? Date.now();

  const word =
    args.word ??
    (payload as any)?.word ??
    (payload as any)?.sanitized ??
    (payload as any)?.basis ??
    "";

  const mode = args.mode ?? (payload as any)?.mode ?? "strict";

  const alphabet = args.alphabet ?? (payload as any)?.alphabet ?? "auto";

  const heartSummary = args.heartSummary ?? (payload as any)?.heart?.narrative ?? (payload as any)?.heartSummary ?? "";

  const engineVersion =
    args.engineVersion ??
    (payload as any)?.engineVersion ??
    (payload as any)?.engine_meta?.engineVersion ??
    null;


  const ref = doc(db, COL_HISTORY, cacheId);

  const docData: HistoryDocData = {
    cacheId,
    word,
    mode,
    engineVersion,
    createdAt,
    // extra metadata (kept optional/loose on purpose)
    alphabet: (typeof alphabet === "string" ? alphabet : undefined),
    heartSummary: (typeof heartSummary === "string" ? heartSummary : undefined),
    uid: (typeof _uid === "string" ? _uid : undefined),
    extra: (args.extra && typeof args.extra === "object" ? args.extra : undefined),
  } as any;

  await setDoc(ref, docData, { merge: true });
}

export async function loadHistoryPage(args: {
  limit?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<{
  items: HistoryItem[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const pageSize = Math.max(1, Math.min(50, args.limit ?? 20));

  const base = query(
    collection(db, COL_HISTORY),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  );

  const q = args.cursor ? query(base, startAfter(args.cursor)) : base;

  const snap = await getDocs(q);

  const items: HistoryItem[] = snap.docs.map((d) => {
    const x = d.data() as Partial<HistoryDocData>;
    return docToHistoryItem(d.id, x);
  });

  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
  return { items, cursor: nextCursor };
}

export async function deleteHistoryDoc(cacheId: string): Promise<void> {
  await deleteDoc(doc(db, COL_HISTORY, cacheId));
}

export async function deleteAnalysisCacheDoc(cacheId: string): Promise<void> {
  await deleteDoc(doc(db, COL_ANALYSIS_CACHE, cacheId));
}

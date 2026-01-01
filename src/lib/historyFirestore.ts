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
import { getFirestoreClient } from "./firebase";

const COL_HISTORY = "history";
const COL_ANALYSIS_CACHE = "analysisCache";

export type HistoryItemCore = {
  cacheId: string;
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string | null;
  solveMs: number | null;
  createdAt: number;
};

export type HistoryItem = HistoryItemCore & {};

export type HistoryRow = HistoryItem;

export type HistoryDocData = {
  cacheId: string;
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string | null;
  solveMs: number | null;
  createdAt: number;
  heartSummary?: string;
  extra?: Record<string, unknown>;
  uid?: string;
};

export function historyItemToDocData(item: HistoryItemCore): HistoryDocData {
  return {
    cacheId: item.cacheId,
    word: item.word,
    mode: item.mode,
    alphabet: item.alphabet ?? "auto",
    engineVersion: item.engineVersion ?? null,
    solveMs: item.solveMs ?? null,
    createdAt: item.createdAt,
  };
}

export function docToHistoryItem(id: string, data?: Partial<HistoryDocData>): HistoryItem {
  const d = data ?? {};
  return {
    cacheId: d.cacheId ?? id,
    word: d.word ?? "",
    mode: d.mode ?? "strict",
    alphabet: d.alphabet ?? "auto",
    engineVersion: d.engineVersion ?? null,
    solveMs: d.solveMs ?? null,
    createdAt: d.createdAt ?? 0,
  };
}

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
    extra?: Record<string, unknown>;
  },
  _uid?: string,
): Promise<void> {
  const db = getFirestoreClient();
  const { cacheId, payload } = args;

  const item: HistoryItemCore = {
    cacheId,
    word: args.word ?? (payload as any)?.word ?? "",
    mode: args.mode ?? (payload as any)?.meta?.mode ?? "strict",
    alphabet: args.alphabet ?? (payload as any)?.meta?.alphabet ?? "auto",
    engineVersion: args.engineVersion ?? (payload as any)?.meta?.engineVersion ?? null,
    solveMs: (payload as any)?.meta?.solveMs ?? null,
    createdAt: args.createdAt ?? Date.now(),
  };

  const docData = historyItemToDocData(item);

  const fullDocData: HistoryDocData = {
    ...docData,
    heartSummary: args.heartSummary ?? (payload as any)?.heart?.narrative,
    uid: _uid,
    extra: args.extra,
  };
  
  const ref = doc(db, COL_HISTORY, cacheId);
  await setDoc(ref, fullDocData, { merge: true });
}

export async function loadHistoryPage(args: {
  limit?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<{
  items: HistoryItem[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const db = getFirestoreClient();
  const pageSize = Math.max(1, Math.min(50, args.limit ?? 20));

  const base = query(
    collection(db, COL_HISTORY),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  );

  const q = args.cursor ? query(base, startAfter(args.cursor)) : base;
  const snap = await getDocs(q);

  const items: HistoryItem[] = snap.docs.map((d) => {
    return docToHistoryItem(d.id, d.data() as Partial<HistoryDocData>);
  });

  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
  return { items, cursor: nextCursor };
}

export async function deleteHistoryDoc(cacheId: string): Promise<void> {
  const db = getFirestoreClient();
  await deleteDoc(doc(db, COL_HISTORY, cacheId));
}

export async function deleteAnalysisCacheDoc(cacheId: string): Promise<void> {
  const db = getFirestoreClient();
  await deleteDoc(doc(db, COL_ANALYSIS_CACHE, cacheId));
}

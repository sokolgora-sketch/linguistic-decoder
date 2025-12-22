import { getDb } from "./firestoreDb";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

const db = () => getDb();

export interface HistoryRecord {
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string;
  heartSummary?: string;
  createdAt: number;

  // optional fields used by the HistoryPanel UI (if present)
  cacheId?: string;
  source?: string;
  primaryVoice?: string;
}

export type HistoryRow = HistoryRecord & {
  id: string; // Firestore doc id
};

function historyCollection(uid?: string | null) {
  const d = db();
  if (!d) throw new Error("Firestore not available");
  return uid
    ? collection(d, "users", uid, "history")
    : collection(d, "history");
}

export async function saveHistoryRecord(record: HistoryRecord, uid?: string | null) {
  const col = historyCollection(uid);
  // lazy import to keep signature compatible with existing callers
  const { addDoc } = await import("firebase/firestore");
  await addDoc(col, record);
}

export async function loadHistoryPage(params: {
  uid?: string | null;
  mode?: string | null;
  alphabet?: string | null;
  limitCount?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<{
  rows: HistoryRow[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const {
    uid,
    mode = null,
    alphabet = null,
    limitCount = 50,
    cursor = null,
  } = params;

  const col = historyCollection(uid);

  const clauses: any[] = [];
  if (mode) clauses.push(where("mode", "==", mode));
  if (alphabet) clauses.push(where("alphabet", "==", alphabet));

  let q = query(col, ...clauses, orderBy("createdAt", "desc"), limit(limitCount));
  if (cursor) q = query(col, ...clauses, orderBy("createdAt", "desc"), startAfter(cursor), limit(limitCount));

  const snap = await getDocs(q);

  const rows: HistoryRow[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as HistoryRecord),
  }));

  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;

  return {
    rows,
    cursor: nextCursor,
    hasMore: snap.docs.length === limitCount,
  };
}

export async function deleteHistoryDoc(params: { uid?: string | null; id: string }) {
  const d = db();
  if (!d) throw new Error("Firestore not available");
  const ref = params.uid
    ? doc(d, "users", params.uid, "history", params.id)
    : doc(d, "history", params.id);
  await deleteDoc(ref);
}

export async function deleteAnalysisCacheDoc(cacheId: string) {
  const d = db();
  if (!d) throw new Error("Firestore not available");
  await deleteDoc(doc(d, "analyses", cacheId));
}

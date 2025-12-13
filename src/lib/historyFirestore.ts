import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

const historyCol = collection(db, "history");

export interface HistoryRecord {
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string;
  heartSummary?: string;
  createdAt: number;
}

export async function saveHistoryRecord(record: HistoryRecord) {
  try {
    await addDoc(historyCol, record);
  } catch (err) {
    console.error("🔥 Firestore write error:", err);
  }
}

export async function loadRecentHistory(limitCount = 20): Promise<HistoryRecord[]> {
  const q = query(historyCol, orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as HistoryRecord);
}

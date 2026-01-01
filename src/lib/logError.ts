import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirestoreClient } from "./firebase";

/**
 * Lightweight error logger.
 * Build-safe: depends only on ./firebase exports that we actually provide.
 */
export async function logError(ev: {
  where: string;
  message: string;
  detail?: unknown;
}): Promise<void> {
  try {
    const db = getFirestoreClient();
    await addDoc(collection(db, "errors"), {
      where: ev.where,
      message: ev.message,
      detail: ev.detail ?? null,
      ts: serverTimestamp(),
    });
  } catch {
    // Never throw from logging.
  }
}

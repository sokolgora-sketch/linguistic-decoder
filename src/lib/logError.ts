import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app, auth, db } from "./firebase";

export async function logError(ev: { where: string; message: string; detail?: any }) {
  try {
    if (!db || !auth) return; // Do not log if firebase is not initialized
    const uid = (auth.currentUser && auth.currentUser.uid) || "anon";
    const ref = collection(db, "users", uid, "errors");
    await addDoc(ref, {
      where: ev.where,
      message: ev.message?.toString().slice(0, 500),
      detail: ev.detail ? JSON.stringify(ev.detail).slice(0, 2000) : null,
      ts: serverTimestamp(),
      engine: process.env.NEXT_PUBLIC_ENGINE_VERSION || "dev"
    });
  } catch {
    // swallow errors, especially in test env
  }
}

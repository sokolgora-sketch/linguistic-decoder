
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";

export async function logError(ev: { where: string; message: string; detail?: any }) {
  try {
    const db = getFirestore(app);
    const auth = getAuth(app);
    const uid = auth.currentUser?.uid || "anon";
    const ref = collection(db, "users", uid, "errors");
    await addDoc(ref, {
      where: ev.where,
      message: ev.message?.toString().slice(0, 500),
      detail: ev.detail ? JSON.stringify(ev.detail).slice(0, 2000) : null,
      ts: serverTimestamp(),
      engine: process.env.NEXT_PUBLIC_ENGINE_VERSION || "dev"
    });
  } catch {}
}

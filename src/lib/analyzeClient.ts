import { db, ensureAnon, auth } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp, collection, addDoc
} from "firebase/firestore";
import { analyzeWordAction } from "@/app/actions";
import type { Alphabet } from "./solver/engineConfig";

type Mode = "strict" | "open";

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet) {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}`; // if you want to include engineVersion in client cache id, append it
  const cacheRef = doc(db, "analyses", cacheId);

  // 1) READ CACHE
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    console.log("Cache hit!");
    const data = { ...snap.data(), cacheHit: true };
    void saveHistory(word, mode, alphabet); // fire-and-forget
    return data;
  }

  console.log("Cache miss, calculating result...");

  // 2) CALL your Next.js API (or compute locally)
  const result = await analyzeWordAction({ word, mode, alphabet });

  if (!result.ok) {
    throw new Error(result.error);
  }

  const data = result.data;

  // 3) WRITE CACHE (client-side)
  await setDoc(cacheRef, { ...data, cachedAt: serverTimestamp() }, { merge: false });

  // 4) WRITE USER HISTORY
  await saveHistory(word, mode, alphabet);

  return { ...data, cacheHit: false };
}

async function saveHistory(word: string, mode: Mode, alphabet: Alphabet) {
  const u = auth.currentUser;
  if (!u) return;
  const ref = collection(db, "users", u.uid, "history");
  await addDoc(ref, {
    word, mode, alphabet,
    createdAt: serverTimestamp(),
  });
}

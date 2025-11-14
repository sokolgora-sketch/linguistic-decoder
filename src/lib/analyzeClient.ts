
import { db, ensureAnon, auth } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp, collection, addDoc
} from "firebase/firestore";
import { analyzeWordAction } from "@/app/actions";
import type { Alphabet } from "./solver/engineConfig";
import { ENGINE_VERSION } from "./solver/engineVersion";

type Mode = "strict" | "open";

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet) {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;
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


const PREFETCH_SEEN = new Set<string>();

export async function prefetchAnalyze(
  word: string,
  mode: "strict" | "open",
  alphabet: Alphabet,
  callbacks?: { onStart?: () => void; onFinish?: () => void }
) {
  if (!word || word.length < 3) {
    callbacks?.onFinish?.();
    return;
  }
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;
  if (PREFETCH_SEEN.has(cacheId)) {
    callbacks?.onFinish?.();
    return;
  }

  const cacheRef = doc(db, "analyses", cacheId);
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    callbacks?.onFinish?.();
    return;
  }

  callbacks?.onStart?.();
  PREFETCH_SEEN.add(cacheId);

  try {
    const r = await fetch("/api/analyzeSevenVoices", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word, mode, alphabet }),
    });
    const data = await r.json();
    if (data?.error) return;
    await setDoc(cacheRef, { analysis: data, cachedAt: serverTimestamp() }, { merge: false });
  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

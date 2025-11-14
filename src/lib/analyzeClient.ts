
import { db, ensureAnon, auth } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp, collection, addDoc
} from "firebase/firestore";
import type { Alphabet } from "./solver/engineConfig";
import { ENGINE_VERSION } from "./solver/engineVersion";
import { toMappingRecord } from "@/lib/schemaAdapter";

type Mode = "strict" | "open";

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet) {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;
  const cacheRef = doc(db, "analyses", cacheId);

  // 1) READ CACHE
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    console.log("Cache hit!");
    const data = snap.data();
    // fire-and-forget history save
    void saveHistory(word, mode, alphabet); 
    return { analysis: data.analysis, languageFamilies: data.languageFamilies, cacheHit: true };
  }

  console.log("Cache miss, calculating result...");

  // 2) CALL your Next.js API
  const res = await fetch(`/api/analyzeSevenVoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, mode, alphabet }),
  });

  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Analysis failed');
  }
  const analysisResult = await res.json();

  // 3) ADAPT & CALL GEMINI is now handled on the page
  const payload = { 
    analysis: analysisResult,
    // languageFamilies will be added on the page
  };
  
  // 4) WRITE CACHE (client-side) - The page will now handle writing the full payload with families
  await setDoc(cacheRef, { analysis: analysisResult, cachedAt: serverTimestamp() }, { merge: true });


  // 5) WRITE USER HISTORY
  await saveHistory(word, mode, alphabet);

  return { ...payload, cacheHit: false };
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
    // This fetch just warms the server-side analysis cache, not the Gemini part.
    const r = await fetch("/api/analyzeSevenVoices", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word, mode, alphabet }),
    });
    const analysisResult = await r.json();
    if (analysisResult?.error) return;

    // Prefetch doesn't include Gemini, so we can't fully populate the cache here.
    // We could store just the analysis part, but that complicates the cache structure.
    // For now, the prefetch just ensures the heavy lifting (the matrix solve) is done
    // and cached in memory on the server if it's hit again quickly.
    // A more advanced prefetch would call Gemini too.

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

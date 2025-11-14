
import { db, ensureAnon, auth } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp, collection, addDoc
} from "firebase/firestore";
import type { Alphabet } from "./solver/engineConfig";
import { ENGINE_VERSION } from "./solver/engineVersion";

type Mode = "strict" | "open";
type AnalyzeOpts = { bypass?: boolean; skipWrite?: boolean };

// This returns the full payload from the API, which includes the `analysis` key
export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}) {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;
  const cacheRef = doc(db, "analyses", cacheId);

  // BYPASS: For re-analysis or special cases.
  if (opts.bypass) {
    const apiResponse = await fetchAnalysis(word, mode, alphabet);
    if (!opts.skipWrite) {
      await setDoc(cacheRef, { ...apiResponse, cachedAt: serverTimestamp() }, { merge: true });
    }
    void saveHistory(word, mode, alphabet);
    return { ...apiResponse, cacheHit: false, recomputed: true };
  }

  // 1) READ CACHE
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    console.log("Cache hit!");
    const data = snap.data();
    void saveHistory(word, mode, alphabet); 
    // The cached data should have the same shape as the API response
    return { ...data, cacheHit: true };
  }

  console.log("Cache miss, calling API...");
  
  // 2) CALL API
  const apiResponse = await fetchAnalysis(word, mode, alphabet);
  
  // 3) WRITE CACHE - The page will handle enriching with families and then writing.
  // The API response now contains the `analysis` object directly.
  await setDoc(cacheRef, { ...apiResponse, cachedAt: serverTimestamp() }, { merge: true });

  // 4) WRITE USER HISTORY
  await saveHistory(word, mode, alphabet);

  // Return the full API response for the page to orchestrate AI call
  return { ...apiResponse, cacheHit: false };
}

async function fetchAnalysis(word: string, mode: Mode, alphabet: Alphabet) {
  const res = await fetch(`/api/analyzeSevenVoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, mode, alphabet }),
  });

  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Analysis failed');
  }
  return await res.json();
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
    const apiResponse = await r.json();
    if (apiResponse?.error) return;

    // The API response contains the `analysis` object, so we cache it all.
    await setDoc(cacheRef, { ...apiResponse, cachedAt: serverTimestamp() }, { merge: true });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

    
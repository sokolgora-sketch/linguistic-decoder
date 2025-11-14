
import { db, ensureAnon, auth } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp, collection, addDoc
} from "firebase/firestore";
import type { Alphabet } from "./solver/engineConfig";
import { ENGINE_VERSION } from "./solver/engineVersion";

type Mode = "strict" | "open";
type AnalyzeOpts = { bypass?: boolean; skipWrite?: boolean };

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}) {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;
  const cacheRef = doc(db, "analyses", cacheId);

  // BYPASS: For re-analysis or special cases.
  if (opts.bypass) {
    const analysisResult = await fetchAnalysis(word, mode, alphabet);
    if (!opts.skipWrite) {
      await setDoc(cacheRef, { analysis: analysisResult, cachedAt: serverTimestamp() }, { merge: true });
    }
    void saveHistory(word, mode, alphabet);
    return { analysis: analysisResult, cacheHit: false, recomputed: true };
  }

  // 1) READ CACHE
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    console.log("Cache hit!");
    const data = snap.data();
    void saveHistory(word, mode, alphabet); 
    return { analysis: data.analysis, languageFamilies: data.languageFamilies, cacheHit: true };
  }

  console.log("Cache miss, calling API...");
  
  // 2) CALL API
  const analysisResult = await fetchAnalysis(word, mode, alphabet);
  
  // 3) WRITE CACHE (client-side) - The page will now handle writing the full payload with families
  await setDoc(cacheRef, { analysis: analysisResult, cachedAt: serverTimestamp() }, { merge: true });

  // 4) WRITE USER HISTORY
  await saveHistory(word, mode, alphabet);

  // Return just the analysis portion for the page to orchestrate AI call
  return { analysis: analysisResult, cacheHit: false };
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
    const analysisResult = await r.json();
    if (analysisResult?.error) return;

    // We only cache the analysis part. The page component is responsible for the AI call.
    await setDoc(cacheRef, { analysis: analysisResult, cachedAt: serverTimestamp() }, { merge: true });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

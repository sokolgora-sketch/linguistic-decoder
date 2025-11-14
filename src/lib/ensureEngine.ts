
// src/lib/ensureEngine.ts
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "./solver/engineConfig";
import { ENGINE_VERSION } from "./solver/engineVersion";

type Mode = "strict"|"open";

export async function ensureEnginePayload(
  source: any,               // Can be clientResponse or a history row
  mode: Mode,
  alphabet: Alphabet
) {
  // Case 1: Already a valid analysis payload from analyzeClient or cache
  if (source?.analysis?.primaryPath?.voicePath?.length) {
    return source.analysis;
  }

  // Case 2: History row? Try to get the full analysis from cache.
  const word = source?.word;
  const sourceMode = source?.mode ?? mode;
  const sourceAlphabet = source?.alphabet ?? alphabet;

  if (word) {
    const cacheId = `${word}|${sourceMode}|${sourceAlphabet}|${ENGINE_VERSION}`;
    const snap = await getDoc(doc(db, "analyses", cacheId));
    if (snap.exists()) {
        const data = snap.data();
        // The data from cache is nested under an 'analysis' key
        if (data?.analysis?.primaryPath) return data.analysis;
    }
  }

  // Last resort: recompute fresh. This is a failsafe.
  if (word) {
    const result = await analyzeClient(word, mode, alphabet, { bypass: true, skipWrite: true });
    // analyzeClient's result has the analysis data nested under 'analysis'
    if (result?.analysis) return result.analysis;
  }

  throw new Error("ensureEnginePayload: cannot resolve engine payload");
}

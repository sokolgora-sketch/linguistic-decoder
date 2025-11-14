
// src/lib/ensureEngine.ts
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "./solver/engineConfig";
import { ENGINE_VERSION } from "./solver/engineVersion";
import type { Analysis } from "./solver/types";

type Mode = "strict"|"open";

export async function ensureEnginePayload(
  source: any,               // Can be clientResponse or a history row
  mode: Mode,
  alphabet: Alphabet
): Promise<Analysis> {
  // Case 1: Already a valid analysis payload from analyzeClient or cache
  if (source?.analysis?.primaryPath?.voicePath?.length) {
    console.log("ensureEnginePayload: Source has valid analysis object.");
    return source.analysis;
  }

  // Case 2: History row? Try to get the full analysis from cache.
  const word = source?.word;
  const sourceMode = source?.mode ?? mode;
  const sourceAlphabet = source?.alphabet ?? alphabet;

  if (word) {
    console.warn("ensureEnginePayload: Source is missing analysis. Attempting to fetch from cache for word:", word);
    const cacheId = `${word}|${sourceMode}|${sourceAlphabet}|${ENGINE_VERSION}`;
    const snap = await getDoc(doc(db, "analyses", cacheId));
    if (snap.exists()) {
        const data = snap.data();
        // The data from cache is nested under an 'analysis' key
        if (data?.analysis?.primaryPath?.voicePath?.length) {
          console.log("ensureEnginePayload: Found valid payload in cache.");
          return data.analysis;
        } else {
          console.warn("ensureEnginePayload: Cache data is invalid for", cacheId, data);
        }
    }
  }

  // Last resort: recompute fresh. This is a failsafe.
  if (word) {
    console.error("ensureEnginePayload: All fallbacks failed. Re-computing fresh analysis for:", word);
    const result = await analyzeClient(word, mode, alphabet, { bypass: true, skipWrite: true });
    // analyzeClient's result has the analysis data nested under 'analysis'
    if (result?.analysis?.primaryPath?.voicePath?.length) {
      return result.analysis;
    }
  }

  console.error("ensureEnginePayload: Final failure. Could not resolve a valid payload from source:", source);
  throw new Error("ensureEnginePayload: cannot resolve engine payload");
}

    
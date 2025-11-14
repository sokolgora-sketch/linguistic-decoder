
// src/lib/ensureEngine.ts
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "./solver/engineConfig";

type Mode = "strict"|"open";

export async function ensureEnginePayload(
  source: any,               // engine payload OR history row
  mode: Mode,
  alphabet: Alphabet
) {
  // Already good? If it has the 'primary' key, we assume it's a valid analysis object.
  if (source?.primary?.voice_path?.length) return source;

  // History row? Try analyses/{cacheId}
  if (source?.cacheId) {
    const snap = await getDoc(doc(db, "analyses", source.cacheId));
    if (snap.exists()) {
        const data = snap.data();
        // The data from cache is nested under an 'analysis' key
        if (data?.analysis?.primary) return data.analysis;
    }
  }

  // Last resort: recompute fresh. This is a failsafe.
  if (source?.word) {
    const result = await analyzeClient(source.word, mode, alphabet, { bypass: true, skipWrite: true });
    return result.analysis;
  }

  throw new Error("ensureEnginePayload: cannot resolve engine payload");
}

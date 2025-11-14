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
  // Already good?
  if (source?.primaryPath?.voicePath?.length) return source;

  // History row? Try analyses/{cacheId}
  if (source?.cacheId) {
    const snap = await getDoc(doc(db, "analyses", source.cacheId));
    if (snap.exists()) return snap.data();
  }

  // Last resort: recompute fresh
  if (source?.word) {
    return await analyzeClient(source.word, mode, alphabet, { bypass: true, skipWrite: true });
  }

  throw new Error("ensureEnginePayload: cannot resolve engine payload");
}
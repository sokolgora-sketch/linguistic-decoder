import { db, ensureAnon, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { ENGINE_VERSION } from "@/shared/engineVersion";
import { normalizeEnginePayload, type EnginePayload } from "@/shared/engineShape";

// Browser-safe engine code:
import { solveWord } from "@/functions/sevenVoicesCore";
import type { SolveOptions, Vowel } from "@/functions/sevenVoicesCore";
import { chooseProfile } from "@/functions/languages";
import { readWindowsDebug, extractBase, normalizeTerminalY } from "@/functions/sevenVoicesC";


type Mode = "strict" | "open";
type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german";
type AnalyzeOpts = { bypass?: boolean; skipWrite?: boolean };

const CFG = { beamWidth: 8, maxOpsStrict: 1, maxOpsOpen: 2, cost: { sub:1, del:3, insClosure:2 } };

function computeLocal(word: string, mode: Mode, alphabet: Alphabet): EnginePayload {
  const strict = mode === "strict";
  const t0 = Date.now();
  const opts: SolveOptions = strict
    ? { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: CFG.cost }
    : { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: CFG.cost };

  const analysisResult = solveWord(word, opts, alphabet);

  // Construct canonical, then pass through normalizer (paranoid but consistent)
  return normalizeEnginePayload({
    ...analysisResult,
    word,
    mode,
    alphabet,
    solveMs: Date.now() - t0,
    cacheHit: false,
  });
}

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}) {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;
  const cacheRef = doc(db, "analyses", cacheId);

  // BYPASS: compute fresh, skip cache unless caller overrides
  if (opts.bypass) {
    const fresh = computeLocal(word, mode, alphabet);
    const payload = { ...fresh, recomputed: true, cacheHit: false };

    // Ensure no undefined fields (e.g., recomputed)
    const safePayload = {
      ...payload,
      recomputed: payload.recomputed ?? false,  // Default to false if undefined
    };

    if (!opts.skipWrite) {
      await setDoc(cacheRef, { ...safePayload, cachedAt: serverTimestamp() }, { merge: false });
    }
    void saveHistory(cacheId, word, mode, alphabet, "bypass");
    return safePayload;
  }

  // Try cache -> normalize (in case older writes used a different shape)
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    const normalized = normalizeEnginePayload(snap.data());
    void saveHistory(cacheId, word, mode, alphabet, "cache");
    return { ...normalized, cacheHit: true, recomputed: false };
  }

  // Miss → compute → write → return
  const fresh = computeLocal(word, mode, alphabet);
  // Ensure no undefined fields in the final payload
  const safeFresh = {
    ...fresh,
    recomputed: fresh.recomputed ?? false,  // Default to false if undefined
  };

  await setDoc(cacheRef, { ...safeFresh, cachedAt: serverTimestamp() }, { merge: false });
  void saveHistory(cacheId, word, mode, alphabet, "fresh");
  return safeFresh;
}

async function saveHistory(
  cacheId: string, word: string, mode: Mode, alphabet: Alphabet, source: "cache"|"fresh"|"bypass"
) {
  const u = auth.currentUser;
  if (!u) return;
  const ref = collection(db, "users", u.uid, "history");
  await addDoc(ref, { cacheId, word, mode, alphabet, engineVersion: ENGINE_VERSION, source, createdAt: serverTimestamp() });
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
    const fresh = computeLocal(word, mode, alphabet);
    await setDoc(cacheRef, { ...fresh, cachedAt: serverTimestamp() }, { merge: false });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

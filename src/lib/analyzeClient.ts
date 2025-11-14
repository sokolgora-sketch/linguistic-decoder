
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
type AnalyzeOpts = {
    bypass?: boolean;
    skipWrite?: boolean;
    payload?: EnginePayload; // Allow passing a payload to write
};

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

  // BYPASS / WRITE-THROUGH: compute fresh or use provided payload, skip cache read
  if (opts.bypass) {
    const payload = opts.payload ? normalizeEnginePayload(opts.payload) : computeLocal(word, mode, alphabet);
    const finalPayload = { 
        ...payload, 
        recomputed: true, 
        cacheHit: false,
        languageFamilies: payload.languageFamilies ?? null,
    };
    
    if (!opts.skipWrite) {
      await setDoc(cacheRef, { ...finalPayload, cachedAt: serverTimestamp() }, { merge: true });
    }
    
    void saveHistory(cacheId, word, mode, alphabet, "bypass");
    return finalPayload;
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
  const docToWrite = {
    ...fresh,
    languageFamilies: fresh.languageFamilies ?? null,
    cachedAt: serverTimestamp()
  };

  await setDoc(cacheRef, docToWrite, { merge: false });
  void saveHistory(cacheId, word, mode, alphabet, "fresh");
  return fresh;
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
    const docToWrite = {
        ...fresh,
        languageFamilies: fresh.languageFamilies ?? null,
        cachedAt: serverTimestamp()
    };
    await setDoc(cacheRef, docToWrite, { merge: false });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

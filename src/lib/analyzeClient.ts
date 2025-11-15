
import { db, ensureAnon, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { normalizeEnginePayload, type EnginePayload } from "@/shared/engineShape";

// Browser-safe engine code:
import { solveWord } from "@/functions/sevenVoicesCore";
import type { SolveOptions, Vowel } from "@/functions/sevenVoicesCore";
import { mapWordToLanguageFamilies } from "@/lib/mapper";
import { sanitizeForFirestore } from "@/lib/sanitize";
import { getManifest } from "@/engine/manifest";


type Mode = "strict" | "open";
type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german";
type AnalyzeOpts = {
    bypass?: boolean;
    skipWrite?: boolean;
    payload?: EnginePayload; // Allow passing a payload to write
    edgeWeight?: number;
};

// NEW helper: safe join
const joinPath = (xs?: string[]) => Array.isArray(xs) ? xs.join("→") : "";

const CFG = { beamWidth: 8, maxOpsStrict: 1, maxOpsOpen: 2, cost: { sub:1, del:3, insClosure:2 } };

function computeLocal(word: string, mode: Mode, alphabet: Alphabet, edgeWeight?: number): EnginePayload {
  const strict = mode === "strict";
  const manifest = getManifest(); // Use default manifest for local compute
  const t0 = Date.now();
  const opts: SolveOptions = strict
    ? { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: CFG.cost, edgeWeight, alphabet, manifest }
    : { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: CFG.cost, edgeWeight, alphabet, manifest };

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
  const manifest = getManifest();
  const cacheId = `${word}|${mode}|${alphabet}|${manifest.version}|ew:${opts.edgeWeight ?? manifest.edgeWeight}`;
  const cacheRef = doc(db, "analyses", cacheId);

  // BYPASS / WRITE-THROUGH: compute fresh or use provided payload, skip cache read
  if (opts.bypass) {
    const payloadToUse = opts.payload ? normalizeEnginePayload(opts.payload) : computeLocal(word, mode, alphabet, opts.edgeWeight);
    const families = await mapWordToLanguageFamilies(payloadToUse);
    const enrichedPayload = { ...payloadToUse, languageFamilies: families ?? [] };
    
    if (!opts.skipWrite) {
      const cleanPayload = sanitizeForFirestore(enrichedPayload);
      await setDoc(cacheRef, { ...cleanPayload, cachedAt: serverTimestamp() }, { merge: true });
    }
    
    void saveHistory(cacheId, enrichedPayload, "bypass");
    return { ...enrichedPayload, recomputed: true, cacheHit: false };
  }

  // Try cache -> normalize (in case older writes used a different shape)
  const snap = await getDoc(cacheRef);
  if (snap.exists()) {
    const normalized = normalizeEnginePayload(snap.data());
    void saveHistory(cacheId, normalized, "cache");
    return { ...normalized, cacheHit: true, recomputed: false };
  }

  // Miss → compute → map → write → return
  const fresh = computeLocal(word, mode, alphabet, opts.edgeWeight);
  const families = await mapWordToLanguageFamilies(fresh);
  const enriched = { ...fresh, languageFamilies: families ?? [] };

  const cleanFresh = sanitizeForFirestore(enriched);

  await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });
  void saveHistory(cacheId, enriched, "fresh");
  return { ...enriched, cacheHit: false, recomputed: false };
}

async function saveHistory(
  cacheId: string,
  engine: any,                 // <-- pass the full engine payload
  source: "cache"|"fresh"|"bypass"
) {
  const u = auth.currentUser;
  if (!u) return;

  const ref = collection(db, "users", u.uid, "history");

  const word = String(engine?.word ?? "");
  const mode = String(engine?.mode ?? "strict");
  const alphabet = String(engine?.alphabet ?? "auto");
  const engineVersion = String(engine?.engineVersion ?? "unknown");
  const primaryPath = engine?.primaryPath ?? {};
  const voicePath = primaryPath?.voicePath ?? [];
  const ringPath  = primaryPath?.ringPath  ?? [];
  const levelPath = primaryPath?.levelPath ?? [];
  const primaryVoice = joinPath(voicePath);

  const docData = {
    cacheId, word, mode, alphabet, engineVersion, source,
    primaryVoice,
    voicePath, ringPath, levelPath,
    solveMs: engine?.solveMs ?? null,
    cacheHit: !!engine?.cacheHit,
    createdAt: serverTimestamp(),
  };

  // strip undefineds
  const clean = JSON.parse(JSON.stringify(docData));
  await addDoc(ref, clean);
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
  const manifest = getManifest();
  const cacheId = `${word}|${mode}|${alphabet}|${manifest.version}|ew:${manifest.edgeWeight}`; // Prefetch with default weight
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
    const families = await mapWordToLanguageFamilies(fresh);
    const enriched = { ...fresh, languageFamilies: families ?? [] };
    const cleanFresh = sanitizeForFirestore(enriched);
    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

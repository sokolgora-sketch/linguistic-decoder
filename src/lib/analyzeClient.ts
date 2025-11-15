
import { db, ensureAnon, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { normalizeEnginePayload, type EnginePayload } from "@/shared/engineShape";
import { logError } from "./logError";

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
    useAi?: boolean; // New flag to control AI mapper
};

// NEW helper: safe join
const joinPath = (xs?: (string|Vowel)[]) => Array.isArray(xs) ? xs.join("→") : "";

function computeLocal(word: string, mode: Mode, alphabet: Alphabet, edgeWeight?: number): EnginePayload {
  const manifest = getManifest(); // Use default manifest for local compute
  const t0 = Date.now();
  
  const strict = mode === "strict";
  const opCost = manifest.opCost;

  const opts: SolveOptions = {
    beamWidth: 8,
    maxOps: strict ? 1 : 2,
    allowDelete: !strict,
    allowClosure: !strict,
    opCost: opCost,
    edgeWeight,
    alphabet,
    manifest,
  };

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
  const useAiForMapping = opts.useAi ?? false;

  try {
    // BYPASS / WRITE-THROUGH: compute fresh or use provided payload, skip cache read
    if (opts.bypass) {
      const payloadToUse = opts.payload ? normalizeEnginePayload(opts.payload) : computeLocal(word, mode, alphabet, opts.edgeWeight);
      const families = await mapWordToLanguageFamilies(payloadToUse.word, payloadToUse.primaryPath.voicePath, useAiForMapping);
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
      // If cached version doesn't have families, compute them now.
      if (!normalized.languageFamilies || normalized.languageFamilies.length === 0) {
        const families = await mapWordToLanguageFamilies(normalized.word, normalized.primaryPath.voicePath, useAiForMapping);
        normalized.languageFamilies = families;
        // Asynchronously update cache with families
        if (!opts.skipWrite) {
          const cleanPayload = sanitizeForFirestore(normalized);
          setDoc(cacheRef, { ...cleanPayload, cachedAt: serverTimestamp() }, { merge: true }).catch(e => logError({ where: "analyzeClient-cache-update", message: e.message }));
        }
      }
      void saveHistory(cacheId, normalized, "cache");
      return { ...normalized, cacheHit: true, recomputed: false };
    }

    // Miss → compute → map → write → return
    const fresh = computeLocal(word, mode, alphabet, opts.edgeWeight);
    const families = await mapWordToLanguageFamilies(fresh.word, fresh.primaryPath.voicePath, useAiForMapping);
    const enriched = { ...fresh, languageFamilies: families ?? [] };

    const cleanFresh = sanitizeForFirestore(enriched);

    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });
    void saveHistory(cacheId, enriched, "fresh");
    return { ...enriched, cacheHit: false, recomputed: false };
  } catch (e: any) {
    logError({ where: "analyzeClient", message: e.message, detail: { word, mode, alphabet, stack: e.stack } });
    throw e; // re-throw to be caught by UI
  }
}

async function saveHistory(
  cacheId: string,
  engine: EnginePayload,
  source: "cache"|"fresh"|"bypass"
) {
  const u = auth.currentUser;
  if (!u) return;

  try {
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
  } catch(e:any) {
    logError({ where: "saveHistory", message: e.message, detail: e.stack });
    // This is non-critical, so don't throw to the user
  }
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
    const families = await mapWordToLanguageFamilies(fresh.word, fresh.primaryPath.voicePath, false); // always use local for prefetch
    const enriched = { ...fresh, languageFamilies: families ?? [] };
    const cleanFresh = sanitizeForFirestore(enriched);
    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

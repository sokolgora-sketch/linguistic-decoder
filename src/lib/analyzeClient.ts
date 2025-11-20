import { db, ensureAnon, auth } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { normalizeEnginePayload, type EnginePayload, type Vowel, LanguageFamily, type AnalysisResult } from "../shared/engineShape";
import { logError } from "./logError";
import { runAnalysis } from "./runAnalysis";
import { enginePayloadToAnalysisResult } from '@/shared/analysisAdapter';


// Browser-safe engine code:
import type { SolveOptions } from "../functions/sevenVoicesCore";
import { sanitizeForFirestore } from "./sanitize";
import { getManifest } from "../engine/manifest";
import { detectAlphabetFair } from "./alphabet/autoDetect";


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
  
  const strict = mode === "strict";
  const opCost = manifest.opCost;

  // Initial detection without voice path to determine solver alphabet
  const initialDet = detectAlphabetFair(word, [], alphabet);
  const effectiveAlphabet = initialDet.winner;

  const opts: SolveOptions = {
    beamWidth: 8,
    maxOps: strict ? 1 : 2,
    allowDelete: !strict,
    allowClosure: !strict,
    opCost: opCost,
    edgeWeight,
    alphabet: effectiveAlphabet,
    manifest,
  };

  const analysisResult = runAnalysis(word, opts, effectiveAlphabet);
  
  // Now, run detection *again* with the voice path to get final family scores
  const finalDet = detectAlphabetFair(word, analysisResult.primaryPath.voicePath, alphabet);

  const languageFamilies: LanguageFamily[] = finalDet.scores.map(s => ({
    familyId: s.family,
    label: s.family.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    confidence: s.score / 100,
    rationale: "", // No rationale from this detector
    forms: [],
    signals: [],
    dialect: (s as any).dialect,
  }));


  // Construct canonical, then pass through normalizer (paranoid but consistent)
  return normalizeEnginePayload({
    ...analysisResult,
    languageFamilies,
  });
}

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}): Promise<EnginePayload & { analysis?: AnalysisResult }> {
  await ensureAnon();
  const manifest = getManifest();

  // Initial detection to get a consistent cache key
  const initialDet = detectAlphabetFair(word, [], alphabet);
  const effectiveAlphabet = initialDet.winner;
  const cacheId = `${word}|${mode}|${effectiveAlphabet}|${manifest.version}|ew:${opts.edgeWeight ?? manifest.edgeWeight}`;
  
  // If db isn't initialized, we can only do local computation.
  if (!db) {
    console.warn("Firestore not available. Skipping cache and returning local computation.");
    const enginePayload = computeLocal(word, mode, alphabet, opts.edgeWeight);
    const analysis = enginePayloadToAnalysisResult(enginePayload);
    return { ...enginePayload, solveMs: 0, cacheHit: false, analysis };
  }

  const cacheRef = doc(db, "analyses", cacheId);
  const t0 = Date.now();

  try {
    let enginePayload: EnginePayload;
    let fromCache = false;
    let wasRecomputed = false;

    // BYPASS / WRITE-THROUGH: compute fresh or use provided payload, skip cache read
    if (opts.bypass) {
      enginePayload = opts.payload ? normalizeEnginePayload(opts.payload) : computeLocal(word, mode, alphabet, opts.edgeWeight);
      wasRecomputed = true;
      if (!opts.skipWrite) {
        const cleanPayload = sanitizeForFirestore(enginePayload);
        await setDoc(cacheRef, { ...cleanPayload, cachedAt: serverTimestamp() }, { merge: true });
      }
    } else {
      // Try cache -> normalize (in case older writes used a different shape)
      const snap = await getDoc(cacheRef);
      if (snap.exists()) {
        enginePayload = normalizeEnginePayload(snap.data());
        // Re-run detection to ensure families are up to date with latest logic
        const det = detectAlphabetFair(word, enginePayload.primaryPath.voicePath, alphabet);
        enginePayload.languageFamilies = det.scores.map(s => ({
            familyId: s.family,
            label: s.family.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            confidence: s.score / 100,
            rationale: "", forms: [], signals: [],
            dialect: (s as any).dialect,
        }));
        fromCache = true;
      } else {
        // Miss → compute → write → return
        enginePayload = computeLocal(word, mode, alphabet, opts.edgeWeight);
        const cleanFresh = sanitizeForFirestore(enginePayload);
        await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });
      }
    }
    
    void saveHistory(cacheId, enginePayload, fromCache ? "cache" : (wasRecomputed ? "bypass" : "fresh"));
    const analysis = enginePayloadToAnalysisResult(enginePayload);

    return { 
      ...enginePayload,
      analysis,
      cacheHit: fromCache, 
      recomputed: wasRecomputed,
      solveMs: Date.now() - t0 
    };

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
  if (!db) return; // Guard clause
  const u = auth?.currentUser;
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
  const initialDet = detectAlphabetFair(word, [], alphabet);
  const effectiveAlphabet = initialDet.winner;
  const cacheId = `${word}|${mode}|${effectiveAlphabet}|${manifest.version}|ew:${manifest.edgeWeight}`;
  if (PREFETCH_SEEN.has(cacheId)) {
    callbacks?.onFinish?.();
    return;
  }

  // If db isn't initialized, we can't prefetch.
  if (!db) {
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
    const cleanFresh = sanitizeForFirestore(fresh);
    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

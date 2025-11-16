
import { db, ensureAnon, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { normalizeEnginePayload, type EnginePayload, type Vowel, LanguageFamily } from "@/shared/engineShape";
import { logError } from "./logError";
import { toMappingRecord } from "./schemaAdapter";

// Browser-safe engine code:
import { solveWord } from "@/functions/sevenVoicesCore";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import { mapWordToLanguageFamilies as mapWithAi } from "@/ai/flows/map-word-to-language-families";
import { sanitizeForFirestore } from "@/lib/sanitize";
import { getManifest } from "@/engine/manifest";
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
  const t0 = Date.now();
  
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

  const analysisResult = solveWord(word, opts, effectiveAlphabet);
  
  const payload = {
    ...analysisResult,
    word,
    mode,
    alphabet: effectiveAlphabet,
    solveMs: Date.now() - t0,
    cacheHit: false,
    languageFamilies: [], // Will be filled in by local or AI mapper later
  };
  
  return normalizeEnginePayload(payload);
}

// Local-only language mapping
function mapLocal(payload: EnginePayload): LanguageFamily[] {
    const det = detectAlphabetFair(payload.word, payload.primaryPath.voicePath, payload.alphabet as Alphabet);
    return det.scores.map(s => ({
        familyId: s.family,
        label: s.family.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        confidence: s.score / 100,
        rationale: "", forms: [], signals: ["local_mapper"],
    }));
}


export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}) {
  await ensureAnon();
  const manifest = getManifest();
  const useAi = opts.useAi ?? false;

  // Cache key must now include AI usage flag
  const initialDet = detectAlphabetFair(word, [], alphabet);
  const effectiveAlphabet = initialDet.winner;
  const cacheId = `${word}|${mode}|${effectiveAlphabet}|${manifest.version}|ew:${opts.edgeWeight ?? manifest.edgeWeight}|ai:${useAi}`;
  
  const cacheRef = doc(db, "analyses", cacheId);

  try {
    // BYPASS / WRITE-THROUGH: always compute fresh
    if (opts.bypass) {
        let payload = opts.payload ? normalizeEnginePayload(opts.payload) : computeLocal(word, mode, alphabet, opts.edgeWeight);
        payload.languageFamilies = useAi
            ? (await mapWithAi(toMappingRecord(payload)) as any).candidates_map // TODO: Fix type
            : mapLocal(payload);

        if (!opts.skipWrite) {
            const cleanPayload = sanitizeForFirestore(payload);
            await setDoc(cacheRef, { ...cleanPayload, cachedAt: serverTimestamp() }, { merge: true });
        }
        
        void saveHistory(cacheId, payload, "bypass");
        return { ...payload, recomputed: true, cacheHit: false };
    }

    // 1. Try cache
    const snap = await getDoc(cacheRef);
    if (snap.exists()) {
        const normalized = normalizeEnginePayload(snap.data());
        void saveHistory(cacheId, normalized, "cache");
        return { ...normalized, cacheHit: true, recomputed: false };
    }

    // 2. Cache miss -> compute fresh
    const freshPayload = computeLocal(word, mode, alphabet, opts.edgeWeight);

    // 3. Map languages (local or AI)
    if (useAi) {
      try {
        const aiResult: any = await mapWithAi(toMappingRecord(freshPayload));
        // This is a rough adaptation; the AI returns a map, not an array.
        // We will need to adapt the UI to handle this richer structure.
        // For now, we'll crudely convert it to fit the old shape for verification.
        freshPayload.languageFamilies = Object.entries(aiResult.candidates_map || {}).map(([key, val]: [string, any]) => ({
            familyId: key.toLowerCase() as any,
            label: key,
            confidence: 0.9, // AI doesn't give confidence, so fake it for now
            rationale: val[0]?.functional || "AI mapped",
            forms: val.map((v:any) => v.form),
            signals: aiResult.signals,
        }));
      } catch (aiError: any) {
        logError({ where: "analyzeClient-aiMapper", message: aiError.message, detail: { word, stack: aiError.stack }});
        // Fallback to local mapper on AI error
        freshPayload.languageFamilies = mapLocal(freshPayload);
        freshPayload.signals?.push("AI_MAPPER_FAILED");
      }
    } else {
        freshPayload.languageFamilies = mapLocal(freshPayload);
    }

    // 4. Write to cache and history
    const cleanFresh = sanitizeForFirestore(freshPayload);
    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });
    void saveHistory(cacheId, freshPayload, "fresh");
    
    return { ...freshPayload, cacheHit: false, recomputed: false };
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
  const initialDet = detectAlphabetFair(word, [], alphabet);
  const effectiveAlphabet = initialDet.winner;
  const cacheId = `${word}|${mode}|${effectiveAlphabet}|${manifest.version}|ew:${manifest.edgeWeight}`;
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
    const cleanFresh = sanitizeForFirestore(fresh);
    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });

  } catch (e) {
    console.warn("Prefetch failed", e);
  } finally {
    callbacks?.onFinish?.();
  }
}

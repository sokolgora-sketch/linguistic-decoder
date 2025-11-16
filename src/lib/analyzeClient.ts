

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { normalizeEnginePayload, type EnginePayload, type LanguageFamily } from "@/shared/engineShape";
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
    payload?: EnginePayload;
    edgeWeight?: number;
    useAi?: boolean;
};

type AnalyzeResult = {
  payload: EnginePayload;
  cacheId: string;
}

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


export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}): Promise<AnalyzeResult> {
  const manifest = getManifest();
  const useAi = opts.useAi ?? false;

  const initialDet = detectAlphabetFair(word, [], alphabet);
  const effectiveAlphabet = initialDet.winner;
  const cacheId = `${word}|${mode}|${effectiveAlphabet}|${manifest.version}|ew:${opts.edgeWeight ?? manifest.edgeWeight}|ai:${useAi}`;
  
  const cacheRef = doc(db, "analyses", cacheId);

  try {
    if (opts.bypass) {
        let payload = opts.payload ? normalizeEnginePayload(opts.payload) : computeLocal(word, mode, alphabet, opts.edgeWeight);
        payload.languageFamilies = useAi
            ? (await mapWithAi(toMappingRecord(payload)) as any).candidates_map
            : mapLocal(payload);

        if (!opts.skipWrite) {
            const cleanPayload = sanitizeForFirestore(payload);
            await setDoc(cacheRef, { ...cleanPayload, cachedAt: serverTimestamp() }, { merge: true });
        }
        
        return { payload: { ...payload, recomputed: true, cacheHit: false }, cacheId };
    }

    const snap = await getDoc(cacheRef);
    if (snap.exists()) {
        const normalized = normalizeEnginePayload(snap.data());
        return { payload: { ...normalized, cacheHit: true, recomputed: false }, cacheId };
    }

    const freshPayload = computeLocal(word, mode, alphabet, opts.edgeWeight);

    if (useAi) {
      try {
        const aiResult: any = await mapWithAi(toMappingRecord(freshPayload));
        freshPayload.languageFamilies = Object.entries(aiResult.candidates_map || {}).map(([key, val]: [string, any]) => ({
            familyId: key.toLowerCase() as any,
            label: key,
            confidence: 0.9,
            rationale: val[0]?.functional || "AI mapped",
            forms: val.map((v:any) => v.form),
            signals: aiResult.signals,
        }));
      } catch (aiError: any) {
        logError({ where: "analyzeClient-aiMapper", message: aiError.message, detail: { word, stack: aiError.stack }});
        freshPayload.languageFamilies = mapLocal(freshPayload);
        if (freshPayload.signals) {
            freshPayload.signals.push("AI_MAPPER_FAILED");
        } else {
            freshPayload.signals = ["AI_MAPPER_FAILED"];
        }
      }
    } else {
        freshPayload.languageFamilies = mapLocal(freshPayload);
    }

    const cleanFresh = sanitizeForFirestore(freshPayload);
    await setDoc(cacheRef, { ...cleanFresh, cachedAt: serverTimestamp() }, { merge: false });
    
    return { payload: { ...freshPayload, cacheHit: false, recomputed: false }, cacheId };
  } catch (e: any) {
    logError({ where: "analyzeClient", message: e.message, detail: { word, mode, alphabet, stack: e.stack } });
    throw e;
  }
}

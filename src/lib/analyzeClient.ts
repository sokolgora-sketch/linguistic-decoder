import { db, ensureAnon, auth } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { normalizeEnginePayload, type EnginePayload, type Vowel, LanguageFamily } from "../shared/engineShape";
import { logError } from "./logError";
import { sanitizeForFirestore } from "./sanitize";
import { runAnalysis, ENGINE_VERSION } from "./runAnalysis";
import { mapWordToLanguageFamilies } from "./mapper";


type Mode = "strict" | "open";
type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german";
type AnalyzeOpts = {
    bypass?: boolean;
    skipWrite?: boolean;
    payload?: any; // Allow passing a payload to write
    edgeWeight?: number;
    useAi?: boolean; // New flag to control AI mapper
};

function computeLocal(word: string, mode: Mode, alphabet: Alphabet, edgeWeight?: number): EnginePayload {
    const manifest = { edgeWeight };
    const analysis = runAnalysis(word, {
        beamWidth: 8,
        maxOps: mode === 'strict' ? 1 : 2,
        allowDelete: mode !== 'strict',
        allowClosure: mode !== 'strict',
        opCost: { sub:1, del:4, ins:3 },
        alphabet,
        manifest: {
            ...getManifest(),
            ...manifest
        } as any,
        edgeWeight: edgeWeight ?? getManifest().edgeWeight,
    }, alphabet);
    return analysis;
}

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}): Promise<EnginePayload> {
  await ensureAnon();
  const cacheId = `${word}|${mode}|${alphabet}|${ENGINE_VERSION}`;

  if (!opts.bypass) {
    const cached = await loadCache(cacheId);
    if (cached) {
      void saveHistory(cached, "cache", cacheId);
      return { ...cached, cacheHit: true };
    }
  }

  const t0 = Date.now();
  let analysisResult;

  if (opts.payload) {
    analysisResult = normalizeEnginePayload(opts.payload);
  } else {
    analysisResult = computeLocal(word, mode, alphabet, opts.edgeWeight);
  }

  if (opts.useAi) {
      const families = await mapWordToLanguageFamilies(word, analysisResult.primaryPath.voicePath, true);
      analysisResult.languageFamilies = families;
  }
  
  if (!opts.skipWrite) {
    void saveCache(cacheId, analysisResult);
    void saveHistory(analysisResult, opts.bypass ? "bypass" : "fresh", cacheId);
  }
  
  return { ...analysisResult, solveMs: Date.now() - t0 };
}


async function loadCache(id: string): Promise<EnginePayload | null> {
  if (!db) return null; // Guard clause
  try {
    const ref = doc(db, "analyses", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return normalizeEnginePayload(snap.data());
    }
  } catch (e: any) {
    logError({ where: "loadCache", message: e.message, detail: { id } });
  }
  return null;
}

async function saveCache(id: string, payload: EnginePayload) {
  if (!db) return; // Guard clause
  try {
    const ref = doc(db, "analyses", id);
    const data = {
      ...payload,
      meta: { ...payload, client: undefined },
      createdAt: serverTimestamp(),
    };
    const clean = sanitizeForFirestore(data);
    await setDoc(ref, clean, { merge: true });
  } catch (e: any) {
    logError({ where: "saveCache", message: e.message, detail: { id } });
  }
}

async function saveHistory(
  result: EnginePayload,
  source: "cache"|"fresh"|"bypass",
  cacheId: string
) {
  if (!db) return; // Guard clause
  const u = auth?.currentUser;
  if (!u) return;

  try {
    const ref = collection(db, "users", u.uid, "history");
    const { primaryPath } = result;

    const docData = {
      word: result.word,
      mode: result.mode,
      alphabet: result.alphabet,
      engineVersion: result.engineVersion,
      source: source,
      primaryVoice: primaryPath.voicePath.join("→"),
      createdAt: serverTimestamp(),
      cacheId,
    };
    
    const clean = sanitizeForFirestore(docData);
    await addDoc(ref, clean);
  } catch(e:any) {
    logError({ where: "
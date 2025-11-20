import { db, ensureAnon, auth } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { normalizeEnginePayload, type AnalyzeWordResult, type Vowel, LanguageFamily } from "../shared/engineShape";
import { logError } from "./logError";
import { sanitizeForFirestore } from "./sanitize";
import { analyzeWord } from "@/engine/analyzeWord";


type Mode = "strict" | "open";
type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german";
type AnalyzeOpts = {
    bypass?: boolean;
    skipWrite?: boolean;
    payload?: any; // Allow passing a payload to write
    edgeWeight?: number;
    useAi?: boolean; // New flag to control AI mapper
};

// NEW helper: safe join
const joinPath = (xs?: (string|Vowel)[]) => Array.isArray(xs) ? xs.join("→") : "";

function computeLocal(word: string, mode: Mode, alphabet: Alphabet, edgeWeight?: number): AnalyzeWordResult {
    return analyzeWord(word, mode === 'open' ? 'explore' : 'strict');
}

export async function analyzeClient(word: string, mode: Mode, alphabet: Alphabet, opts: AnalyzeOpts = {}): Promise<AnalyzeWordResult> {
  await ensureAnon();
  
  const t0 = Date.now();
  const effectiveMode = mode === 'open' ? 'explore' : 'strict';
  const analysisResult = computeLocal(word, mode, alphabet, opts.edgeWeight);

  // The new analyzeWord function is deterministic and contains all info, so we don't need a cache for now.
  // The history save is still valuable.
  void saveHistory(analysisResult, "fresh");
  
  return { 
      ...analysisResult,
      meta: {
          ...analysisResult.meta,
          solveMs: Date.now() - t0,
      }
  };
}

async function saveHistory(
  result: AnalyzeWordResult,
  source: "cache"|"fresh"|"bypass"
) {
  if (!db) return; // Guard clause
  const u = auth?.currentUser;
  if (!u) return;

  try {
    const ref = collection(db, "users", u.uid, "history");

    const docData = {
      word: result.word,
      mode: result.meta.mode,
      alphabet: result.meta.alphabet,
      engineVersion: result.meta.engineVersion,
      source: source,
      primaryVoice: result.primaryPath.voicePath,
      createdAt: serverTimestamp(),
      cacheId: `${result.word}|${result.meta.mode}|${result.meta.alphabet}|${result.meta.engineVersion}`
    };
    
    const clean = sanitizeForFirestore(docData);
    await addDoc(ref, clean);
  } catch(e:any) {
    logError({ where: "saveHistory", message: e.message, detail: e.stack });
    // This is non-critical, so don't throw to the user
  }
}


'use server';

import { solveMatrix, type Analysis, type SolveMode } from '@/lib/solver';
import { mapWordToLanguageFamilies } from '@/ai/flows/map-word-to-language-families';
import { z } from 'zod';

// ==== From user prompt =================================
type Checksums = { V:number; E:number; C:number };
type PathBlock = {
  voice_path: string[]; ring_path: number[]; level_path: number[];
  ops: string[]; checksums: Checksums; kept?: number; deleted?: number;
};
export type EngineResult = {
  engineVersion:string; word:string; mode:"strict"|"open";
  primary: PathBlock; frontier: PathBlock[]; signals: string[];
};

function toChecksums(cs:any): Checksums {
  if (Array.isArray(cs)) {
    const o: any = {}; for (const it of cs) o[it?.type] = Number(it?.value);
    return { V:o.V??0, E:o.E??0, C:o.C??0 };
  }
  return { V:Number(cs?.V??0), E:Number(cs?.E??0), C:Number(cs?.C??0) };
}
function normBlock(b:any): PathBlock {
  return {
    voice_path: b.voice_path || b.voicePath || [],
    ring_path:  b.ring_path  || b.ringPath  || [],
    level_path: b.level_path || b.levelPath || [],
    ops:        b.ops || [],
    checksums:  toChecksums(b.checksums),
    kept:       b.kept, deleted: b.deleted
  };
}
function normalizePayload(j:any): EngineResult {
  const p = j.primary ?? j.primaryPath, f = j.frontier ?? j.frontierPaths ?? [];
  return {
    engineVersion: j.engineVersion, word: j.word, mode: j.mode,
    primary: normBlock(p), frontier: (Array.isArray(f) ? f.map(normBlock) : []),
    signals: j.signals || []
  } as EngineResult;
}

export async function analyzeWordAction(formData: FormData | { word:string; mode:"strict"|"open" }) {
  const word = (formData instanceof FormData ? String(formData.get("word")||"") : formData.word).trim();
  const mode = (formData instanceof FormData ? (String(formData.get("mode")||"strict") as "strict"|"open") : formData.mode) ?? "strict";
  
  const wordSchema = z.string()
    .trim()
    .min(1, { message: "Word is required." })
    .max(48, { message: "Word must be 48 characters or less." })
    .regex(/^[a-zë-]+$/i, { message: "Word can only contain letters and hyphens." });

  const validatedWord = wordSchema.safeParse(word);

  if (!validatedWord.success) {
      return { ok:false, error: validatedWord.error.errors.map(e => e.message).join(', ') } as const;
  }

  // AI mapping is now separate, so we only handle analysis here.
  try {
    const analysisResult = await (async () => {
      // This is a temporary solution to fetch from the API route.
      // In a real scenario, you might call the solver directly
      // or use a more robust service layer.
      const res = await fetch(`http://localhost:9002/api/analyzeSevenVoices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word, mode }),
      });
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Analysis failed');
      }
      return await res.json();
    })();

    const normalizedData = normalizePayload(analysisResult);
    
    // The AI mapping is a separate concern, we can add it back later if needed
    // For now, we focus on the analysis result.
    const mappingResult = await mapWordToLanguageFamilies({
        word: normalizedData.word,
        voice_path: normalizedData.primary.voice_path,
        ring_path: normalizedData.primary.ring_path,
        level_path: normalizedData.primary.level_path,
        ops: normalizedData.primary.ops,
        signals: normalizedData.signals
    });

    return { 
      ok: true, 
      data: {
        analysis: normalizedData,
        languageFamilies: mappingResult?.candidates_map || null
      }
    } as const;

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { ok: false, error: errorMessage } as const;
  }
}


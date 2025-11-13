
'use server';

import { solveMatrix, type Analysis, type SolveMode } from '@/lib/solver';
import { mapWordToLanguageFamilies } from '@/ai/flows/map-word-to-language-families';
import { z } from 'zod';

export type AnalysisState = {
  analysis: Analysis | null;
  languageFamilies: string[] | null;
  error?: string;
};

const schema = z.object({
    word: z.string().min(1, { message: "Word is required." }).max(48, { message: "Word cannot be longer than 48 characters." }),
    mode: z.enum(['strict', 'open']),
});

export async function analyzeWordAction(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  
  const validatedFields = schema.safeParse({
    word: formData.get('word'),
    mode: formData.get('mode') ?? 'strict',
  });
  
  if (!validatedFields.success) {
    return { 
        analysis: null, 
        languageFamilies: null, 
        error: validatedFields.error.errors.map((e) => e.message).join(', ') 
    };
  }
  
  const { word, mode } = validatedFields.data;

  try {
    const analysisResult = solveMatrix(word, mode);

    const primaryPath = analysisResult.primaryPath;
    
    // The AI flow is optional, but we'll run it as it's a core feature.
    // We can add a flag to disable it if needed.
    const mappingInput = {
      word: analysisResult.word,
      voice_path: primaryPath.voicePath,
      ring_path: primaryPath.ringPath,
      level_path: primaryPath.levelPath,
      ops: primaryPath.ops,
      signals: analysisResult.signals,
    };

    let languageFamilies: string[] = [];
    try {
        const mappingResult = await mapWordToLanguageFamilies(mappingInput);
        if (mappingResult.candidates_map) {
            languageFamilies = Object.keys(mappingResult.candidates_map);
        }
    } catch(aiError) {
        console.warn("AI mapping failed, returning analysis without language families.", aiError);
        // Not treating AI failure as a hard error for the user,
        // just returning the deterministic solver results.
    }


    return {
      analysis: analysisResult,
      languageFamilies,
      error: undefined,
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
    return {
      analysis: null,
      languageFamilies: null,
      error: errorMessage,
    };
  }
}

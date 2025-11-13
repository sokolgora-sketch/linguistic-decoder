
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix, type Analysis } from '@/lib/solver';
import { mapWordToLanguageFamilies } from '@/ai/flows/map-word-to-language-families';
import { z } from 'zod';

const schema = z.object({
  word: z.string().min(1, { message: "Word is required." }).max(48, { message: "Word cannot be longer than 48 characters." }),
  mode: z.enum(['strict', 'open']).default('strict'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("analyzeSevenVoices in:", body);
    const validatedFields = schema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        error: validatedFields.error.errors.map((e) => e.message).join(', ') 
      }, { status: 400 });
    }

    const { word, mode } = validatedFields.data;
    
    const analysisResult = solveMatrix(word, mode);
    const primaryPath = analysisResult.primaryPath;
    
    const mappingInput = {
      word: analysisResult.word,
      voice_path: primaryPath.voicePath,
      ring_path: primaryPath.ringPath,
      level_path: primaryPath.levelPath,
      ops: primaryPath.ops,
      signals: analysisResult.signals,
    };
    
    let languageFamilies: string[] = [];
    let mappingResultData = null;

    try {
      const mappingResult = await mapWordToLanguageFamilies(mappingInput);
      if (mappingResult.candidates_map) {
        languageFamilies = Object.keys(mappingResult.candidates_map);
        mappingResultData = mappingResult;
      }
    } catch(aiError) {
      console.warn("AI mapping failed, proceeding without language families.", aiError);
      // Not a hard error, we can return the analysis without it.
    }
    
    const response = {
      analysis: analysisResult,
      languageFamilies,
      aiMapping: mappingResultData
    };

    return NextResponse.json(response);

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (errorMessage.includes("Solver failed")) {
        return NextResponse.json({ error: errorMessage }, { status: 422 });
    }

    if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

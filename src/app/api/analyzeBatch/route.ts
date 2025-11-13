
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix, type SolveMode } from '@/lib/solver';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { words = [], mode = "strict" } = body;

    if (!Array.isArray(words)) {
        return NextResponse.json({ error: "'words' must be an array of strings." }, { status: 400 });
    }

    const results = words.map((word: string) => {
        if (typeof word !== 'string' || word.trim() === '') {
            return { w: word, error: 'Invalid word entry.' };
        }
        try {
            // The result 'r' from solveMatrix is what we want.
            const analysisResult = solveMatrix(word, mode as SolveMode);
            return { w: word, r: analysisResult };
        } catch (e: any) {
            return { w: word, error: e.message || 'Solver failed.' };
        }
    });
    
    return NextResponse.json(results);

  } catch (e) {
    console.error("Error in batch analyze route:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

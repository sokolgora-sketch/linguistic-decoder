
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix } from '@/lib/solver';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, mode } = body;
    
    if (!word || typeof word !== 'string' || word.trim() === '') {
        return NextResponse.json({ error: "The 'word' field is required and cannot be empty." }, { status: 400 });
    }
    
    const analysisResult = solveMatrix(word, mode);
    
    return NextResponse.json(analysisResult);

  } catch (e) {
    console.error("Error in API route:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

    
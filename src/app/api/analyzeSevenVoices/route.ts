
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix } from '@/lib/solver';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, mode } = body;
    
    if (!word || typeof word !== 'string' || word.trim() === '') {
        return NextResponse.json({ error: "The 'word' field is required and cannot be empty." }, { status: 400 });
    }
    
    // The user's instructions imply a fallback for local development is needed.
    // However, since we cannot know the user's project ID, we'll rely on FUNCTION_BASE_URL
    // and guide the user to set it up for local dev.
    if (!process.env.FUNCTION_BASE_URL) {
      // In a real local dev setup, you might fallback to a hardcoded emulator URL,
      // but that requires knowing the project ID. A clear error is better.
      const errorMessage = "FUNCTION_BASE_URL is not set. Please set it in your .env file. For local development, this typically looks like 'http://127.0.0.1:5001/your-project-id/us-central1'.";
      console.error(errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
    
    const functionUrl = `${process.env.FUNCTION_BASE_URL}/analyzeSevenVoices`;
    console.log("Proxying to function URL:", functionUrl);

    const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            word: String(word || "").trim(), 
            mode: mode || "strict" 
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Function call failed:", response.status, data);
        return NextResponse.json({ error: data.error || `Function call failed with status: ${response.status}` }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (e) {
    console.error("Error in API proxy route:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

    
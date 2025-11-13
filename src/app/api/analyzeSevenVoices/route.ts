
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { word, mode } = await request.json();
    console.log("analyzeSevenVoices proxy in:", { word, mode });

    if (!process.env.FUNCTION_BASE_URL) {
      throw new Error("FUNCTION_BASE_URL is not set in the environment.");
    }
    
    const functionUrl = `${process.env.FUNCTION_BASE_URL}/analyzeSevenVoices`;

    const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            word: String(word || "").trim(), 
            mode: mode || "strict" 
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Function call failed:", errorBody);
        return NextResponse.json({ error: `Function call failed with status: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
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

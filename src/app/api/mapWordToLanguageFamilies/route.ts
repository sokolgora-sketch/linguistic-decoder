
import { NextResponse, type NextRequest } from 'next/server';
import { mapWordToLanguageFamilies } from '@/ai/flows/map-word-to-language-families';
import { MapWordToLanguageFamiliesInput } from '@/ai/flows/map-word-to-language-families';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MapWordToLanguageFamiliesInput;
    const result = await mapWordToLanguageFamilies(body);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Error in API route:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

    
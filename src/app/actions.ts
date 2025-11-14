
'use server';

import { z } from 'zod';
import type { Alphabet } from '@/lib/solver/engineConfig';

// This file is now simplified. The primary logic has moved to the API route
// and the client-side fetcher (`analyzeClient.ts`).
// We keep this action file in case we need other server-side mutations later.

export async function analyzeWordAction(formData: FormData | { word:string; mode:"strict"|"open", alphabet: Alphabet }) {
  const word = (formData instanceof FormData ? String(formData.get("word")||"") : formData.word).trim();
  const mode = (formData instanceof FormData ? (String(formData.get("mode")||"strict") as "strict"|"open") : formData.mode) ?? "strict";
  const alphabet = (formData instanceof FormData ? (String(formData.get("alphabet")||"auto") as Alphabet) : formData.alphabet) ?? "auto";

  const wordSchema = z.string()
    .trim()
    .min(1, { message: "Word is required." })
    .max(48, { message: "Word must be 48 characters or less." })
    .regex(/^[a-zë*-₁₂₃ḱǵ-]*$/i, { message: "Word can only contain letters, hyphens, and special phonetic characters." });


  const validatedWord = wordSchema.safeParse(word);

  if (!validatedWord.success) {
      return { ok:false, error: validatedWord.error.errors.map(e => e.message).join(', ') } as const;
  }

  try {
    // The client now calls the API route directly.
    // This function can still be used for form submissions if needed,
    // but the main analysis flow is handled by the API.
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/analyzeSevenVoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, mode, alphabet }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Analysis failed');
    }
    const analysisResult = await res.json();

    // The client (`analyzeClient.ts`) is now responsible for calling the Gemini flow.
    // This keeps the action simple and focused.

    return { 
      ok: true, 
      data: { analysis: analysisResult }
    } as const;

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { ok: false, error: errorMessage } as const;
  }
}

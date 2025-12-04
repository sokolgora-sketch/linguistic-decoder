import { NextRequest, NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";

export async function POST(req: NextRequest) {
  const { word, mode = "strict", alphabet = "auto" } = await req.json();

  const result = await analyzeWord(word, { mode, alphabet });

  return NextResponse.json(result);
}

// src/shared/fetchWordClient.ts
"use client";

import type { AnalysisResult } from "./analysisAdapter";

export type ClientMode = "strict" | "relaxed";

export async function fetchWordClient(
  word: string,
  opts: { mode: ClientMode; coreOnly: boolean }
): Promise<AnalysisResult> {
  const params = new URLSearchParams();
  params.set("word", word.trim());
  params.set("mode", opts.mode);
  params.set("coreOnly", opts.coreOnly ? "1" : "0");

  const res = await fetch(`/api/analyze?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`analyze failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as AnalysisResult;
}

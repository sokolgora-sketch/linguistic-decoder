'use client';

import type { AnalysisResult_DEPRECATED } from "./analysisAdapter";
import { enginePayloadToAnalysisResult } from "./analysisAdapter";

export type ClientMode = "strict" | "relaxed";

export async function fetchWordClient(
  word: string,
  opts: { mode: ClientMode; coreOnly: boolean }
): Promise<AnalysisResult_DEPRECATED> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: word.trim(),
      mode: opts.mode,
    }),
  });

  if (!res.ok) {
    throw new Error(`analyze failed: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();
  return enginePayloadToAnalysisResult(raw);
}

// src/lib/historyStore.ts
// Central hook for logging analysis runs.

import { saveHistoryRecord, type HistoryRecord } from "./historyFirestore";
import type { EnginePayload } from "@/shared/engineShape";

export interface HistoryRunInput {
  word: string;
  engineVersion: string;
  mode: string;
  alphabet: string;
  result: unknown;
}

/**
 * Main hook. Engine calls this after every successful run.
 * It must NEVER throw – failures are swallowed internally.
 */
export async function recordHistoryRun(input: HistoryRunInput): Promise<void> {
  // Guard: history off by default; flip when we actually wire Firestore.
  if (process.env.NEXT_PUBLIC_HISTORY_ENABLED !== "1") {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        "[history] disabled; would record:",
        input.word,
        input.engineVersion,
        input.mode,
        input.alphabet
      );
    }
    return;
  }

  const run = {
    word: input.word,
    engineVersion: input.engineVersion,
    mode: input.mode,
    alphabet: input.alphabet,
    heartSummaryText: extractHeartSummary(input.result as EnginePayload),
    createdAt: Date.now(),
  };

  syncHistoryToFirestore(run).catch(console.error);
}

function extractHeartSummary(payload: EnginePayload): string | undefined {
  if (!payload?.primaryPath?.voicePath) return;
  return payload.primaryPath.voicePath.map((v) => v.symbol).join("");
}

export async function syncHistoryToFirestore(run: any) {
  await saveHistoryRecord({
    word: run.word,
    mode: run.mode || "strict",
    alphabet: run.alphabet || "auto",
    engineVersion: run.engineVersion || "unknown",
    heartSummary: run.heartSummaryText || "",
    createdAt: Date.now(),
  });
}

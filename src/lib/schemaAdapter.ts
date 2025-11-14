
// src/lib/schemaAdapter.ts
import type { Path, Analysis } from "./solver/types";

export type MappingRecord = {
  word: string;
  voice_path: string[];   // required by your schema
  ring_path: number[];    // required
  level_path: number[];   // required
  ops: string[];          // required
  signals?: string[];     // optional
};

export function toMappingRecord(e: Analysis): MappingRecord {
  if (!e?.primaryPath?.voicePath?.length) {
    throw new Error("No primaryPath.voicePath in engine payload");
  }
  return {
    word: e.word,
    voice_path: e.primaryPath.voicePath,
    ring_path: e.primaryPath.ringPath,
    level_path: e.primaryPath.levelPath,
    ops: e.primaryPath.ops ?? [],
    signals: [
      `engine=${e.engineVersion}`,
      `alphabet=${e.alphabet}`,
      ...(e.signals ?? []),
    ],
  };
}

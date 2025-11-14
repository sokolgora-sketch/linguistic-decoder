
// src/lib/schemaAdapter.ts
import type { EnginePayload } from "@/shared/engineShape";

export type MappingRecord = {
  word: string;
  voice_path: string[];
  ring_path: number[];
  level_path: number[];
  ops: string[];
  signals?: string[];
};

export function toMappingRecord(e: EnginePayload): MappingRecord {
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

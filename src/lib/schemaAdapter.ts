// src/lib/schemaAdapter.ts
type Vowel = 'A'|'E'|'I'|'O'|'U'|'Y'|'Ë';

export type EnginePayload = {
  word: string;
  engineVersion: string;
  mode: 'strict'|'open';
  alphabet: string;
  primary: {
    voicePath: Vowel[];
    ringPath: number[];
    levelPath: number[];
    ops?: string[];
  };
  signals?: string[];
};

export type MappingRecord = {
  word: string;
  voice_path: string[];   // required by your schema
  ring_path: number[];    // required
  level_path: number[];   // required
  ops: string[];          // required
  signals?: string[];     // optional
};

export function toMappingRecord(e: EnginePayload): MappingRecord {
  if (!e?.primary?.voicePath?.length) {
    throw new Error("No primary.voicePath in engine payload");
  }
  return {
    word: e.word,
    voice_path: e.primary.voicePath,   // flatten & rename
    ring_path: e.primary.ringPath,
    level_path: e.primary.levelPath,
    ops: e.primary.ops ?? [],
    signals: [
      `engine=${e.engineVersion}`,
      `alphabet=${e.alphabet}`,
      ...(e.signals ?? []),
    ],
  };
}

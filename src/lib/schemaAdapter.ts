
// src/lib/schemaAdapter.ts
type Vowel = 'A'|'E'|'I'|'O'|'U'|'Y'|'Ë';

export type EnginePayload = {
  word: string;
  engineVersion: string;
  mode: 'strict'|'open';
  alphabet: string;
  primary: {
    voice_path: Vowel[];
    ring_path: number[];
    level_path: number[];
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
  if (!e?.primary?.voice_path?.length) {
    throw new Error("No primary.voice_path in engine payload");
  }
  return {
    word: e.word,
    voice_path: e.primary.voice_path,
    ring_path: e.primary.ring_path,
    level_path: e.primary.level_path,
    ops: e.primary.ops ?? [],
    signals: [
      `engine=${e.engineVersion}`,
      `alphabet=${e.alphabet}`,
      ...(e.signals ?? []),
    ],
  };
}

    
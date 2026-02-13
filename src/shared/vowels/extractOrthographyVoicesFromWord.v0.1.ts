// src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts
/**
 * Universal Vowel Mapper v0.1 (Orthography → 7 Voices)
 * - This is the ONLY public SSOT for written-word vowel extraction.
 * - Internally delegates to mapVowels v0.2, but normalizes the output shape.
 * - Deterministic, no I/O, no network.
 */

import type { VowelVoice } from "./vowelVoices.v0.1";
import { mapVowelsV0_2 } from "./mapVowels.v0.2";

const VOICES: readonly VowelVoice[] = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

function isVoice(x: unknown): x is VowelVoice {
  return typeof x === "string" && (VOICES as readonly string[]).includes(x);
}

function asRecord(x: unknown): Record<string, unknown> {
  return x && typeof x === "object" ? (x as Record<string, unknown>) : {};
}

function safeStringList(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  const out: string[] = [];
  for (const it of x) out.push(String(it));
  return out;
}

function safeVoiceList(x: unknown): VowelVoice[] {
  if (!Array.isArray(x)) return [];
  const out: VowelVoice[] = [];
  for (const it of x) {
    const s = typeof it === "string" ? it : String(it);
    if (isVoice(s)) out.push(s);
  }
  return out;
}

export type OrthographyTraceTokenV0_1 = {
  kind: "vowel" | "other";
  raw: string;
  voice?: VowelVoice;
  note?: string;
};

function safeTokens(x: unknown): OrthographyTraceTokenV0_1[] {
  if (!Array.isArray(x)) return [];
  const out: OrthographyTraceTokenV0_1[] = [];
  for (const it of x) {
    const r = asRecord(it);
    const kindRaw = String(r.kind ?? "");
    const kind: "vowel" | "other" = kindRaw === "vowel" ? "vowel" : "other";
    const raw = String(r.raw ?? r.ch ?? r.char ?? "");
    const voiceMaybe = r.voice ?? r.vowel ?? r.v;
    const voice = isVoice(voiceMaybe) ? (voiceMaybe as VowelVoice) : undefined;
    const note = r.note != null ? String(r.note) : undefined;

    out.push({ kind, raw, voice, note });
  }
  return out;
}

function pickVoices(result: unknown): VowelVoice[] {
  const r = asRecord(result);
  return safeVoiceList(
    r["voices"] ??
      r["vowels"] ??
      r["vowelVoices"] ??
      r["voiceSeq"] ??
      r["voiceSequence"] ??
      r["path"] ??
      r["vowelPath"]
  );
}

function pickUnmapped(result: unknown): string[] {
  const r = asRecord(result);
  const diag = asRecord(r["diagnostics"]);
  const xs = safeStringList(
    r["unmapped"] ??
      r["unmappedChars"] ??
      r["unmappedSymbols"] ??
      r["unknown"] ??
      r["unrecognized"] ??
      diag["unmapped"] ??
      diag["unmappedChars"]
  );
  // stable + deterministic: de-dupe + sort
  return Array.from(new Set(xs)).sort();
}

function pickTokens(result: unknown): OrthographyTraceTokenV0_1[] {
  const r = asRecord(result);
  return safeTokens(r["tokens"] ?? r["traceTokens"] ?? r["spans"] ?? r["segments"] ?? []);
}

export type OrthographyVoicesFromWordV0_1 = {
  word: string;
  voices: VowelVoice[];
  tokens: OrthographyTraceTokenV0_1[];
  diagnostics: {
    unmapped: string[];
    notes?: string[];
  };
};

export function extractOrthographyVoicesFromWordV0_1(input: {
  word: string;
  langHint?: string | null;
}): OrthographyVoicesFromWordV0_1 {
  const word = String(input.word ?? "").trim();

  const notes: string[] = [];
  let out: unknown;

  try {
    out = mapVowelsV0_2({ word, langHint: input.langHint ?? undefined });
  } catch (e) {
    notes.push(`orthography_mapper_threw:${String(e)}`);
    out = null;
  }

  const voices = pickVoices(out);
  const tokens = pickTokens(out);
  const unmapped = pickUnmapped(out);

  return {
    word,
    voices,
    tokens,
    diagnostics: {
      unmapped,
      notes: notes.length ? notes : undefined,
    },
  };
}

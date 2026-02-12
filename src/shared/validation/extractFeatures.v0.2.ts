import { mapVowelsV0_2 } from "../vowels/mapVowels.v0.2";
import { parseIpaVowelsV0_2 } from "../vowels/parseIpaVowels.v0.2";
import type { VowelVoice } from "../vowels/vowelVoices.v0.1";

export type ExtractFeaturesInputV01 = {
  word: string;
  lang: string;
  ipa?: string;
};

export type ExtractFeaturesOutputV01 = {
  orthographyVoices: VowelVoice[];
  phoneticVoices?: VowelVoice[];
  maskCarrierMismatch: boolean;

  orthographyVoiceCount: number;
  phoneticVoiceCount?: number;

  // v0.1: only include if already stable elsewhere; keep undefined for now.
  math7?: { total?: number; path?: number[] };

  diagnostics: {
    orthographyUnmapped: string[];
    ipaUnmapped?: string[];
    notes?: string[];
  };
};

const VOICES: readonly VowelVoice[] = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

function isVoice(x: unknown): x is VowelVoice {
  return typeof x === "string" && (VOICES as readonly string[]).includes(x);
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

function asRecord(x: unknown): Record<string, unknown> {
  return x && typeof x === "object" ? (x as Record<string, unknown>) : {};
}

// tolerate different SSOT return shapes without `any`
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
  return safeStringList(
    r["unmapped"] ??
      r["unmappedChars"] ??
      r["unmappedSymbols"] ??
      r["unknown"] ??
      r["unrecognized"] ??
      diag["unmapped"] ??
      diag["unmappedChars"]
  );
}

function seqEqual(a: readonly VowelVoice[], b: readonly VowelVoice[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function extractFeaturesV0_1(input: ExtractFeaturesInputV01): ExtractFeaturesOutputV01 {
  const notes: string[] = [];

  // --- orthography rail (SSOT)
  let orthoVoices: VowelVoice[] = [];
  let orthoUnmapped: string[] = [];
  try {
    const out = mapVowelsV0_2({ word: String(input.word ?? "") });
    orthoVoices = pickVoices(out);
    orthoUnmapped = pickUnmapped(out);
  } catch (e) {
    notes.push(`orthography_mapper_threw:${String(e)}`);
    orthoVoices = [];
    orthoUnmapped = [];
  }

  // --- phonetic rail (SSOT) if IPA is provided
  let ipaVoices: VowelVoice[] | undefined;
  let ipaUnmapped: string[] | undefined;
  if (typeof input.ipa === "string" && input.ipa.trim().length) {
    try {
      const out = parseIpaVowelsV0_2(input.ipa);
      ipaVoices = pickVoices(out);
      ipaUnmapped = pickUnmapped(out);
    } catch (e) {
      notes.push(`ipa_parser_threw:${String(e)}`);
      ipaVoices = [];
      ipaUnmapped = [];
    }
  }

  const maskCarrierMismatch = Array.isArray(ipaVoices) && !seqEqual(orthoVoices, ipaVoices);

  return {
    orthographyVoices: orthoVoices,
    phoneticVoices: ipaVoices,
    maskCarrierMismatch,

    orthographyVoiceCount: orthoVoices.length,
    phoneticVoiceCount: ipaVoices ? ipaVoices.length : undefined,

    diagnostics: {
      orthographyUnmapped: orthoUnmapped,
      ipaUnmapped,
      notes: notes.length ? notes : undefined,
    },
  };
}

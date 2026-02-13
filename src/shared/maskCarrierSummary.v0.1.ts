// src/shared/maskCarrierSummary.v0.1.ts
/**
 * Mask vs Carrier summary (v0.1)
 * - Mask = orthography SSOT (mapVowels v0.2)
 * - Carrier = IPA carrier SSOT (extractCarrierVoicesFromIpa v0.1), if provided
 * - Deterministic, no I/O, no network.
 */

import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import type { CarrierTraceTokenV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import { mapVowelsV0_2 } from "@/shared/vowels/mapVowels.v0.2";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import { VOWEL_INDEX, totalMod7FromSum0to6 } from "@/shared/math7.core";

const VOICES: readonly VowelVoice[] = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

function isVoice(x: unknown): x is VowelVoice {
  return typeof x === "string" && (VOICES as readonly string[]).includes(x);
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

function safeStringList(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  const out: string[] = [];
  for (const it of x) out.push(String(it));
  return out;
}

function asRecord(x: unknown): Record<string, unknown> {
  return x && typeof x === "object" ? (x as Record<string, unknown>) : {};
}

function pickBool(x: unknown): boolean | undefined {
  return typeof x === "boolean" ? x : undefined;
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

function pickCarrierFlags(result: unknown): {
  noCarrier?: boolean;
  usedImplicit?: boolean;
  usedSyllabic?: boolean;
} {
  const r = asRecord(result);
  const diag = asRecord(r["diagnostics"]);
  return {
    noCarrier: pickBool(diag["noCarrier"]),
    usedImplicit: pickBool(diag["usedImplicit"]),
    usedSyllabic: pickBool(diag["usedSyllabic"]),
  };
}

function pickTraceTokens(result: unknown): CarrierTraceTokenV0_1[] {
  const r = asRecord(result);
  const xs = r["traceTokens"];
  if (!Array.isArray(xs)) return [];

  const out: CarrierTraceTokenV0_1[] = [];
  for (const it of xs) {
    const t = asRecord(it);
    const kind = String(t["kind"] ?? "");
    const raw = String(t["raw"] ?? "");
    const note = String(t["note"] ?? "");
    const voiceRaw = t["voice"];
    const voice = typeof voiceRaw === "string" ? voiceRaw : String(voiceRaw ?? "");

    if ((kind === "vowel" || kind === "syllabic" || kind === "implicit") && isVoice(voice)) {
      out.push({ kind, raw, voice, note } as CarrierTraceTokenV0_1);
    }
  }
  return out;
}

function sumIndex(voices: readonly VowelVoice[]): number {
  let sum = 0;
  for (const v of voices) sum += (VOWEL_INDEX as any)[v] ?? 0;
  return sum;
}

function mod7Total(voices: readonly VowelVoice[]): number {
  return totalMod7FromSum0to6(sumIndex(voices));
}

function levenshteinVoices(a: readonly VowelVoice[], b: readonly VowelVoice[]): number {
  const n = a.length;
  const m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;

  const dp = new Array<number>(m + 1);
  for (let j = 0; j <= m; j++) dp[j] = j;

  for (let i = 1; i <= n; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= m; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[m];
}

export type MaskCarrierSummaryV0_1 = {
  word: string;
  mask: { voices: VowelVoice[]; totalMod7: number; unmapped: string[] };
  carrier?: {
    ipa: string;
    voices: VowelVoice[];
    totalMod7: number;
    unmapped: string[];
    noCarrier?: boolean;
    usedImplicit?: boolean;
    usedSyllabic?: boolean;
    traceTokens?: CarrierTraceTokenV0_1[];
  };
  distance?: number;
  mismatch?: boolean;
};

export function buildMaskCarrierSummaryV0_1(input: { word: string; ipa?: string | null }): MaskCarrierSummaryV0_1 {
  const word = String(input.word ?? "").trim();

  const maskOut = mapVowelsV0_2({ word });
  const maskVoices = pickVoices(maskOut);
  const maskUnmapped = pickUnmapped(maskOut);

  const mask = {
    voices: maskVoices,
    totalMod7: mod7Total(maskVoices),
    unmapped: maskUnmapped,
  };

  const ipaRaw = typeof input.ipa === "string" ? input.ipa.trim() : "";
  if (!ipaRaw) return { word, mask };

  const carrierOut = extractCarrierVoicesFromIpaV0_1(ipaRaw);
  const carrierVoices = pickVoices(carrierOut);
  const carrierUnmapped = pickUnmapped(carrierOut);
  const flags = pickCarrierFlags(carrierOut);
  const trace = pickTraceTokens(carrierOut);

  const carrier = {
    ipa: ipaRaw,
    voices: carrierVoices,
    totalMod7: mod7Total(carrierVoices),
    unmapped: carrierUnmapped,
    ...flags,
    traceTokens: trace.length ? trace : undefined,
  };

  const distance = levenshteinVoices(maskVoices, carrierVoices);
  const mismatch = maskVoices.length !== carrierVoices.length || distance !== 0;

  return { word, mask, carrier, distance, mismatch };
}

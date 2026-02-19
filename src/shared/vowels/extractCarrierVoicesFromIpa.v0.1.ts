// Carrier Law Gate v0.1 — extract carrier nuclei (Seven Voices) from IPA.
// Deterministic, no LLM.
//
// Rules:
// R1: explicit IPA vowels -> Seven Voices (reuse parseIpaVowels v0.2)
// R2: syllabic sonorants (… + U+0329) -> Ë
// R3: final cluster: ...Obstruent + Sonorant (no syllabic mark) -> inject implicit Ë before final sonorant
//     Guards:
//       - Only inject if we already observed at least one explicit vowel earlier (prevents /str/ false carrier)
//       - Do NOT inject if the immediate previous base is a vowel (prevents /rɪðəm/ double Ë)
// R4: if still no carriers -> noCarrier=true

import type { VowelVoice } from "./vowelVoices.v0.1";
import { parseIpaVowelsV0_2 } from "./parseIpaVowels.v0.2";
import { normalizeIpaV0_1 } from "../ipa/ipaNormalize.v0.1";
import { classifyIpaBaseV0_1, SYLLABIC_MARK_V0_1 } from "../ipa/ipaClassify.v0.1";

export type CarrierTraceTokenV0_1 = {
  kind: "vowel" | "syllabic" | "implicit";
  raw: string;
  voice: VowelVoice;
  note: string;
};

export type CarrierVoicesFromIpaV0_1 = {
  voices: VowelVoice[];
  tokens: Array<{ raw: string; norm: string; voice: VowelVoice | null; note?: string }>;
  traceTokens: CarrierTraceTokenV0_1[];
  diagnostics: {
    unmapped: string[];
    noCarrier: boolean;
    usedImplicit: boolean;
    usedSyllabic: boolean;
  };
};

function isCombiningMark(ch: string): boolean {
  return /\p{M}/u.test(ch);
}

function isSkippable(ch: string): boolean {
  return !ch || isCombiningMark(ch);
}

function lastNonSkip(arr: string[]): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!isSkippable(arr[i])) return i;
  }
  return -1;
}

function prevNonSkip(arr: string[], from: number): number {
  for (let i = from; i >= 0; i--) {
    if (!isSkippable(arr[i])) return i;
  }
  return -1;
}

function isVowelAtIndexFromParseTokens(
  tokens: Array<{ voice: VowelVoice | null }>,
  idx: number
): boolean {
  const t = tokens[idx];
  return !!(t && t.voice);
}

function baseClass(ch: string) {
  return classifyIpaBaseV0_1((ch || "").normalize("NFC"));
}

export function extractCarrierVoicesFromIpaV0_1(ipa: unknown): CarrierVoicesFromIpaV0_1 {
  const s = normalizeIpaV0_1(ipa);
  const arr = Array.from(s);

  const base = parseIpaVowelsV0_2(s);
  const baseTokens = Array.isArray((base as any)?.tokens) ? (base as any).tokens : [];
  const baseUnmapped = Array.isArray((base as any)?.diagnostics?.unmapped)
    ? (base as any).diagnostics.unmapped
    : [];

  const events: Array<{ pos: number; token: CarrierTraceTokenV0_1 }> = [];

  // R1 explicit vowels
  for (let i = 0; i < baseTokens.length; i++) {
    const t = baseTokens[i];
    if (t && t.voice) {
      events.push({
        pos: i,
        token: {
          kind: "vowel",
          raw: String(t.raw ?? ""),
          voice: t.voice as VowelVoice,
          note: "explicit vowel (parseIpaVowels v0.2)",
        },
      });
    }
  }

  // R2 syllabic sonorants => Ë (SSOT)
  let usedSyllabic = false;
  for (let i = 0; i < arr.length - 1; i++) {
    const ch = arr[i];
    const next = arr[i + 1];
    if (next === SYLLABIC_MARK_V0_1 && baseClass(ch) === "sonorant") {
      usedSyllabic = true;
      events.push({
        pos: i + 0.01,
        token: { kind: "syllabic", raw: ch + next, voice: "Ë", note: `syllabic ${ch}${next} => Ë` },
      });
      i++;
    }
  }

  // R3 final obstruent + sonorant injection (SSOT)
  let usedImplicit = false;
  const hasExplicit = events.some((e) => e.token.kind === "vowel");
  const j = lastNonSkip(arr);

  if (hasExplicit && j >= 0) {
    const lastCh = arr[j] || "";
    const hasSyllabicMark = arr[j + 1] === SYLLABIC_MARK_V0_1;

    if (baseClass(lastCh) === "sonorant" && !hasSyllabicMark) {
      const k = prevNonSkip(arr, j - 1);
      if (k >= 0) {
        const prevCh = arr[k] || "";

        const prevIsVowelBase = baseClass(prevCh) === "vowel";
        const prevIsObstruentBase = baseClass(prevCh) === "obstruent";
        const prevMappedAsVowel = isVowelAtIndexFromParseTokens(baseTokens, k);

        if (!prevIsVowelBase && prevIsObstruentBase && !prevMappedAsVowel) {
          usedImplicit = true;
          events.push({
            pos: j - 0.25,
            token: {
              kind: "implicit",
              raw: "∅",
              voice: "Ë",
              note: `implicit Ë injected before final ${lastCh} (carrier nucleus reconstruction)`,
            },
          });
        }
      }
    }
  }

  events.sort((a, b) => a.pos - b.pos);

  const traceTokens = events.map((e) => e.token);
  const voices = traceTokens.map((t) => t.voice);

  return {
    voices,
    tokens: baseTokens,
    traceTokens,
    diagnostics: {
      unmapped: baseUnmapped,
      noCarrier: voices.length === 0,
      usedImplicit,
      usedSyllabic,
    },
  };
}

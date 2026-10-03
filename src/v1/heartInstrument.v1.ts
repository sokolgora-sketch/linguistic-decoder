/**
 * Heart Instrument v1 — public builder
 * Authority chain:
 * basis -> surfaceVowels -> values1to7 -> principlesPath + math7
 */

import {
  normalizeBasis,
  extractSevenVowels,
  computeMath7,
  value1to7,
} from "./math7.core.v1";

import { principlesPathFromVowels } from "./principles.core.v1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import { resolveCmuDictPronunciationToVoiceV0_1 } from "@/shared/openInstrument/pronunciationToVoice.v0_1";
import type {
  PronunciationToVoiceResultV0_1,
  PronunciationVoiceVariantResultV0_1,
} from "@/shared/openInstrument/pronunciationToVoice.v0_1";
import {
  deriveZeroConsonantalStructuralCompositionV0_1,
  type ZeroConsonantalStructuralCompositionV0_1,
} from "@/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1";

type HeartPronunciationVariantV0_1 = PronunciationVoiceVariantResultV0_1 &
  Readonly<{
    zeroConsonantalStructuralComposition: ZeroConsonantalStructuralCompositionV0_1 | null;
  }>;

type HeartSpokenPronunciationV0_1 = Omit<
  PronunciationToVoiceResultV0_1,
  "variants"
> &
  Readonly<{
    variants: readonly HeartPronunciationVariantV0_1[];
  }>;

export type HeartInstrumentV1Packet = {
  basisNfc: string;

  // Compatibility surface: spelling-derived vowels remain explicitly
  // orthographic and are not pronunciation authority.
  surfaceVowels: string[];
  orthographicVowels: string[];

  // Canonical spoken authority used by the route's Heart/Math7 projection.
  canonicalSpokenVoicePath: readonly VowelVoice[] | null;
  spokenPronunciation: HeartSpokenPronunciationV0_1;
  spokenPrinciplesPath: string[];
  spokenMath7: ReturnType<typeof computeMath7> | null;

  principlesPath: string[];

  /**
   * Explicit surface totals (derived from *surface* vowels only).
   * This prevents confusion with heart.math7.primary totals, which may be
   * computed from hinted/normalized vowel paths.
   */
  surfaceTotalMod7: number; // 0..6
  surfaceTotal1to7: number; // 1..7

  // what tests currently read
  math7: ReturnType<typeof computeMath7>;

  // optional convenience (safe)
  values1to7: number[];
  surfaceMath7: ReturnType<typeof computeMath7>;
};

export function buildHeartInstrumentV1(basis: string): HeartInstrumentV1Packet {
  const basisNfc = normalizeBasis(basis);

  // strict vowel filter + NFC authority
  const surfaceVowels = extractSevenVowels(basisNfc);

  const pronunciationResult = resolveCmuDictPronunciationToVoiceV0_1(basisNfc);
  const spokenPronunciation: HeartSpokenPronunciationV0_1 = {
    ...pronunciationResult,
    variants: pronunciationResult.variants.map((variant) => ({
      ...variant,
      zeroConsonantalStructuralComposition:
        deriveZeroConsonantalStructuralCompositionV0_1(variant),
    })),
  };
  const canonicalSpokenVoicePath = spokenPronunciation.canonicalSpokenVoicePath;
  const spokenPrinciplesPath = canonicalSpokenVoicePath
    ? principlesPathFromVowels(canonicalSpokenVoicePath as any)
    : [];
  const spokenValues1to7 = canonicalSpokenVoicePath
    ? canonicalSpokenVoicePath.map((v) => value1to7(v as any))
    : [];
  const spokenMath7 = canonicalSpokenVoicePath
    ? computeMath7(spokenValues1to7)
    : null;

  // map vowels -> 1..7 ring values (public doctrine)
  const values1to7Arr = surfaceVowels.map((v) => value1to7(v as any));

  // ordered journey from sequence (melody)
  const principlesPath = principlesPathFromVowels(surfaceVowels as any);

  // checksum/jumps/events from the same numeric values (chord)
  const math7 = computeMath7(values1to7Arr);

  return {
    basisNfc,
    surfaceVowels,
    orthographicVowels: [...surfaceVowels],
    canonicalSpokenVoicePath,
    spokenPronunciation,
    spokenPrinciplesPath,
    spokenMath7,
    principlesPath,

    surfaceTotalMod7: math7.totalMod7,
    surfaceTotal1to7: math7.total1to7,

    math7,

    // convenience aliases
    values1to7: values1to7Arr,
    surfaceMath7: math7,
  };
}

export type HeartInstrumentV1 = ReturnType<typeof buildHeartInstrumentV1>;

// Re-export low-level primitives (useful in tests/callers)
export {
  normalizeBasis,
  extractSevenVowels,
  computeMath7,
  value1to7,
} from "./math7.core.v1";

export { principlesPathFromVowels } from "./principles.core.v1";

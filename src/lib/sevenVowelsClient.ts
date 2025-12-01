// src/lib/sevenVowelsClient.ts
// Thin gateway from UI/engine into the Seven-Vowels core.

import {
  VOWELS,
  type Vowel,
  type VowelIndex,
  type RingIndex,
  indexOf,
  ringOf,
} from "../core/sevenVowelsCore";

import {
  SEVEN_VOWELS_MANIFEST,
  manifestTrait,
  type VowelTrait,
} from "../core/sevenVowelsTraits";

// Re-export core types so the rest of the app can just import from here.
export type { Vowel, VowelIndex, RingIndex, VowelTrait };

export const sevenVowelsClient = {
  VOWELS,
  MANIFEST: SEVEN_VOWELS_MANIFEST,

  traits: SEVEN_VOWELS_MANIFEST.traits,

  indexOf(v: Vowel): VowelIndex {
    return indexOf(v);
  },

  ringOf(v: Vowel): RingIndex {
    return ringOf(v);
  },

  trait(v: Vowel): VowelTrait {
    return manifestTrait(v);
  },
};

// Convenience helper for UI cards later
export function getVowelView(v: Vowel) {
  const trait = manifestTrait(v);
  return {
    symbol: v,
    trait,
  };
}

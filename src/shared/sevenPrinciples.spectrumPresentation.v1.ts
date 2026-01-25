/**
 * Seven Principles Spectrum Presentation v1
 *
 * Purpose:
 * - Single “presentation” source for spectrum chips/cards:
 *   - ring/index/role/polarity/note/color-name from sevenPrinciples.v1 (doctrine)
 *   - hex color + short label from voiceColors.ts (UI paint)
 *
 * Rule:
 * - This file must NOT redefine vowel order/index; it only composes existing canon.
 */

import type { Vowel } from "@/core/sevenVowelsCore";
import {
  SEVEN_PRINCIPLES,
  vowelToIndex1,
  vowelToRingIndex,
  vowelToNote,
  type PrincipleColor,
  type MusicalNote,
  type PrinciplePolarity,
  type PrincipleRing,
  type PrincipleRole,
} from "@/shared/sevenPrinciples.v1";
import { VOICE_COLOR_MAP, VOICE_LABEL_MAP } from "@/shared/voiceColors";

export type SpectrumPresentation = {
  vowel: Vowel;

  // doctrine
  index1: number;          // 1..7
  ringIndex: number;       // 0..3
  ring: PrincipleRing;

  role: PrincipleRole;
  polarity: PrinciplePolarity;

  color: PrincipleColor;   // semantic (red/orange/...)
  note: MusicalNote;       // C D E F G A B

  // UI paint
  hex: string;             // "#EF4444" etc.
  label: string;           // short human label
};

export const SPECTRUM_BY_VOWEL: Record<Vowel, SpectrumPresentation> = {
  A: {
    vowel: "A",
    index1: vowelToIndex1("A"),
    ringIndex: vowelToRingIndex("A"),
    ring: SEVEN_PRINCIPLES.A.ring,
    role: SEVEN_PRINCIPLES.A.role,
    polarity: SEVEN_PRINCIPLES.A.polarity,
    color: SEVEN_PRINCIPLES.A.color,
    note: vowelToNote("A"),
    hex: VOICE_COLOR_MAP.A,
    label: VOICE_LABEL_MAP.A,
  },
  E: {
    vowel: "E",
    index1: vowelToIndex1("E"),
    ringIndex: vowelToRingIndex("E"),
    ring: SEVEN_PRINCIPLES.E.ring,
    role: SEVEN_PRINCIPLES.E.role,
    polarity: SEVEN_PRINCIPLES.E.polarity,
    color: SEVEN_PRINCIPLES.E.color,
    note: vowelToNote("E"),
    hex: VOICE_COLOR_MAP.E,
    label: VOICE_LABEL_MAP.E,
  },
  I: {
    vowel: "I",
    index1: vowelToIndex1("I"),
    ringIndex: vowelToRingIndex("I"),
    ring: SEVEN_PRINCIPLES.I.ring,
    role: SEVEN_PRINCIPLES.I.role,
    polarity: SEVEN_PRINCIPLES.I.polarity,
    color: SEVEN_PRINCIPLES.I.color,
    note: vowelToNote("I"),
    hex: VOICE_COLOR_MAP.I,
    label: VOICE_LABEL_MAP.I,
  },
  O: {
    vowel: "O",
    index1: vowelToIndex1("O"),
    ringIndex: vowelToRingIndex("O"),
    ring: SEVEN_PRINCIPLES.O.ring,
    role: SEVEN_PRINCIPLES.O.role,
    polarity: SEVEN_PRINCIPLES.O.polarity,
    color: SEVEN_PRINCIPLES.O.color,
    note: vowelToNote("O"),
    hex: VOICE_COLOR_MAP.O,
    label: VOICE_LABEL_MAP.O,
  },
  U: {
    vowel: "U",
    index1: vowelToIndex1("U"),
    ringIndex: vowelToRingIndex("U"),
    ring: SEVEN_PRINCIPLES.U.ring,
    role: SEVEN_PRINCIPLES.U.role,
    polarity: SEVEN_PRINCIPLES.U.polarity,
    color: SEVEN_PRINCIPLES.U.color,
    note: vowelToNote("U"),
    hex: VOICE_COLOR_MAP.U,
    label: VOICE_LABEL_MAP.U,
  },
  Y: {
    vowel: "Y",
    index1: vowelToIndex1("Y"),
    ringIndex: vowelToRingIndex("Y"),
    ring: SEVEN_PRINCIPLES.Y.ring,
    role: SEVEN_PRINCIPLES.Y.role,
    polarity: SEVEN_PRINCIPLES.Y.polarity,
    color: SEVEN_PRINCIPLES.Y.color,
    note: vowelToNote("Y"),
    hex: VOICE_COLOR_MAP.Y,
    label: VOICE_LABEL_MAP.Y,
  },
  "Ë": {
    vowel: "Ë",
    index1: vowelToIndex1("Ë"),
    ringIndex: vowelToRingIndex("Ë"),
    ring: SEVEN_PRINCIPLES["Ë"].ring,
    role: SEVEN_PRINCIPLES["Ë"].role,
    polarity: SEVEN_PRINCIPLES["Ë"].polarity,
    color: SEVEN_PRINCIPLES["Ë"].color,
    note: vowelToNote("Ë"),
    hex: VOICE_COLOR_MAP["Ë"],
    label: VOICE_LABEL_MAP["Ë"],
  },
};

export function spectrumPresentationForPath(vowels: Vowel[]) {
  return vowels.map((v) => SPECTRUM_BY_VOWEL[v]);
}

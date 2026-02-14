// src/shared/voiceColors.ts
import type { Vowel } from "./engineShape";
import {
  COLORS_HEX_BY_VOICE_V0_1,
  LABELS_BY_VOICE_V0_1,
} from "./doctrine/voiceDoctrine.v0.1";

/**
 * Back-compat shim.
 * Symbolic SSOT lives in `src/shared/doctrine/voiceDoctrine.v0.1.ts`.
 */

export const VOICE_COLOR_MAP: Record<Vowel, string> =
  COLORS_HEX_BY_VOICE_V0_1 as unknown as Record<Vowel, string>;

export const VOICE_LABEL_MAP: Record<Vowel, string> =
  LABELS_BY_VOICE_V0_1 as unknown as Record<Vowel, string>;

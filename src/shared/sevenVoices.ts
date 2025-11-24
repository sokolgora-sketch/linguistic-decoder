// src/shared/sevenVoices.ts
import type { Vowel, PrincipleName } from "@/shared/engineShape";
import { VOICE_LABEL_MAP } from "@/shared/voiceColors";

export interface VoiceMeta {
  id: Vowel;
  principle: PrincipleName;
  label: string;      // long label like "Truth / Source / Action"
  short: string;      // short label if you want it
}

const META: Record<Vowel, VoiceMeta> = {
  A: {
    id: "A",
    principle: "Truth",
    label: VOICE_LABEL_MAP.A,
    short: "Truth",
  },
  E: {
    id: "E",
    principle: "Expansion",
    label: VOICE_LABEL_MAP.E,
    short: "Expansion",
  },
  I: {
    id: "I",
    principle: "Insight",
    label: VOICE_LABEL_MAP.I,
    short: "Insight",
  },
  O: {
    id: "O",
    principle: "Balance",
    label: VOICE_LABEL_MAP.O,
    short: "Balance",
  },
  U: {
    id: "U",
    principle: "Unity",
    label: VOICE_LABEL_MAP.U,
    short: "Unity",
  },
  Y: {
    id: "Y",
    principle: "Network Integrity",
    label: VOICE_LABEL_MAP.Y,
    short: "Network",
  },
  "Ë": {
    id: "Ë",
    principle: "Evolution",
    label: VOICE_LABEL_MAP["Ë"],
    short: "Evolution",
  },
};

export function getVoiceMeta(v: Vowel): VoiceMeta {
  return META[v];
}

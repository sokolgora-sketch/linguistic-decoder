import type { Vowel } from './engineShape';

export type VoiceLevel = 'High' | 'Mid' | 'Low';

export type VoiceMeta = {
  vowel: Vowel;
  colorHex: string;         // UI colour (rainbow mapping)
  ring: number;             // 3,2,1,0 from engine manifest
  level: VoiceLevel;        // High / Mid / Low
  principle: string;        // e.g. 'Truth', 'Expansion'
  role: 'father' | 'mother' | 'mediator' | 'inner-male' | 'middle-female';
  hzHint: [number, number]; // symbolic band only, not physical acoustics
  keywords: string[];       // short functional keywords for this voice
};

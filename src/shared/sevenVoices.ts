
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

export const SEVEN_VOICES: Record<Vowel, VoiceMeta> = {
  A: {
    vowel: 'A',
    colorHex: '#FF3B30',
    ring: 3,
    level: 'High',
    principle: 'Truth',
    role: 'father',
    hzHint: [110, 220],
    keywords: ['truth', 'start', 'strike', 'iron', 'sun'],
  },
  E: {
    vowel: 'E',
    colorHex: '#FF9500',
    ring: 2,
    level: 'High',
    principle: 'Expansion',
    role: 'middle-female',
    hzHint: [220, 330],
    keywords: ['expansion', 'growth', 'field', 'bridge'],
  },
  I: {
    vowel: 'I',
    colorHex: '#FFCC00',
    ring: 1,
    level: 'High',
    principle: 'Insight',
    role: 'inner-male',
    hzHint: [330, 440],
    keywords: ['insight', 'focus', 'ray', 'eye'],
  },
  O: {
    vowel: 'O',
    colorHex: '#34C759',
    ring: 0,
    level: 'Mid',
    principle: 'Balance',
    role: 'mediator',
    hzHint: [260, 340],
    keywords: ['balance', 'center', 'circle', 'heart'],
  },
  U: {
    vowel: 'U',
    colorHex: '#007AFF',
    ring: 1,
    level: 'Low',
    principle: 'Unity',
    role: 'inner-male',
    hzHint: [110, 220],
    keywords: ['unity', 'breath', 'flow', 'together'],
  },
  Y: {
    vowel: 'Y',
    colorHex: '#5856D6',
    ring: 2,
    level: 'Low',
    principle: 'Network Integrity',
    role: 'middle-female',
    hzHint: [440, 550],
    keywords: ['network', 'weave', 'links', 'integrity'],
  },
  Ë: {
    vowel: 'Ë',
    colorHex: '#AF52DE',
    ring: 3,
    level: 'Low',
    principle: 'Evolution',
    role: 'mother',
    hzHint: [550, 660],
    keywords: ['evolution', 'birth', 'womb', 'change'],
  },
};

export const SEVEN_PRINCIPLES_ORDER: Vowel[] = ['A', 'E', 'I', 'O', 'U', 'Y', 'Ë'];

export const SEVEN_PRINCIPLES_WORDS: string[] = [
  'Truth',
  'Expansion',
  'Insight',
  'Balance',
  'Unity',
  'Network Integrity',
  'Evolution',
];


import type {
  ConsonantArchetype,
  ConsonantField,
  ConsonantSlot,
  ConsonantSummary,
  EnginePayload,
  Vowel,
} from './engineShape';

const ARCHETYPES: ConsonantArchetype[] = [
  'Plosive',
  'Affricate',
  'SibilantFric',
  'NonSibilantFric',
  'Nasal',
  'LiquidGlide',
];

// Preferred Δring ranges per archetype.
const PREFERRED_DELTA: Record<
  ConsonantArchetype,
  { min: number; max: number }
> = {
  Plosive: { min: 2, max: 3 },
  Affricate: { min: 1, max: 2 },
  SibilantFric: { min: 1, max: 2 },
  NonSibilantFric: { min: 1, max: 1 },
  Nasal: { min: 0, max: 1 },
  LiquidGlide: { min: 0, max: 1 },
};

// Map existing window class labels to ConsonantArchetype.
// Adjust mapping to the actual strings used in payload.windowClasses.
const CLASS_TO_ARCHETYPE: Record<string, ConsonantArchetype> = {
  Plosive: 'Plosive',
  Affricate: 'Affricate',
  SibilantFricative: 'SibilantFric',
  NonSibilantFricative: 'NonSibilantFric',
  Nasal: 'Nasal',
  Liquid: 'LiquidGlide',
  Glide: 'LiquidGlide',
};

function makeEmptySlots(): ConsonantSlot[] {
  const vowels: Vowel[] = ['A', 'E', 'I', 'O', 'U', 'Y', 'Ë'];
  const slots: ConsonantSlot[] = [];
  for (const v of vowels) {
    for (const a of ARCHETYPES) {
      slots.push({ vowel: v, archetype: a, smooth: 0, spiky: 0 });
    }
  }
  return slots;
}

function findSlot(
  slots: ConsonantSlot[],
  vowel: Vowel,
  archetype: ConsonantArchetype
): ConsonantSlot | undefined {
  return slots.find(s => s.vowel === vowel && s.archetype === archetype);
}

// Build ConsonantField + a simple summary from an EnginePayload.
export function buildConsonantField(
  payload: EnginePayload
): { field: ConsonantField; summary: ConsonantSummary } {
  const slots = makeEmptySlots();
  let smoothHits = 0;
  let spikyHits = 0;

  const path = payload.primaryPath;
  const windows = payload.windows ?? [];
  const windowClasses = payload.windowClasses ?? [];

  const voicePath = path.voicePath;
  const ringPath = path.ringPath;

  const hopCount = Math.max(
    0,
    Math.min(voicePath.length - 1, windows.length, windowClasses.length)
  );

  for (let i = 0; i < hopCount; i++) {
    const fromVowel = voicePath[i];
    const delta = Math.abs(ringPath[i + 1] - ringPath[i]);

    const cls = windowClasses[i];
    const archetype = CLASS_TO_ARCHETYPE[cls];
    if (!archetype) continue;

    const slot = findSlot(slots, fromVowel, archetype);
    if (!slot) continue;

    const pref = PREFERRED_DELTA[archetype];
    const isSmooth = delta >= pref.min && delta <= pref.max;

    if (isSmooth) {
      slot.smooth++;
      smoothHits++;
    } else {
      slot.spiky++;
      spikyHits++;
    }
  }

  // Edge windows: treat as single spiky hits on first/last vowels.
  const edgeWindows = payload.edgeWindows ?? [];
  if (edgeWindows.length > 0 && voicePath.length > 0) {
    const firstVowel = voicePath[0];
    const lastVowel = voicePath[voicePath.length - 1];

    for (const edge of edgeWindows) {
      // Example strings: "prefix 'd' → Plosive"
      const archetypeKey = Object.keys(CLASS_TO_ARCHETYPE).find(key =>
        edge.includes(key)
      );
      if (!archetypeKey) continue;
      const archetype = CLASS_TO_ARCHETYPE[archetypeKey];

      const isPrefix = edge.toLowerCase().includes('prefix');
      const attachVowel = isPrefix ? firstVowel : lastVowel;

      const slot = findSlot(slots, attachVowel, archetype);
      if (!slot) continue;

      slot.spiky++;
      spikyHits++;
    }
  }

  const total = smoothHits + spikyHits;
  const smoothRatio = total > 0 ? smoothHits / total : 0;

  // Compute dominant archetypes by (smooth - spiky).
  const archetypeScores: Map<ConsonantArchetype, number> = new Map();
  for (const a of ARCHETYPES) archetypeScores.set(a, 0);

  for (const slot of slots) {
    const score = (archetypeScores.get(slot.archetype) ?? 0) +
      (slot.smooth - slot.spiky);
    archetypeScores.set(slot.archetype, score);
  }

  const dominantArchetypes = [...archetypeScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([a]) => a);

  const field: ConsonantField = {
    smoothHits,
    spikyHits,
    slots,
    hasConflict: total > 0 && smoothRatio < 0.4 && spikyHits > 0,
  };

  const summary: ConsonantSummary = {
    smoothRatio,
    dominantArchetypes,
    notes: [],
  };

  return { field, summary };
}

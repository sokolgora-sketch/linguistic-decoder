
// data/gold/schema.ts

/**
 * Defines the canonical shape for a "gold standard" test item.
 * This is used to evaluate the engine's accuracy against a known-good set.
 */
export type GoldItem = {
  id: string;                // e.g., 'geg_tosk_01'
  input: string;             // 'vajza'
  alphabet: 'latin' | 'albanian';
  expectedPrimary: string;   // canonical primary path label, e.g., "A→E"
  expectedFrontier?: string[];// acceptable frontier paths
  expectedChecksums?: string[];
  dialect?: 'geg' | 'tosk' | 'mixed' | 'unknown';
  notes?: string;            // e.g. 'ë-drop', 'dialectal pair with ...'
};

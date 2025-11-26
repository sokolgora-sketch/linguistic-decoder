// src/functions/zero-layer2-rules.ts
// Layer 2 (Mind) – consonant / soft-morph rules for deep-root analysis.
//
// Vowels (Seven Voices) are fixed by the Heart.
// Here we only define how the consonant "jacket" is allowed to bend,
// e.g.  stu → shtu  (ADD_H_AFTER_S) so we can reach Albanian roots like "shtoj".

// How a morph tends to move: toward more marked / stronger form, softer form,
// or in both directions.
export type MorphDirection = "TO_STRONGER" | "TO_SOFTER" | "BIDIRECTIONAL";

export type MorphCategory =
  | "FRICATIVE"      // s ↔ sh, z ↔ zh
  | "PALATAL"        // k ↔ q, g ↔ gj
  | "GLIDE"          // s + h → sh, th etc.
  | "AFFRICATE"      // c, x, ç, xh families (optional)
  | "NASAL_LIQUID"   // n ↔ r, l ↔ ll (rare / opt)
  | "OTHER";

export type MorphRuleId =
| "S_TO_SH"
| "ADD_H_AFTER_S"
| "Z_TO_ZH"
| "N_TO_NJ"
| "L_TO_LL"
| "R_TO_RR"
| "K_Q"
| "G_GJ"
| "D_T_DH_TH";

/**
 * One legal consonant transform Mind is allowed to apply
 * when searching for micro-roots.
 *
 * Example:
 *  - id: "ADD_H_AFTER_S"
 *  - from: "s"
 *  - to: "sh"
 *  - direction: "TO_STRONGER"
 *  - category: "GLIDE"
 */
export interface ConsonantTransformRule {
  id: string;
  label: string;
  description: string;

  // Substring pattern to replace.
  from: string;
  to: string;

  // Morph direction – used only for reporting / future tuning.
  direction: MorphDirection;
  category: MorphCategory;

  // Whether this rule should be used by default.
  enabledByDefault: boolean;

  notes?: string;
}

interface BlockVariant {
  variant: string;
  appliedRuleIds: MorphRuleId[];
}

interface MorphRule {
  id: MorphRuleId;
  description: string;
  apply: (block: string) => BlockVariant[];
}

// helper: create simple A ↔ B swap rules
function makeSwapRule(
  id: MorphRuleId,
  a: string,
  b: string,
  description: string
): MorphRule {
  return {
    id,
    description,
    apply(block: string): BlockVariant[] {
      const out: BlockVariant[] = [];

      if (block.includes(a)) {
        out.push({
          variant: block.replace(a, b),
          appliedRuleIds: [id],
        });
      }

      if (block.includes(b)) {
        out.push({
          variant: block.replace(b, a),
          appliedRuleIds: [id],
        });
      }

      return out;
    },
  };
}

const MORPH_RULES: MorphRule[] = [
  // --- existing rules ---
  {
    id: "S_TO_SH",
    description: "Allow s ↔ sh as fricative variants.",
    apply(block: string): BlockVariant[] {
      const out: BlockVariant[] = [];
      if (block.includes("s")) {
        out.push({ variant: block.replace("s", "sh"), appliedRuleIds: ["S_TO_SH"] });
      }
      if (block.includes("sh")) {
        out.push({ variant: block.replace("sh", "s"), appliedRuleIds: ["S_TO_SH"] });
      }
      return out;
    },
  },
  {
    id: "ADD_H_AFTER_S",
    description: "Allow s → sh to match roots like 'shtoj'.",
    apply(block: string): BlockVariant[] {
      if (block.startsWith("s")) {
        return [{ variant: `sh${block.substring(1)}`, appliedRuleIds: ["ADD_H_AFTER_S"] }];
      }
      return [];
    },
  },

  // --- new consonant-class rules ---

  // z ↔ zh  (sibilant / palato-alveolar pair)
  makeSwapRule(
    "Z_TO_ZH",
    "z",
    "zh",
    "Allow z ↔ zh as sibilant / palato-alveolar variants."
  ),

  // n ↔ nj  (nasal / palatal nasal)
  makeSwapRule(
    "N_TO_NJ",
    "n",
    "nj",
    "Allow n ↔ nj as nasal variants in the same field."
  ),

  // l ↔ ll  (laterals)
  makeSwapRule(
    "L_TO_LL",
    "l",
    "ll",
    "Allow l ↔ ll as lateral (liquid) variants."
  ),

  // r ↔ rr  (trill strength)
  makeSwapRule(
    "R_TO_RR",
    "r",
    "rr",
    "Allow r ↔ rr; strength of trill does not break the root."
  ),

  // k ↔ q  (velar vs palatal-velar)
  makeSwapRule(
    "K_Q",
    "k",
    "q",
    "Allow k ↔ q as velar/palatal-velar variants."
  ),

  // g ↔ gj  (voiced velar vs palatal)
  makeSwapRule(
    "G_GJ",
    "g",
    "gj",
    "Allow g ↔ gj as voiced velar/palatal variants."
  ),

  // d/t/dh/th cluster – treat as one family for soft shifts
  {
    id: "D_T_DH_TH",
    description: "Allow soft shifts inside the dental/alveolar stop cluster: d, t, dh, th.",
    apply(block: string): BlockVariant[] {
      const out: BlockVariant[] = [];
      const family = ["d", "t", "dh", "th"] as const;

      for (const from of family) {
        if (!block.includes(from)) continue;

        for (const to of family) {
          if (to === from) continue;
          out.push({
            variant: block.replace(from, to),
            appliedRuleIds: ["D_T_DH_TH"],
          });
        }
      }

      return out;
    },
  },
];


/**
 * Generate legal consonant variants for a block using the rules above.
 *
 * We keep it intentionally shallow:
 *  - always include the original block
 *  - apply each rule once to generate variants
 *
 * This is enough for patterns like:
 *  "stu" → "shtu" (ADD_H_AFTER_S)
 *  "gju" ↔ "gu"   (G_GJ)
 */
export function generateBlockVariants(
  block: string,
  maxOps: number = 1 // Currently unused, but good for future extension
): BlockVariant[] {
  const variants: BlockVariant[] = [
    { variant: block, appliedRuleIds: [] },
  ];

  for (const rule of MORPH_RULES) {
    const newVariants = rule.apply(block);
    variants.push(...newVariants.map(v => ({ form: v.variant, appliedRuleIds: v.appliedRuleIds })));
  }

  // Deduplicate by form; if multiple rules yield same form we keep first.
  const seen = new Set<string>();
  const unique: BlockVariant[] = [];
  for (const v of variants) {
    if (seen.has(v.form)) continue;
    seen.add(v.form);
    unique.push({form: v.variant, appliedRuleIds: v.appliedRuleIds });
  }

  return unique;
}

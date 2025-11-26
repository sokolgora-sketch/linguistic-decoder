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
  | "D_T_DH_TH"
  | "SH_TO_S"
  | "ZH_TO_Z"
  | "NJ_TO_N"
  | "LL_TO_L"
  | "RR_TO_R"
  | "Q_TO_K"
  | "GJ_TO_G"
  | "C_TO_X"
  | "C_TO_C_CEDILLA"
  | "N_TO_R"
  | "DROP_H_IN_SH"
  | "K_TO_Q"
  | "G_TO_GJ";
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
  id: MorphRuleId;
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

/**
 * All core consonant morph rules for Layer 2.
 *
 * These are deliberately small and explicit. Mind is NOT allowed to invent
 * new morphs outside this list.
 */
export const CONSONANT_TRANSFORMS: ConsonantTransformRule[] = [
  // ─────────────────────────────────────────────
  // 1. FRICATIVE BRIDGE: S ↔ SH, Z ↔ ZH
  // ─────────────────────────────────────────────

  {
    id: "S_TO_SH",
    label: "s → sh",
    description:
      "Allow alveolar fricative s to strengthen to postalveolar sh when matching Albanian roots.",
    from: "s",
    to: "sh",
    direction: "TO_STRONGER",
    category: "FRICATIVE",
    enabledByDefault: true,
    notes: "Used for patterns like stu → shtu; helps reach roots like 'shtoj'.",
  },
  {
    id: "SH_TO_S",
    label: "sh → s",
    description:
      "Allow postalveolar sh to simplify to s when surface form is lighter than the root.",
    from: "sh",
    to: "s",
    direction: "TO_SOFTER",
    category: "FRICATIVE",
    enabledByDefault: true,
    notes: "Lets us recognise roots even if h is dropped in the surface word.",
  },
  {
    id: "Z_TO_ZH",
    label: "z → zh",
    description:
      "Allow voiced alveolar fricative z to shift toward zh when matching deeper Albanian roots.",
    from: "z",
    to: "zh",
    direction: "TO_STRONGER",
    category: "FRICATIVE",
    enabledByDefault: false,
    notes: "More experimental; keep off by default or use only when there is evidence.",
  },
  {
    id: "ZH_TO_Z",
    label: "zh → z",
    description:
      "Allow zh to simplify to z when surface forms weaken the fricative.",
    from: "zh",
    to: "z",
    direction: "TO_SOFTER",
    category: "FRICATIVE",
    enabledByDefault: false,
    notes: "Symmetric partner to Z_TO_ZH.",
  },

  // ─────────────────────────────────────────────
  // 2. GLIDE / DIGRAPH RULES (s + h → sh, etc.)
  // ─────────────────────────────────────────────

  {
    id: "ADD_H_AFTER_S",
    label: "s + h → sh",
    description:
      "If a block begins with s and can reach an Albanian root with sh (sht- family), allow inserting h to form sh.",
    from: "s",
    to: "sh",
    direction: "TO_STRONGER",
    category: "GLIDE",
    enabledByDefault: true,
    notes: "Core rule for patterns like stu → shtu → shtoj (to add).",
  },
  {
    id: "DROP_H_IN_SH",
    label: "sh → s (drop h)",
    description:
      "Treat missing h in a surface sh-cluster as acceptable when matching an sh-based root.",
    from: "sh",
    to: "s",
    direction: "TO_SOFTER",
    category: "GLIDE",
    enabledByDefault: true,
    notes: "Allows mapping between 'sh' roots and lighter surface forms.",
  },

  // ─────────────────────────────────────────────
  // 3. PALATAL / VELAR BRIDGE: K↔Q, G↔GJ
  // ─────────────────────────────────────────────

  {
    id: "K_TO_Q",
    label: "k → q",
    description:
      "Allow velar k to shift to palatal q when Albanian roots are written with q.",
    from: "k",
    to: "q",
    direction: "TO_STRONGER",
    category: "PALATAL",
    enabledByDefault: true,
    notes: "Useful around roots where k/q alternate across dialects.",
  },
  {
    id: "Q_TO_K",
    label: "q → k",
    description:
      "Allow palatal q to simplify to k when surface form is less palatalised.",
    from: "q",
    to: "k",
    direction: "TO_SOFTER",
    category: "PALATAL",
    enabledByDefault: true,
    notes: "Opposite direction of K_TO_Q.",
  },
  {
    id: "G_TO_GJ",
    label: "g → gj",
    description:
      "Allow velar g to strengthen to palatal gj when searching Albanian roots.",
    from: "g",
    to: "gj",
    direction: "TO_STRONGER",
    category: "PALATAL",
    enabledByDefault: true,
    notes: "Used for patterns like gju/guha families.",
  },
  {
    id: "GJ_TO_G",
    label: "gj → g",
    description:
      "Allow gj to simplify to g when the surface form is less palatalised.",
    from: "gj",
    to: "g",
    direction: "TO_SOFTER",
    category: "PALATAL",
    enabledByDefault: true,
    notes: "Opposite direction of G_TO_GJ.",
  },

  // ─────────────────────────────────────────────
  // 4. AFFRICATE GROUPS – conservative, optional
  // ─────────────────────────────────────────────

  {
    id: "C_TO_X",
    label: "c ↔ x (ts/dz pair)",
    description:
      "Treat dental affricates c and x as a family when matching known roots.",
    from: "c",
    to: "x",
    direction: "BIDIRECTIONAL",
    category: "AFFRICATE",
    enabledByDefault: false,
    notes: "Keep off by default; can be enabled for specific word families.",
  },
  {
    id: "C_TO_C_CEDILLA",
    label: "c ↔ ç (ts/tʃ pair)",
    description:
      "Allow mild shift between dental c and postalveolar ç when evidence exists.",
    from: "c",
    to: "ç",
    direction: "BIDIRECTIONAL",
    category: "AFFRICATE",
    enabledByDefault: false,
    notes: "Very conservative; only use when a known root is hit.",
  },

  // ─────────────────────────────────────────────
  // 5. NASAL / LIQUID – rare, mostly off
  // ─────────────────────────────────────────────

  {
    id: "N_TO_R",
    label: "n ↔ r (rhotacism)",
    description:
      "Optional rhotacism: n and r can alternate in well-known pairs (femën/femër).",
    from: "n",
    to: "r",
    direction: "BIDIRECTIONAL",
    category: "NASAL_LIQUID",
    enabledByDefault: false,
    notes: "Use only for whitelisted roots; not general.",
  },
  {
    id: "L_TO_LL",
    label: "l ↔ ll",
    description:
      "Treat l and ll as strength variants inside the same root family.",
    from: "l",
    to: "ll",
    direction: "BIDIRECTIONAL",
    category: "NASAL_LIQUID",
    enabledByDefault: false,
    notes: "Optional; can be turned on for specific patterns.",
  },
];

// ─────────────────────────────────────────────
// Helper – generate block variants from rules
// ─────────────────────────────────────────────


/**
 * Generate legal consonant variants for a block using the rules above.
 *
 * We keep it intentionally shallow:
 *  - always include the original block
 *  - apply at most 1 rule once per variant (maxOps = 1 by default)
 *  - only use rules that are enabledByDefault
 *
 * This is enough for patterns like:
 *  "stu" → "shtu" (ADD_H_AFTER_S)
 *  "gju" ↔ "gu"   (G_TO_GJ / GJ_TO_G)   [if used around known roots]
 */
export function generateBlockVariants(
  block: string,
  maxOps: number = 1
): BlockVariant[] {
  const variants: BlockVariant[] = [
    { variant: block, appliedRuleIds: [] },
  ];

  if (maxOps < 1) {
    return variants;
  }

  for (const rule of CONSONANT_TRANSFORMS) {
    if (!rule.enabledByDefault) continue;

    const idx = block.indexOf(rule.from);
    if (idx === -1) continue;

    const transformed =
      block.slice(0, idx) +
      rule.to +
      block.slice(idx + rule.from.length);

    if (transformed === block) continue;

    variants.push({
      variant: transformed,
      appliedRuleIds: [rule.id],
    });
  }

  // Deduplicate by form; if multiple rules yield same form we keep first.
  const seen = new Set<string>();
  const unique: BlockVariant[] = [];
  for (const v of variants) {
    if (seen.has(v.variant)) continue;
    seen.add(v.variant);
    unique.push(v);
  }

  return unique;
}

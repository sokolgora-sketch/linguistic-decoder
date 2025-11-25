// src/functions/zero-layer2-mind.ts
// Layer 2 (Mind) – prototype DeepRoot builder.
// Uses:
//  - HeartResult (from zero-heart-types)
//  - generateBlockVariants (from zero-layer2-rules)
// to find Albanian-style micro-roots like shtu, di, m, da, ma, gje, etc.

import {
  HeartResult,
  RootRole,
  DeepRootPiece,
  DeepRootExample,
  DeepRootResult,
} from "./zero-heart-types";
import {
  generateBlockVariants,
  BlockVariant,
} from "./zero-layer2-rules";

// ─────────────────────────────────────────────
// Micro-root lexicon (v1)
// ─────────────────────────────────────────────

interface MicroRootLexeme {
  base: string;          // canonical form, e.g. "shtu", "di", "gje"
  language: string;      // e.g. "Albanian"
  meaning: string;       // plain-text meaning
  roles: RootRole[];     // which roles this root can naturally fill
  notes?: string;
}

/**
 * Minimal Albanian-focused micro-root lexicon.
 * This is intentionally small and explicit.
 * Mind is NOT allowed to invent roots outside this list.
 */
const ALBANIAN_MICRO_ROOTS: MicroRootLexeme[] = [
  // damage: da – ma – gje
  {
    base: "da",
    language: "Albanian",
    meaning: "to split, divide, separate",
    roles: ["ACTION"],
    notes: "Verb 'me nda' / 'u nda' – split or separate.",
  },
  {
    base: "ma",
    language: "Albanian",
    meaning: "more, larger portion / measure",
    roles: ["DOMAIN"],
    notes: "Intensifier: marks greater extent or larger part.",
  },
  {
    base: "gje",
    language: "Albanian",
    meaning: "thing, object, asset",
    roles: ["RESULT", "DOMAIN"],
    notes: "Noun 'gjë' – concrete or abstract thing.",
  },

  // study: shtu – di – m
  {
    base: "shtu",
    language: "Albanian",
    meaning: "to add, increase, bring more into a field",
    roles: ["ACTION", "DOMAIN"],
    notes: "From 'shtoj' – legal morph stu → shtu using ADD_H_AFTER_S.",
  },
  {
    base: "di",
    language: "Albanian",
    meaning: "to know",
    roles: ["DOMAIN", "RESULT"],
    notes: "Verb 'me ditë' / 'di' – I know.",
  },
  {
    base: "m",
    language: "Albanian",
    meaning: "me, mine, that which belongs to me",
    roles: ["RESULT"],
    notes: "First-person marker; signals ownership.",
  },

  // dark / law / mystery pieces (for future words)
  {
    base: "ter",
    language: "Albanian",
    meaning: "darkness, complete lack of light",
    roles: ["DOMAIN", "RESULT"],
    notes: "From 'terr' – dark, no light.",
  },
  {
    base: "ligj",
    language: "Albanian",
    meaning: "law, formal rule",
    roles: ["DOMAIN"],
    notes: "Noun 'ligj' – law / rule.",
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Try to find a micro-root for a given block (e.g. "stu", "da", "gje")
 * using the legal consonant morph rules (stu → shtu, etc.).
 */
function findMicroRootForBlock(
  block: string,
  roleHint: RootRole
): DeepRootPiece | null {
  const variants: BlockVariant[] = generateBlockVariants(block);

  // First pass: respect the roleHint (ACTION / DOMAIN / RESULT)
  for (const variant of variants) {
    const root = ALBANIAN_MICRO_ROOTS.find((lexeme) => {
      if (lexeme.base !== variant.form) return false;
      return lexeme.roles.includes(roleHint);
    });

    if (root) {
      const notesParts: string[] = [];
      if (root.notes) notesParts.push(root.notes);
      if (variant.appliedRuleIds.length > 0) {
        notesParts.push(
          `applied morph rule(s): ${variant.appliedRuleIds.join(
            ", "
          )} from original block '${block}'`
        );
      }

      const piece: DeepRootPiece = {
        role: roleHint,
        block: root.base,
        language: root.language,
        meaning: root.meaning,
        notes: notesParts.length > 0 ? notesParts.join(" | ") : undefined,
      };

      return piece;
    }
  }

  // Second pass: ignore roleHint, just see if some micro-root matches at all
  for (const variant of variants) {
    const root = ALBANIAN_MICRO_ROOTS.find(
      (lexeme) => lexeme.base === variant.form
    );
    if (root) {
      const notesParts: string[] = [];
      if (root.notes) notesParts.push(root.notes);
      if (variant.appliedRuleIds.length > 0) {
        notesParts.push(
          `applied morph rule(s): ${variant.appliedRuleIds.join(
            ", "
          )} from original block '${block}'`
        );
      }

      const piece: DeepRootPiece = {
        role: roleHint,
        block: root.base,
        language: root.language,
        meaning: root.meaning,
        notes: notesParts.length > 0 ? notesParts.join(" | ") : undefined,
      };

      return piece;
    }
  }

  return null;
}

/**
 * Choose a "best" Heart candidate:
 *  - first one that has a "strong fit" signal
 *  - otherwise, just the first candidate.
 */
function pickBestHeartCandidate(heart: HeartResult) {
  if (!heart.candidates || heart.candidates.length === 0) return null;

  const strong = heart.candidates.find((c) =>
    (c.signals || []).some((s) => s.toLowerCase().includes("strong fit"))
  );
  return strong || heart.candidates[0];
}

/**
 * Build examples for the word, if we know it (damage, study, etc.).
 */
function buildExamplesForWord(word: string): DeepRootExample[] {
  const w = word.toLowerCase();

  if (w === "damage") {
    return [
      {
        language: "Albanian",
        form: "dëm",
        gloss: "harm, damage",
      },
      {
        language: "Albanian",
        form: "me nda gjënë",
        gloss: "to split the thing, to divide the asset",
      },
      {
        language: "English",
        form: "damage",
        gloss: "harm or injury that makes something less valuable or useful",
      },
    ];
  }

  if (w === "study") {
    return [
      {
        language: "English",
        form: "study",
        gloss: "to devote effort to learning and understanding a subject",
      },
      {
        language: "English",
        form: "student",
        gloss: "one who is actively adding knowledge",
      },
      {
        language: "Albanian",
        form: "shtoj",
        gloss: "to add, to increase",
      },
      {
        language: "Albanian",
        form: "studim",
        gloss: "study; the process of adding knowledge",
      },
    ];
  }

  // Generic fallback: just echo the word with the heart function.
  return [
    {
      language: "Unknown",
      form: word,
      gloss: "See core_function – generic DeepRoot description.",
    },
  ];
}

// ─────────────────────────────────────────────
// Main entry – build DeepRootResult from Heart
// ─────────────────────────────────────────────

/**
 * Prototype DeepRoot builder:
 *  - reads HeartResult (Seven Principles verdict)
 *  - picks one candidate decomposition
 *  - tries to map each chunk into Albanian micro-roots
 *    using the legal consonant morph rules
 *
 * If it cannot safely build pieces, it returns null.
 */
export function buildDeepRootFromHeart(
  heart: HeartResult
): DeepRootResult | null {
  const candidate = pickBestHeartCandidate(heart);
  if (!candidate || !candidate.decomposition || candidate.decomposition.length === 0) {
    return null;
  }

  const pieces: DeepRootPiece[] = [];

  for (const chunk of candidate.decomposition) {
    const piece = findMicroRootForBlock(chunk.form, chunk.role);
    if (piece) {
      pieces.push(piece);
    }
  }

  if (pieces.length === 0) {
    // Nothing could be grounded; do not fabricate.
    return null;
  }

  const explanation_short =
    heart.core_function ||
    "Deep-root explanation is aligned with the core function decided by the Heart.";

  const examples_modern_usage = buildExamplesForWord(heart.meta.input_word);

  const result: DeepRootResult = {
    core_function: heart.core_function,
    core_vowel_motif: heart.core_vowel_motif,
    light_dark: heart.light_dark,
    vibrational_tone: heart.vibrational_tone,
    pieces,
    explanation_short,
    examples_modern_usage,
  };

  return result;
}

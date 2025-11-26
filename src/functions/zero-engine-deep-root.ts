// src/functions/zero-engine-deep-root.ts
// This file will contain the DeepRoot builder logic and related helpers.
// For now, it exports a `computeDeepRootForWord` function for testing.

import { buildDeepRootFromHeart } from './zero-layer2-mind';
import type { DeepRootResult, HeartResult } from './zero-heart-types';

function makeHeartDamage(): HeartResult {
  const heart = {
    meta: {
      engine_version: "zero-core-v1-smoke",
      mode: "STRICT",
      input_word: "damage",
      timestamp_iso: new Date().toISOString(),
    },
    core_function:
      "Divide something from its wholeness and leave the thing itself in a harmed state.",
    core_vowel_motif: ["A", "A", "E"],
    light_dark: "DARK",
    vibrational_tone: "LOW",
    candidates: [
      {
        language: "English",
        form: "damage",
        decomposition: [
          { role: "ACTION", form: "da", gloss: "to split, divide" },
          {
            role: "DOMAIN",
            form: "ma",
            gloss: "more, larger portion / measure",
          },
          { role: "RESULT", form: "gje", gloss: "thing, object, asset" },
        ],
        vowel_path: ["A", "A", "E"],
        functional_statement:
          "Split or cut off a part of something so that the remaining thing is left in a harmed state.",
        light_dark: "DARK",
        vibrational_tone: "LOW",
        signals: ["strong fit", "albanian-micro-roots"],
      },
    ],
    warnings: [],
  } as HeartResult;

  return heart;
}

function makeHeartDemtim(): HeartResult {
  // Here we treat "dëmtim" as the state/process that results
  // when DA–MA–GJË has already been applied.
  const heart = {
    meta: {
      engine_version: "zero-core-v1-smoke",
      mode: "STRICT",
      input_word: "dëmtim",
      timestamp_iso: new Date().toISOString(),
    },
    core_function:
      "The state or process where a thing has already been harmed and stands reduced from its wholeness.",
    // For dëmtim you computed Ë → I in your core engine;
    // here we keep the deeper A–A–E motif underneath as the damage root.
    core_vowel_motif: ["A", "A", "E"],
    light_dark: "DARK",
    vibrational_tone: "LOW",
    candidates: [
      {
        language: "Albanian",
        form: "dëmtim",
        decomposition: [
          { role: "ACTION", form: "da", gloss: "to split, divide" },
          {
            role: "DOMAIN",
            form: "ma",
            gloss: "more, larger portion / measure",
          },
          {
            role: "RESULT",
            form: "gje",
            gloss: "thing, object, asset; the harmed unit",
          },
        ],
        vowel_path: ["A", "A", "E"],
        functional_statement:
          "Apply division to a thing so that the remaining unit stays in a harmed, reduced state.",
        light_dark: "DARK",
        vibrational_tone: "LOW",
        signals: ["strong fit", "albanian-micro-roots"],
      },
    ],
    warnings: [],
  } as HeartResult;

  return heart;
}

function makeHeartStudy(): HeartResult {
  const heart = {
    meta: {
      engine_version: "zero-core-v1-smoke",
      mode: "STRICT",
      input_word: "study",
      timestamp_iso: new Date().toISOString(),
    },
    core_function:
      "Gather many elements into one field so that a clear pattern and understanding can form.",
    core_vowel_motif: ["U", "I"],
    light_dark: "MIXED",
    vibrational_tone: "MID",
    candidates: [
      {
        // surface-style candidate, mainly here as a decoy
        language: "English",
        form: "study",
        decomposition: [
          { role: "ACTION", form: "stu", gloss: "apply effort" },
          { role: "DOMAIN", form: "dy", gloss: "double / compare" },
        ],
        vowel_path: ["U", "I"],
        functional_statement:
          "Apply focused effort so that comparisons and patterns can become clear.",
        light_dark: "MIXED",
        vibrational_tone: "MID",
        signals: ["surface-form"],
      },
      {
        // Albanian-pattern candidate we actually want Mind to ground:
        // s'tu-di-m  → stu, di, m
        language: "Albanian-pattern",
        form: "s'tu-di-m",
        decomposition: [
          {
            role: "ACTION",
            form: "stu", // Mind will use stu → shtu via S_TO_SH / ADD_H_AFTER_S
            gloss: "what is not yet yours / to be added",
          },
          {
            role: "DOMAIN",
            form: "di",
            gloss: "to know",
          },
          {
            role: "RESULT",
            form: "m",
            gloss: "me / mine",
          },
        ],
        vowel_path: ["U", "I"],
        functional_statement:
          "Take what is not yet yours, know it, and make it part of yourself.",
        light_dark: "MIXED",
        vibrational_tone: "MID",
        signals: ["strong fit", "albanian-micro-roots"],
      },
    ],
    warnings: [],
  } as HeartResult;

  return heart;
}

function makeHeartMathematics(): HeartResult {
  const heart = {
    meta: {
      engine_version: "zero-core-v1-smoke",
      mode: "STRICT",
      input_word: "mathematics",
      timestamp_iso: new Date().toISOString(),
    },
    core_function:
      "Measure and re-measure what is present so that what you have becomes a clear, stable quantity.",
    // Based on 'matematika' → A–E–A–I–A
    core_vowel_motif: ["A", "E", "A", "I", "A"],
    light_dark: "MIXED",
    vibrational_tone: "MID",
    candidates: [
      {
        language: "Albanian-pattern",
        form: "matematika",
        decomposition: [
          {
            role: "ACTION",
            form: "mat",
            gloss: "to measure",
          },
          {
            role: "DOMAIN",
            form: "mat",
            gloss: "field of repeated measurement",
          },
          {
            role: "RESULT",
            form: "tika",
            gloss: "what you have; counted unit",
          },
        ],
        vowel_path: ["A", "E", "A", "I", "A"],
        functional_statement:
          "Measure and re-measure what is there so that what you have becomes a clear, stable quantity.",
        light_dark: "MIXED",
        vibrational_tone: "MID",
        signals: ["strong fit", "albanian-micro-roots"],
      },
    ],
    warnings: [],
  } as HeartResult;

  return heart;
}

function makeHeartReligion(): HeartResult {
  const heart = {
    meta: {
      engine_version: "zero-core-v1-smoke",
      mode: "STRICT",
      input_word: "religion",
      timestamp_iso: new Date().toISOString(),
    },
    core_function:
      "Return or bind people under a law or rule inside a shared circle.",
    // re-ligj-on → E–I–O as core motif
    core_vowel_motif: ["E", "I", "O"],
    light_dark: "MIXED",
    vibrational_tone: "MID",
    candidates: [
      {
        language: "Latin/Albanian-bridge",
        form: "religion",
        decomposition: [
          {
            role: "ACTION",
            form: "re",
            gloss: "again, back, return",
          },
          {
            role: "DOMAIN",
            form: "ligj",
            gloss: "law, binding rule",
          },
          {
            role: "RESULT",
            form: "on",
            gloss: "state under that law",
          },
        ],
        vowel_path: ["E", "I", "O"],
        functional_statement:
          "Bind or return people under a law or rule within a shared circle or order.",
        light_dark: "MIXED",
        vibrational_tone: "MID",
        signals: ["strong fit", "albanian-micro-roots", "law-circle"],
      },
    ],
    warnings: [],
  } as HeartResult;

  return heart;
}

// New smoke test functions
function makeHeartMystery(): HeartResult {
    return {
        meta: { engine_version: 'zero-core-v1-smoke', mode: 'STRICT', input_word: 'mystery', timestamp_iso: new Date().toISOString() },
        core_function: 'To hide or conceal something within a dark or unknown field.',
        core_vowel_motif: ['I', 'E', 'I'],
        light_dark: 'DARK',
        vibrational_tone: 'LOW',
        candidates: [
            { language: 'Albanian-pattern', form: 'misteri', decomposition: [{ role: 'ACTION', form: 'mys' }, { role: 'DOMAIN', form: 'ter' }, { role: 'RESULT', form: 'y' }], vowel_path: ['I', 'E', 'I'], functional_statement: 'To close something within darkness.', signals: ['strong fit'] }
        ]
    } as HeartResult;
}

function makeHeartPhilosophy(): HeartResult {
    return {
        meta: { engine_version: 'zero-core-v1-smoke', mode: 'STRICT', input_word: 'philosophy', timestamp_iso: new Date().toISOString() },
        core_function: 'A love or pursuit of wisdom that unifies diverse ideas.',
        core_vowel_motif: ['I', 'O', 'O', 'I'],
        light_dark: 'MIXED',
        vibrational_tone: 'HIGH',
        candidates: [
            { language: 'Greek', form: 'philosophia', decomposition: [{ role: 'ACTION', form: 'phi' }, { role: 'DOMAIN', form: 'lo' }, { role: 'DOMAIN', form: 'so' }, { role: 'RESULT', form: 'phy' }], vowel_path: ['I', 'O', 'O', 'I'], functional_statement: 'The love of wisdom.', signals: ['historical-carrier'] }
        ]
    } as HeartResult;
}

function makeHeartFilozofi(): HeartResult {
    return {
        meta: { engine_version: 'zero-core-v1-smoke', mode: 'STRICT', input_word: 'filozofi', timestamp_iso: new Date().toISOString() },
        core_function: 'A love or pursuit of wisdom that unifies diverse ideas.',
        core_vowel_motif: ['I', 'O', 'O', 'I'],
        light_dark: 'MIXED',
        vibrational_tone: 'HIGH',
        candidates: [
            { language: 'Albanian', form: 'filozofi', decomposition: [{ role: 'ACTION', form: 'fi' }, { role: 'DOMAIN', form: 'lo' }, { role: 'DOMAIN', form: 'zo' }, { role: 'RESULT', form: 'fi' }], vowel_path: ['I', 'O', 'O', 'I'], functional_statement: 'The thread of wisdom.', signals: ['strong fit'] }
        ]
    } as HeartResult;
}

function makeHeartLanguage(): HeartResult {
    return {
        meta: { engine_version: 'zero-core-v1-smoke', mode: 'STRICT', input_word: 'language', timestamp_iso: new Date().toISOString() },
        core_function: 'The instrument of the tongue that gives form to a shared field.',
        core_vowel_motif: ['A', 'U', 'A', 'E'],
        light_dark: 'MIXED',
        vibrational_tone: 'MID',
        candidates: [
            { language: 'Latin', form: 'lingua', decomposition: [{ role: 'DOMAIN', form: 'lan' }, { role: 'DOMAIN', form: 'gua' }, { role: 'RESULT', form: 'ge' }], vowel_path: ['I', 'A'], functional_statement: 'Relating to the tongue.', signals: ['historical-carrier'] },
        ]
    } as HeartResult;
}

/**
 * Test helper to generate a DeepRootResult for a canonical word.
 * This wraps the smoke test's Heart builders and the Mind layer.
 */
export function computeDeepRootForWord(word: string): DeepRootResult | null {
  const w = word.toLowerCase();
  let heart;

  switch (w) {
    case 'damage':
      heart = makeHeartDamage();
      break;
    case 'dëmtim':
      heart = makeHeartDemtim();
      break;
    case 'study':
      heart = makeHeartStudy();
      break;
    case 'mathematics':
      heart = makeHeartMathematics();
      break;
    case 'religion':
      heart = makeHeartReligion();
      break;
    case 'mystery':
      heart = makeHeartMystery();
      break;
    case 'philosophy':
      heart = makeHeartPhilosophy();
      break;
    case 'filozofi':
      heart = makeHeartFilozofi();
      break;
    case 'language':
      heart = makeHeartLanguage();
      break;
    default:
      return null;
  }

  return buildDeepRootFromHeart(heart);
}

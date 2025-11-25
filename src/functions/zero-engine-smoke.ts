// src/functions/zero-engine-smoke.ts
// Smoke test for Layer 2 (Mind) DeepRoot builder.
// This does NOT touch your real engine. It just:
//  - builds fake HeartResult objects for "damage" and "study"
//  - runs buildDeepRootFromHeart
//  - logs the DeepRootResult to console

import { HeartResult } from "./zero-heart-types";
import { buildDeepRootFromHeart } from "./zero-layer2-mind";

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
            form: "stu", // Mind will use stu → shtu via ADD_H_AFTER_S
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

async function main() {
  console.log("=== ZË-RO DeepRoot smoke test ===");

  // DAMAGE
  const heartDamage = makeHeartDamage();
  const deepDamage = buildDeepRootFromHeart(heartDamage);

  console.log("\n--- DeepRoot for 'damage' ---");
  if (!deepDamage) {
    console.log("No DeepRootResult produced for 'damage'.");
  } else {
    console.log(JSON.stringify(deepDamage, null, 2));
  }

  // STUDY
  const heartStudy = makeHeartStudy();
  const deepStudy = buildDeepRootFromHeart(heartStudy);

  console.log("\n--- DeepRoot for 'study' ---");
  if (!deepStudy) {
    console.log("No DeepRootResult produced for 'study'.");
  } else {
    console.log(JSON.stringify(deepStudy, null, 2));
  }

  console.log("\n=== smoke test done ===");
}

// Allow running via: npx tsx src/functions/zero-engine-smoke.ts
main().catch((err) => {
  console.error("Smoke test error:", err);
  process.exit(1);
});

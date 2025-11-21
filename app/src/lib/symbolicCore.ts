// src/lib/symbolicCore.ts
//
// Symbolic core layer for the Seven-Voices engine.
// This does NOT change the core path logic. It only
// adds a higher-level, Petro-Zheji-style view:
// - sound mutations (C↔Ç, S↔SH, G↔GJ, D↔DH, etc.)
// - gender flow (A/Ë outer ring, O center, etc.)
// - functional triplet: Action | Instrument/Function | Unit/Result
// - protocol rule logging
//
// Safe v1: pure helpers, no side effects, not wired into analyzeWord yet.

import type { Vowel, SevenVoicesSummary } from "@/shared/engineShape";

/**
 * Direction / polarity of the vowel motion.
 * Based on your model:
 * - A / Ë = outer ring (Father / Mother)
 * - E / Y = middle ring (Expansion / Network)
 * - I / U = inner ring (Insight / Unity)
 * - O     = center (Balance / Mediator)
 */
export type GenderFlow = {
  // e.g. "outward", "inward", "mixed", "flat"
  direction: "outward" | "inward" | "mixed" | "flat";
  // e.g. ["male", "female"] if A→Ë, etc.
  polarities: Array<"male" | "female" | "neutral">;
  // textual hint, not for logic
  note: string;
};

/**
 * Functional triplet:
 * - action: the verb / motion (what happens?)
 * - instrument: the organ / tool / function (how?)
 * - result: the unit / outcome (what is formed?)
 */
export type FunctionalTriplet = {
  action: string | null;
  instrument: string | null;
  result: string | null;
  // Optional free text explanation
  statement?: string;
};

/**
 * Result of applying consonant/phonetic mutation
 * rules (Zheji-style, but simplified for v1).
 */
export type SoundMutationResult = {
  base: string;
  // e.g. ["sh", "zh"] etc. mutated forms
  variants: string[];
  // list of rules that fired: ["S→SH", "C→Ç", ...]
  rulesApplied: string[];
};

/**
 * Symbolic protocol rules triggered during analysis.
 * This is just a list of human-readable tags; the
 * core engine stays numeric and deterministic.
 */
export type ProtocolRuleLog = string[];

/**
 * Symbolic core result: high-level, human-facing layer
 * that can sit on top of EnginePayload/AnalysisResult.
 */
export type SymbolicCoreResult = {
  word: string;
  alphabet?: string;

  sevenVoices: SevenVoicesSummary;
  genderFlow: GenderFlow;
  functionalTriplet: FunctionalTriplet;
  soundMutations: SoundMutationResult;
  protocolRules: ProtocolRuleLog;
};

/**
 * Map a vowel to its "ring index" as used in your core:
 * A=3, E=2, I=1, O=0, U=1, Y=2, Ë=3
 * (Keep it local here to avoid importing the manifest.)
 */
function ringOf(v: Vowel): number {
  switch (v) {
    case "O":
      return 0;
    case "I":
    case "U":
      return 1;
    case "E":
    case "Y":
      return 2;
    case "A":
    case "Ë":
      return 3;
    default:
      return 1;
  }
}

/**
 * Map a vowel to a rough polarity:
 * - A = male-outer
 * - Ë = female-outer
 * - O = neutral-center
 * - E, I, U, Y = mixed/neutral for now (we can refine later)
 */
function polarityOf(v: Vowel): "male" | "female" | "neutral" {
  if (v === "A") return "male";
  if (v === "Ë") return "female";
  if (v === "O") return "neutral";
  return "neutral";
}

/**
 * Compute gender flow from a Seven-Voices path.
 * v1 is intentionally simple:
 * - If most movement is from inner ring → outer ring → "outward"
 * - If most movement is from outer → inner → "inward"
 * - If both directions are active → "mixed"
 * - If no movement (single vowel) → "flat"
 */
export function computeGenderFlow(summary: SevenVoicesSummary): GenderFlow {
  const path = summary.voicePath || [];
  if (path.length <= 1) {
    const p = path[0];
    return {
      direction: "flat",
      polarities: p ? [polarityOf(p)] : [],
      note: "Single-voice path (no movement).",
    };
  }

  let outward = 0;
  let inward = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const r1 = ringOf(path[i]);
    const r2 = ringOf(path[i + 1]);
    if (r2 > r1) outward++;
    else if (r2 < r1) inward++;
  }

  let direction: GenderFlow["direction"];
  if (outward === 0 && inward === 0) direction = "flat";
  else if (outward > 0 && inward === 0) direction = "outward";
  else if (inward > 0 && outward === 0) direction = "inward";
  else direction = "mixed";

  const polarities = Array.from(new Set(path.map(polarityOf)));

  return {
    direction,
    polarities,
    note: `Flow: outward=${outward}, inward=${inward}.`,
  };
}

/**
 * Apply basic sound mutation rules:
 * - S ↔ SH
 * - C ↔ Ç  (for now just marked, not auto-applied to text)
 * - G ↔ GJ
 * - D ↔ DH
 *
 * v1 is conservative: we only generate a SMALL set of
 * variants to test functional roots, we do NOT explode
 * into dozens of crazy forms.
 */
export function applySoundMutations(word: string): SoundMutationResult {
  const base = word;
  const lower = word.toLowerCase();

  const variants = new Set<string>();
  const rules: string[] = [];

  // S → SH
  if (lower.includes("s")) {
    variants.add(lower.replace(/s/g, "sh"));
    rules.push("S→SH");
  }

  // C → Ç (we only log rule for now)
  if (lower.includes("c")) {
    // you can later actually generate "ç" variant if useful
    rules.push("C→Ç");
  }

  // G → GJ
  if (lower.includes("g")) {
    variants.add(lower.replace(/g/g, "gj"));
    rules.push("G→GJ");
  }

  // D → DH
  if (lower.includes("d")) {
    variants.add(lower.replace(/d/g, "dh"));
    rules.push("D→DH");
  }

  // Always include base itself
  variants.add(lower);

  return {
    base,
    variants: Array.from(variants),
    rulesApplied: rules,
  };
}

/**
 * Very light functional triplet derivation for v1.
 *
 * We DO NOT try to be clever here. This is a stub that
 * can be refined per canon word. The idea is:
 * - later we can plug in per-word rules (damage, study, etc.)
 * - or generic patterns based on language candidates.
 */
export function deriveFunctionalTriplet(
  word: string,
  summary: SevenVoicesSummary
): FunctionalTriplet {
  const lower = word.toLowerCase();
  const vp = (summary.voicePath || []).join("");

  // Hard-coded seeds for now – purely symbolic, non-authoritative.
  if (lower === "damage") {
    return {
      action: "to split / harm",
      instrument: "force / impact",
      result: "broken unit",
      statement: "Energy that splits something into a harmed state.",
    };
  }

  if (lower === "study") {
    return {
      action: "to focus / attend",
      instrument: "mind / attention",
      result: "internalised knowledge",
      statement: "Process of making what is not yours become yours (S'tu → di → m).",
    };
  }

  if (lower === "love") {
    return {
      action: "to bind / care",
      instrument: "heart / relation",
      result: "shared field",
      statement: "Balance between self and other in a shared field.",
    };
  }

  // Generic fallback using Seven-Voices path as hint.
  let action = "undefined action";
  let instrument = "undefined instrument";
  let result = "undefined result";

  if (vp.startsWith("A")) {
    action = "originate / assert";
  } else if (vp.startsWith("U")) {
    action = "unify / dive";
  } else if (vp.startsWith("E")) {
    action = "expand / express";
  }

  if (vp.includes("I")) {
    instrument = "mind / insight";
  } else if (vp.includes("O")) {
    instrument = "balance / mediation";
  }

  if (vp.endsWith("Ë")) {
    result = "formed unit / closure";
  } else if (vp.endsWith("A")) {
    result = "open act / continuation";
  }

  return {
    action,
    instrument,
    result,
    statement: "Generic functional triplet derived from Seven-Voices path.",
  };
}

/**
 * Log symbolic protocol rules triggered for a given word.
 * This is for transparency: "why did the engine think this?"
 */
export function logProtocolRules(params: {
  word: string;
  summary: SevenVoicesSummary;
  sound: SoundMutationResult;
}): ProtocolRuleLog {
  const rules: ProtocolRuleLog = [];
  const { word, summary, sound } = params;
  const vp = (summary.voicePath || []).join("");

  rules.push(`WORD="${word}"`);
  rules.push(`VOICE_PATH="${vp}"`);

  if (vp.includes("A") && vp.includes("E")) {
    rules.push("RULE: A+E → Truth driving Expansion");
  }
  if (vp.includes("U") && vp.includes("I")) {
    rules.push("RULE: U+I → Unity seeking Insight");
  }
  if (vp.includes("O")) {
    rules.push("RULE: O present → Mediator / Balance");
  }

  for (const r of sound.rulesApplied) {
    rules.push(`MUTATION:${r}`);
  }

  return rules;
}

/**
 * High-level convenience function:
 * given a word + Seven-Voices summary, compute the
 * symbolic core view.
 */
export function computeSymbolicCore(input: {
  word: string;
  alphabet?: string;
  summary: SevenVoicesSummary;
}): SymbolicCoreResult {
  const { word, alphabet, summary } = input;

  const sound = applySoundMutations(word);
  const genderFlow = computeGenderFlow(summary);
  const functionalTriplet = deriveFunctionalTriplet(word, summary);
  const protocolRules = logProtocolRules({ word, summary, sound });

  return {
    word,
    alphabet,
    sevenVoices: summary,
    genderFlow,
    functionalTriplet,
    soundMutations: sound,
    protocolRules,
  };
}

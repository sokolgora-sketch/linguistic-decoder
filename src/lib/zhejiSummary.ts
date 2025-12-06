// src/lib/zhejiSummary.ts
// Zheji structural overlay for the UI – reads from AnalyzeWordResultUI only,
// no changes to the engine or API.

import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import type { Vowel } from "@/core/sevenVowelsCore";
import {
  manifestTrait,
  getTensionScore,
  SEVEN_VOWELS_MANIFEST,
  type VowelTrait,
} from "@/core/sevenVowelsTraits";

// Same polarity vocabulary as sevenVowelsTraits.ts
export type RootPolarity = "Centripetal" | "Centrifugal" | "Static";

export interface ZhejiSummaryUI {
  rawVowelPath: string;
  rootPolarity: RootPolarity;
  tensionPath: number[];
  totalTensionScore: number;
  functionalStatement: string;
  subjectRole: string;
  objectRole: string;
  modifierRole: string;
  snippet: string;
}

const VOWEL_CHARS = new Set<string>(["A", "E", "I", "O", "U", "Y", "Ë"]);

function parseVowelPath(path: string | null | undefined): Vowel[] {
  if (!path) return [];

  // This regex now correctly handles spaces around the arrow.
  const vowels = path.split("→").map(v => v.trim());
  const result: Vowel[] = [];

  for (const ch of vowels) {
    if (VOWEL_CHARS.has(ch)) {
      result.push(ch as Vowel);
    }
  }

  return result;
}

function computeRootPolarityFromVowels(vowels: Vowel[]): RootPolarity {
  if (!vowels.length) return "Static";
  let score = 0;
  for (const v of vowels) {
    const trait = manifestTrait(v);
    if (trait.polarity === "Centripetal") score -= 1;
    else if (trait.polarity === "Centrifugal") score += 1;
  }
  if (score > 0) return "Centrifugal";
  if (score < 0) return "Centripetal";
  return "Static";
}

function computeTensionPath(vowels: Vowel[]): number[] {
  if (vowels.length < 2) return [];
  const out: number[] = [];
  for (let i = 0; i < vowels.length - 1; i++) {
    out.push(getTensionScore(vowels[i], vowels[i + 1]));
  }
  return out;
}

function buildFunctionalStatement(
  vowels: Vowel[],
  traits: Record<Vowel, VowelTrait>
): string {
  if (!vowels || vowels.length === 0) {
    return "The path is empty.";
  }
  const roles = vowels.map((v) => traits[v].zhejiFunctionalRole);
  if (roles.length === 1) {
    return `The path is defined by ${roles[0]}.`;
  }
  const start = roles.slice(0, -1).join(", then ");
  const end = roles[roles.length - 1];
  return `The path begins with ${start}, and resolves into ${end}.`;
}

function buildRoles(
  vowelPath: Vowel[],
  rootPolarity: RootPolarity,
  tensionPath: number[]
): { subjectRole: string; objectRole: string; modifierRole: string } {
  const traits = SEVEN_VOWELS_MANIFEST.traits;
  const n = vowelPath.length;

  let subjectRole = "—";
  if (n > 0) {
    const firstVowel = vowelPath[0];
    const role = traits[firstVowel].zhejiFunctionalRole;
    subjectRole = `${role} (${firstVowel})`;
  }

  let objectRole = "—";
  if (n > 1) {
    const lastVowel = vowelPath[n - 1];
    const role = traits[lastVowel].zhejiFunctionalRole;
    objectRole = `${role} (${lastVowel})`;
  } else if (n === 1) {
    objectRole = subjectRole;
  }

  const steps = tensionPath.length;
  const modifierRole = `${rootPolarity} • ${steps}-step path`;

  return { subjectRole, objectRole, modifierRole };
}

export function buildZhejiSummary(
  result: AnalyzeWordResultUI | null
): ZhejiSummaryUI | null {
  if (!result?.primaryPath?.voicePath) return null;

  const vowelPath = parseVowelPath(result.primaryPath.voicePath);
  if (vowelPath.length === 0) return null;

  const { traits } = SEVEN_VOWELS_MANIFEST;

  const rootPolarity = computeRootPolarityFromVowels(vowelPath);
  const tensionPath = computeTensionPath(vowelPath);
  const totalTensionScore = tensionPath.reduce((sum, t) => sum + t, 0);
  const functionalStatement = buildFunctionalStatement(vowelPath, traits);
  const { subjectRole, objectRole, modifierRole } = buildRoles(
    vowelPath,
    rootPolarity,
    tensionPath
  );
  
  const snippet = `Zheji: ${subjectRole} → ${objectRole}; ${modifierRole}; [${totalTensionScore}] total tension.`;

  return {
    rawVowelPath: vowelPath.join(""),
    rootPolarity,
    tensionPath,
    totalTensionScore,
    functionalStatement,
    subjectRole,
    objectRole,
    modifierRole,
    snippet,
  };
}

// --- Inversion helpers (UI-only, pure functions) ---

export function invertRootPolarity(polarity: RootPolarity): RootPolarity {
  if (polarity === "Centripetal") return "Centrifugal";
  if (polarity === "Centrifugal") return "Centripetal";
  return "Static";
}

// Very simple, deterministic inversion of the sentence.
// v1: if we recognise the "From X towards Y" or
//     "The path begins with X, and resolves into Y." pattern, we flip.
// otherwise: just prefix "Inverted:".
export function buildInvertedStatement(statement: string): string {
  const fromMatch = statement.match(/^From (.+) towards (.+)\.?$/);
  if (fromMatch) {
    const [, from, to] = fromMatch;
    return `From ${to} towards ${from}.`;
  }

  const beginsMatch = statement.match(
    /^The path begins with (.+), and resolves into (.+)\.?$/
  );
  if (beginsMatch) {
    const [, from, to] = beginsMatch;
    return `The path begins with ${to}, and resolves into ${from}.`;
  }

  return `Inverted: ${statement}`;
}

export function buildZhejiSnippet(view: "normal" | "inverted", base: ZhejiSummaryUI): string {
  if (view === 'normal') {
    return base.snippet;
  }
  
  const invertedPolarity = invertRootPolarity(base.rootPolarity);
  const invertedModifier = base.modifierRole.replace(base.rootPolarity, invertedPolarity);
  
  return `Zheji: ${base.objectRole} → ${base.subjectRole}; ${invertedModifier}; [${base.totalTensionScore}] total tension.`;
}

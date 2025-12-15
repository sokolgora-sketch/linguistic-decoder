
import {
  SevenVoice,
  PatternFamily,
  MatchStrength,
  SEVEN_VOICES_PATTERNS,
} from "./sevenVoicesPatterns";

export interface PatternMatch {
  patternId: string;
  family: PatternFamily;
  strength: MatchStrength;
  reason: string;
}

export interface FamilyHit {
  family: PatternFamily;
  strongest: MatchStrength;
  patterns: string[]; // list of pattern IDs
}

export interface StressTestResult {
  word: string;
  language: string;
  vowels: SevenVoice[];
  vowelPath: string; // e.g. "U → I"
  matches: PatternMatch[];
  families: FamilyHit[];
  tensions: string[]; // keep this simple for now
}

// ---- Helpers ----

function arrayEquals<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

function isPrefix<T>(prefix: T[], arr: T[]): boolean {
  if (prefix.length > arr.length || prefix.length === 0) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== arr[i]) return false;
  }
  return true;
}

function isSuffix<T>(suffix: T[], arr: T[]): boolean {
  if (suffix.length > arr.length || suffix.length === 0) return false;
  const offset = arr.length - suffix.length;
  for (let i = 0; i < suffix.length; i++) {
    if (suffix[i] !== arr[i + offset]) return false;
  }
  return true;
}

const STRENGTH_ORDER: MatchStrength[] = ["weak", "medium", "strong"];
function getStrongest(s1: MatchStrength, s2: MatchStrength): MatchStrength {
    return STRENGTH_ORDER.indexOf(s1) > STRENGTH_ORDER.indexOf(s2) ? s1 : s2;
}


// ---- Main Implementation ----

export function runSevenVoicesStressTest(input: {
  word: string;
  language: string;
  primaryVoicePath: string; // like "U → I"
}): StressTestResult {
  const { word, language, primaryVoicePath } = input;

  const validVoices: ReadonlyArray<SevenVoice> = ["A", "E", "I", "O", "U", "Y", "Ë"];
  const vowels = primaryVoicePath
    .split("→")
    .map((v) => v.trim())
    .filter((v): v is SevenVoice => (validVoices as string[]).includes(v));

  const matches: PatternMatch[] = [];
  let hasStrongMatch = false;

  for (const pattern of SEVEN_VOICES_PATTERNS) {
    if (arrayEquals(vowels, pattern.template)) {
      matches.push({
        patternId: pattern.id,
        family: pattern.family,
        strength: "strong",
        reason: `Vowel path exactly matches template [${pattern.template.join(" → ")}].`,
      });
      hasStrongMatch = true;
    } else if (
      !arrayEquals(vowels, pattern.template) &&
      (isPrefix(pattern.template, vowels) || isSuffix(pattern.template, vowels))
    ) {
      matches.push({
        patternId: pattern.id,
        family: pattern.family,
        strength: "medium",
        reason: `Pattern template [${pattern.template.join(" → ")}] is a prefix or suffix of the vowel path.`,
      });
    }
  }

  const familyMap = new Map<PatternFamily, { strongest: MatchStrength; patterns: Set<string> }>();
  for (const match of matches) {
    const existing = familyMap.get(match.family);
    if (!existing) {
      familyMap.set(match.family, { strongest: match.strength, patterns: new Set([match.patternId]) });
    } else {
      existing.patterns.add(match.patternId);
      existing.strongest = getStrongest(existing.strongest, match.strength);
    }
  }

  const families: FamilyHit[] = Array.from(familyMap.entries()).map(([family, hit]) => ({
    family,
    strongest: hit.strongest,
    patterns: Array.from(hit.patterns),
  }));

  const tensions: string[] = [];
  if (!hasStrongMatch && vowels.length > 0) {
    tensions.push("No strong pattern match found for this vowel path.");
  }

  return {
    word,
    language,
    vowels,
    vowelPath: primaryVoicePath,
    matches,
    families,
    tensions,
  };
}

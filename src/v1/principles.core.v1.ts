import type { SevenVowel } from "./math7.core.v1";

/**
 * Principle IDs: lock these; never “guess” at runtime.
 * If you already have principle naming elsewhere, we can map to those later.
 */
export type PrincipleId =
  | "TRUTH"            // A (1)
  | "EXPANSION"        // E (2)
  | "INSIGHT"          // I (3)
  | "BALANCE"          // O (4)
  | "UNITY"            // U (5)
  | "NETWORK_INTEGRITY"// Y (6)
  | "EVOLUTION";       // Ë (7)

export function principleFromVowel(v: SevenVowel): PrincipleId {
  switch (v) {
    case "A": return "TRUTH";
    case "E": return "EXPANSION";
    case "I": return "INSIGHT";
    case "O": return "BALANCE";
    case "U": return "UNITY";
    case "Y": return "NETWORK_INTEGRITY";
    case "Ë": return "EVOLUTION";
  }
}

export function principlesPathFromVowels(vowels: SevenVowel[]): PrincipleId[] {
  return vowels.map(principleFromVowel);
}

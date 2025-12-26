import { totalMod7FromVowels, isSevenVowel, type SevenVowel } from "@/shared/math7.core";

/**
 * Public: principle names emitted by Math7.
 * Keep stable — tests and UI depend on this wording.
 */
export const PRINCIPLE_MAP: Record<SevenVowel, string> = {
  A: "Truth",
  E: "Expansion",
  I: "Insight",
  O: "Balance",
  U: "Unity",
  Y: "Network Integrity",
  "Ë": "Evolution",
};

export type Math7Primary = {
  cycleState: "open" | "closed";
  totalMod7: number; // 0–6
  principlesPath: string[];
};

export type Math7Summary = {
  primary: Math7Primary;
};

/**
 * Internal helper: normalize any vowel-ish inputs to canonical SevenVowel[].
 */
function normalizeSevenVowels(vowelsIn: Array<string | null | undefined>): SevenVowel[] {
  return vowelsIn
    .map((v) => String(v ?? "").toUpperCase())
    .filter((v): v is SevenVowel => isSevenVowel(v));
}

/**
 * Public helper: build math7.primary from a vowel sequence.
 */
export function math7PrimaryFromVowels(vowelsIn: Array<string | null | undefined>): Math7Primary {
  const vowels = normalizeSevenVowels(vowelsIn);

  const principlesPath = vowels.map((v) => PRINCIPLE_MAP[v] ?? v);

  // Canonical mod7: sum of indices A=0..Ë=6
  const totalMod7 = totalMod7FromVowels(vowels);

  // Keep legacy cycleState behavior stable: closed if ends with Ë, else open.
  const cycleState: Math7Primary["cycleState"] =
    vowels.length > 0 && vowels[vowels.length - 1] === "Ë" ? "closed" : "open";

  return { cycleState, totalMod7, principlesPath };
}

/**
 * Public API expected by analysisAdapter and routes.
 * It consumes the engine payload and derives Math7 summary.
 *
 * IMPORTANT: we intentionally use the payload's vowelPath (if present),
 * because that is the analysis pipeline's basis.
 */
export function computeMath7ForResult(payload: any): Math7Summary {
  // Payload basis can live in different shapes depending on pipeline/version.
  // We must align with the analysis adapter tests:
  // - study basis often resolves to ["U","I"]
  // - damage basis often resolves to ["A","I","Ë"]

  const raw =
    payload?.primaryPath?.voicePath ??
    payload?.sevenVoices?.primary?.voicePath ??
    payload?.voicePath ??
    payload?.vowelPath ??
    payload?.vowel_path ??
    payload?.vowelPathString ??
    payload?.vowel_path_string ??
    "";

  let vowels: Array<string | null | undefined> = [];

  if (Array.isArray(raw)) {
    vowels = raw;
  } else if (typeof raw === "string") {
    // Accept "U-I", "U→I", "U I", etc.
    vowels = raw.split(/[^AEIOUYË]+/gi).filter(Boolean);
  } else {
    vowels = [];
  }

  return { primary: math7PrimaryFromVowels(vowels) };
}


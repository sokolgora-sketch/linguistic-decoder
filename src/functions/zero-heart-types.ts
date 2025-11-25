// src/functions/zero-heart-types.ts
// Shared types for ZË-RO Layer 0 (Input & Family),
// Layer 1 (Heart / Seven Principles core),
// and Layer 2 (Mind / Deep Roots).

// --- Core enums / primitives ---

export type SevenVoice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export type HeartMode = "STRICT" | "EXPLORATORY";

export type LightDarkTone = "LIGHT" | "DARK" | "MIXED" | "UNKNOWN";

export type VibrationalTone = "LOW" | "MID" | "HIGH" | "BALANCED";

export type RootRole = "ACTION" | "DOMAIN" | "RESULT";

// --- Layer 0: Input & Family Finder ---

/**
 * Raw pre-processing result:
 * just normalization + family forms.
 * No etymology decisions here.
 */
export interface Layer0Output {
  /** Original input as typed by the user. */
  input_word: string;
  /** Normalized word: trimmed, lowercased, punctuation stripped. */
  normalized: string;
  /** Optional lightweight guess, e.g. "English", "Italian". */
  language_guess?: string;
  /** Nearby forms that sound / look related (no truth claim). */
  family_forms: string[];
}

// --- Layer 1: Heart (Seven Principles core) ---

/**
 * Input to the Heart layer. The Heart is allowed
 * to look at the family forms but not at history chains.
 */
export interface HeartInput {
  input_word: string;
  family_forms: string[];
  mode: HeartMode;
}

/**
 * Smallest unit of a candidate word in the Heart layer:
 * each chunk gets a role in the triad: ACTION / DOMAIN / RESULT.
 */
export interface HeartChunk {
  role: RootRole;     // "ACTION" | "DOMAIN" | "RESULT"
  form: string;       // e.g. "da", "ma", "gje"
  gloss?: string;     // optional functional label, e.g. "split", "law"
}

/**
 * One candidate decomposition that passed the Seven-Principles filter.
 */
export interface HeartCandidate {
  /** Surface language label for this candidate, if known. */
  language?: string;                  // "English", "Latin", "Albanian", ...
  /** Surface form this candidate is built from. */
  form: string;                       // "damage", "damnum", "dëm", ...
  /** Decomposition into ACTION / DOMAIN / RESULT pieces. */
  decomposition: HeartChunk[];
  /** Vowel path for this candidate. */
  vowel_path: SevenVoice[];
  /** Short strict functional sentence for this candidate. */
  functional_statement: string;

  /** Overall polarity and vibrational tone, if computed. */
  light_dark?: LightDarkTone;
  vibrational_tone?: VibrationalTone;

  /** Optional extra notes, e.g. ["strong fit", "dialectal"]. */
  signals?: string[];
}

/**
 * Canonical output of the Heart layer for a word.
 * This is the "law" that Layer 2 (Mind) must obey.
 */
export interface HeartResult {
  meta: {
    engine_version: string;
    mode: HeartMode;
    input_word: string;
    timestamp_iso: string;
  };

  /** Single canonical verdict of what the word DOES. */
  core_function: string;

  /** Core vowel motif (Seven Voices path) chosen by the Heart. */
  core_vowel_motif: SevenVoice[];

  /** Overall polarity and vibrational tone. */
  light_dark: LightDarkTone;
  vibrational_tone: VibrationalTone;

  /**
   * All candidates that PASSED the Seven-Principles constraints.
   * No ranking / winner here; UI can display them all.
   */
  candidates: HeartCandidate[];

  /** Optional Heart warnings, e.g. "weak fit", "ambiguous". */
  warnings?: string[];
}

// --- Layer 2: Mind & Deep Roots ---

/**
 * Input that the Mind / Deep Roots layer receives.
 * It is not allowed to contradict these fields.
 */
export interface MindInput {
  heart: HeartResult;
}

/**
 * One micro-root piece in the deep etymology view.
 */
export interface DeepRootPiece {
  role: RootRole;          // ACTION | DOMAIN | RESULT
  block: string;           // "da", "ma", "gje", "ligj", "ter", "fi", ...
  language: string;        // "Albanian", "Greek", "Latin", ...
  meaning: string;         // "to split", "law", "darkness", "thing", ...
  notes?: string;          // "everyday Albanian verb", "borrowed", etc.
}

/**
 * Examples of how this deep root shows up in modern usage.
 */
export interface DeepRootExample {
  language: string;        // e.g. "Albanian", "English"
  form: string;            // e.g. "dëm", "damage"
  gloss: string;           // short meaning
}

/**
 * Canonical output of the Mind / Deep Roots layer.
 * It must strictly respect the Heart result.
 */
export interface DeepRootResult {
  // These four are copied directly from HeartResult.
  core_function: string;
  core_vowel_motif: SevenVoice[];
  light_dark: LightDarkTone;
  vibrational_tone: VibrationalTone;

  /** Usually 2–4 pieces, covering ACTION / DOMAIN / RESULT. */
  pieces: DeepRootPiece[];

  /**
   * 1–2 sentence explanation that ties ACTION / DOMAIN / RESULT together.
   * Example (damage): "Split something from its wholeness and leave the thing
   * in a harmed state."
   */
  explanation_short: string;

  /** Optional list of concrete modern examples. */
  examples_modern_usage: DeepRootExample[];
}

/**
 * Extension hook for any existing "Mind view" / summary object
 * so the front-end can optionally render Deep Roots.
 */
export interface MindView {
  deepRoot?: DeepRootResult;
}

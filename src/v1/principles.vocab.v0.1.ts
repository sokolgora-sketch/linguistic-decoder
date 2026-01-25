import type { SevenVowel } from "./math7.core.v1";
import type { PrincipleId } from "./principles.core.v1";

/**
 * Canonical vocabulary v0.1
 * - PrincipleId: stable machine IDs (ALL_CAPS)
 * - PrincipleLabel: stable display labels (Title-Case)
 *
 * Rule: UI/VM renders labels; engine payload may carry IDs or labels during migration.
 */
export type PrincipleLabel =
  | "Truth"
  | "Expansion"
  | "Insight"
  | "Balance"
  | "Unity"
  | "Reflection"
  | "Evolution";

export const PRINCIPLES_V0_1: ReadonlyArray<{
  vowel: SevenVowel;
  id: PrincipleId;
  label: PrincipleLabel;
}> = [
  { vowel: "A", id: "TRUTH",      label: "Truth" },
  { vowel: "E", id: "EXPANSION",  label: "Expansion" },
  { vowel: "I", id: "INSIGHT",    label: "Insight" },
  { vowel: "O", id: "BALANCE",    label: "Balance" },
  { vowel: "U", id: "UNITY",      label: "Unity" },
  { vowel: "Y", id: "REFLECTION", label: "Reflection" },
  { vowel: "Ë", id: "EVOLUTION",  label: "Evolution" },
] as const;

const BY_ID = new Map<PrincipleId, PrincipleLabel>(PRINCIPLES_V0_1.map(p => [p.id, p.label]));
const BY_LABEL = new Map<PrincipleLabel, PrincipleId>(PRINCIPLES_V0_1.map(p => [p.label, p.id]));
const BY_VOWEL = new Map<SevenVowel, { id: PrincipleId; label: PrincipleLabel }>(
  PRINCIPLES_V0_1.map(p => [p.vowel, { id: p.id, label: p.label }])
);

export function labelFromPrincipleId(id: PrincipleId): PrincipleLabel {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown PrincipleId: ${id}`);
  return v;
}

export function idFromPrincipleLabel(label: PrincipleLabel): PrincipleId {
  const v = BY_LABEL.get(label);
  if (!v) throw new Error(`Unknown PrincipleLabel: ${label}`);
  return v;
}

export function principleFromVowelVocab(v: SevenVowel): { id: PrincipleId; label: PrincipleLabel } {
  const v0 = BY_VOWEL.get(v);
  if (!v0) throw new Error(`Unknown SevenVowel: ${v}`);
  return v0;
}

/**
 * Normalizer: accepts mixed inputs during migration:
 * - IDs: "UNITY"
 * - Labels: "Unity"
 * - Vowels: "U"
 *
 * Returns display labels (Title-Case) for UI/telemetry.
 */
export function normalizePrinciplesToLabels(xs: string[]): PrincipleLabel[] {
  const out: PrincipleLabel[] = [];
  for (const raw of xs) {
    if (!raw || typeof raw !== "string") continue;

    // 1) ID?
    if ((BY_ID as any).has(raw)) {
      out.push((BY_ID as any).get(raw));
      continue;
    }

    // 2) Label?
    if ((BY_LABEL as any).has(raw)) {
      out.push(raw as PrincipleLabel);
      continue;
    }

    // 3) Vowel?
    if ((BY_VOWEL as any).has(raw)) {
      out.push((BY_VOWEL as any).get(raw).label);
      continue;
    }

    // 4) Unknown string: ignore (do not poison UI)
  }
  return out;
}

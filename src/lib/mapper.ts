
import type { Vowel } from "@/shared/engineShape";
import { logError } from "./logError";
import { mapWordToLanguageFamiliesLocal, type FamilyScore } from "./mapper/localMapper";
// import { mapWithAI } from "./remoteMapper" // if you have one

type LanguageFamily = {
  familyId: 'albanian'|'latin'|'proto-indo-european'|'unknown';
  label: string;
  confidence: number;      // 0..1
  rationale: string[];
  dialect?: 'geg'|'tosk';
};


function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }

function toLanguageFamily(f: any): LanguageFamily | null {
  if (!f || typeof f.label !== 'string') return null;
  const id = f.label.toLowerCase().replace(/ /g, '_');
  return {
    familyId: (id as any),
    label: f.label,
    confidence: clamp01((Number(f.score) || 0) / 100),
    rationale: Array.isArray(f.rationale) ? f.rationale : [],
    dialect: f.dialect,
  };
}

export async function mapWordToLanguageFamilies(
  word: string,
  voicePath: readonly (string)[],
  useAi = false
): Promise<LanguageFamily[]> {
  // local first
  const localScores = mapWordToLanguageFamiliesLocal(word, voicePath as string[]);
  const locals = (localScores ?? []).map(toLanguageFamily).filter(Boolean) as LanguageFamily[];

  if (!useAi) return locals.length ? locals : [{ familyId: 'unknown', label: 'Unknown', confidence: 0, rationale: ['no local mapping'] }];

  // (AI path can merge later; for now keep deterministic)
  return locals.length ? locals : [{ familyId: 'unknown', label: 'Unknown', confidence: 0, rationale: ['no local mapping'] }];
}

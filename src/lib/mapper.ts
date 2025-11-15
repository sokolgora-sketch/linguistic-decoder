import type { LanguageFamily, Vowel } from "@/shared/engineShape";
import { logError } from "./logError";
import { mapWordToLanguageFamiliesLocal, type FamilyScore } from "./mapper/localMapper";
// import { mapWithAI } from "./remoteMapper" // if you have one

function toLanguageFamily(f: FamilyScore): LanguageFamily {
  let rationale = f.notes?.join("; ") ?? "";
  if (f.dialect) rationale += ` (dialect: ${f.dialect})`;

  return {
    familyId: f.family.toLowerCase().replace(/ /g, "_") as any,
    label: f.family,
    confidence: f.score / 100,
    rationale,
    forms: [], // Local mapper doesn't produce forms
    signals: f.notes,
  };
}

export async function mapWordToLanguageFamilies(
  word: string,
  voicePath: Vowel[],
  useAi = false
): Promise<LanguageFamily[]> {
  const localResults = mapWordToLanguageFamiliesLocal(word, voicePath).map(toLanguageFamily);
  if (!useAi) return localResults;

  try {
    // const ai = await mapWithAI(word, voicePath); // your existing remote
    // return ai?.length ? ai : local;
    return localResults; // keep deterministic for now; re-enable AI when ready
  } catch (e: any) {
    logError({where: "mapper-ai-fallback", message: e.message, detail: {word}});
    return localResults;
  }
}

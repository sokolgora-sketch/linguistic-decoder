import type { EnginePayload, LanguageFamily } from "@/shared/engineShape";
import { logError } from "./logError";
import { mapWordToLanguageFamilies as mapWithAI } from "@/ai/flows/map-word-to-language-families";
import { mapWordToLanguageFamiliesLocal, type FamilyScore } from "./mapper/localMapper";
import { toMappingRecord } from "./schemaAdapter";

// Optional remote mapper (e.g., Cloud Function or Next API). Leave blank to use local.
const REMOTE_URL = process.env.NEXT_PUBLIC_MAPPER_URL; // e.g., https://<region>-<proj>.cloudfunctions.net/mapFamilies

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

export async function mapWordToLanguageFamilies(engine: EnginePayload, useAi = false): Promise<LanguageFamily[]> {
  const localFamilies = mapWordToLanguageFamiliesLocal(engine.word, engine.primaryPath.voicePath);
  
  if (!useAi) {
    return localFamilies.map(toLanguageFamily);
  }

  try {
    const aiResult = await mapWithAI(toMappingRecord(engine));

    if (aiResult && isObj(aiResult) && isArray(aiResult.candidates_map)) {
        // This is a rough adapter. Your AI flow needs to return a compatible shape.
        // For now, let's assume it returns something we can work with.
        const aiFamilies = adaptAiResponse(aiResult.candidates_map);
        if (aiFamilies.length > 0) {
          return aiFamilies;
        }
    }
    // Fallback to local if AI fails or returns empty
    return localFamilies.map(toLanguageFamily);
  } catch (e: any) {
    logError({ where: "mapper-ai-error", message: e.message, detail: { word: engine.word, stack: e.stack } });
    return localFamilies.map(toLanguageFamily); // Fallback on error
  }
}


// --- Helpers for AI response ---
function isArray(x:any){ return Array.isArray(x); }
function isObj(x:any){ return x && typeof x === 'object' && !isArray(x); }

function adaptAiResponse(candidates: any): LanguageFamily[] {
  if (!isObj(candidates)) return [];

  const families: LanguageFamily[] = [];
  for (const familyName in candidates) {
    const items = candidates[familyName];
    if (!isArray(items) || items.length === 0) continue;

    const bestItem = items[0]; // Take the first form/map as representative
    
    families.push({
      familyId: familyName.toLowerCase() as any,
      label: familyName,
      confidence: 0.8, // AI results are "confident" by nature
      rationale: `AI mapping: form '${bestItem.form}' maps to '${bestItem.map?.join(" + ")}'`,
      forms: items.map((i:any) => i.form),
      signals: ["ai-mapped"],
    });
  }
  return families;
}

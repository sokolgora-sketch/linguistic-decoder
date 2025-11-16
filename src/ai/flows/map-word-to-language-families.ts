
'use server';

/**
 * @fileOverview Maps a solved voice path to potential language families using GenAI.
 *
 * - mapWordToLanguageFamilies - A function that takes a word and returns potential language families.
 * - MapWordToLanguageFamiliesInput - The input type for the mapWordToLanguageFamilies function.
 * - MapWordToLanguageFamiliesOutput - The return type for the mapWordToLanguageFamilies function.
 */

import {ai, MODELS} from '@/ai/genkit';
import {z} from 'genkit';
import { toMappingRecord, MappingRecord } from '@/lib/schemaAdapter';

const MapWordToLanguageFamiliesInputSchema = z.object({
  word: z.string().describe('The word to analyze.'),
  voice_path: z.array(z.string()).describe('The solved voice path of a word.'),
  ring_path: z.array(z.number()).describe('The ring path of a word.'),
  level_path: z.array(z.number()).describe('The level path of a word.'),
  ops: z.array(z.string()).describe('The operations performed on the word.'),
  signals: z.array(z.string()).optional().describe('Any signals from the solver.'),
});
export type MapWordToLanguageFamiliesInput = z.infer<typeof MapWordToLanguageFamiliesInputSchema>;

const MapWordToLanguageFamiliesOutputSchema = z.object({
  candidates_map: z.any().describe('Potential language families for the given voice path. Keys are family names, values are arrays of objects with {form, map, functional}.'),
  signals: z.array(z.string()).optional().describe('Any signals from the language mapping.'),
});
export type MapWordToLanguageFamiliesOutput = z.infer<typeof MapWordToLanguageFamiliesOutputSchema>;

export async function mapWordToLanguageFamilies(
  input: MappingRecord
): Promise<MapWordToLanguageFamiliesOutput> {
  return mapWordToLanguageFamiliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mapWordToLanguageFamiliesPrompt',
  input: {schema: MapWordToLanguageFamiliesInputSchema},
  output: {schema: MapWordToLanguageFamiliesOutputSchema},
  model: MODELS[0],
  prompt: `ROLE: Map a computed Seven-Voices path to language candidate families.
NEVER change the path. No rankings. No stories. Output ONLY JSON.

SEVEN VOICES (for wording only)
A=Action, E=Expansion, I=Insight, O=Mediator, U=Breath/Impulse, Y=Network/Integrity, Ë=Unit/Mother.

FAMILIES TO CONSIDER (include only if plausible):
Albanian (Gegë/Tosk), Greek, Latin, Sanskrit, Semitic, Slavic, Germanic/English, PIE, Sumerian.

ALLOWED NOTES:
- You may mention soft morphs: g↔gj, s↔sh, optional h/j around gu/gi, final -a/-ë.
- Do NOT invent historical chains; if unsure, omit that family.

OUTPUT SCHEMA (exact):
{
  "candidates_map": {
    "Albanian": [
      { "form": "string", "map": ["smallest parts…"], "functional": "Action | Instrument/Function | Unit/Result" }
    ],
    "Greek": [ { "form": "string", "map": ["…"], "functional": "…" } ],
    "Latin": [ { "form": "string", "map": ["…"], "functional": "…" } ]
  },
  "signals": ["short notes if any"]
}

STYLE:
- Deterministic, concise, JSON only. No prose outside JSON.

INPUT YOU RECEIVE (actual):
{{{json this}}}

Return ONLY the JSON per schema.`,
});

const mapWordToLanguageFamiliesFlow = ai.defineFlow(
  {
    name: 'mapWordToLanguageFamiliesFlow',
    inputSchema: MapWordToLanguageFamiliesInputSchema,
    outputSchema: MapWordToLanguageFamiliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

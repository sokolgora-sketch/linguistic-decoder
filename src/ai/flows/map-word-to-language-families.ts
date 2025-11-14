
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
  candidates_map: z.any().describe('Potential language families for the given voice path.'),
  signals: z.array(z.string()).optional().describe('Any signals from the language mapping.'),
});
export type MapWordToLanguageFamiliesOutput = z.infer<typeof MapWordToLanguageFamiliesOutputSchema>;

export async function mapWordToLanguageFamilies(
  input: MapWordToLanguageFamiliesInput
): Promise<MapWordToLanguageFamiliesOutput> {
  return mapWordToLanguageFamiliesFlow(input);
}

const promptConfig = {
  name: 'mapWordToLanguageFamiliesPrompt',
  input: {schema: MapWordToLanguageFamiliesInputSchema},
  output: {schema: MapWordToLanguageFamiliesOutputSchema},
  prompt: `ROLE: Map a computed Seven-Voices path to language candidate families.\nNEVER change the path. No rankings. No stories. Output ONLY JSON.\n\nSEVEN VOICES (for wording only)\nA=Action, E=Expansion, I=Insight, O=Mediator, U=Breath/Impulse, Y=Network/Integrity, Ë=Unit/Mother.\n\nFAMILIES TO CONSIDER (include only if plausible):\nAlbanian (Gegë/Tosk), Greek, Latin, Sanskrit, Semitic, Slavic, Germanic/English, PIE, Sumerian.\n\nALLOWED NOTES:\n- You may mention soft morphs: g↔gj, s↔sh, optional h/j around gu/gi, final -a/-ë.\n- Do NOT invent historical chains; if unsure, omit that family.\n\nOUTPUT SCHEMA (exact):\n{\n  "candidates_map": {\n    "Albanian": [\n      { "form": "string", "map": ["smallest parts…"], "functional": "Action | Instrument/Function | Unit/Result" }\n    ],\n    "Greek": [ { "form": "string", "map": ["…"], "functional": "…" } ],\n    "Latin": [ { "form": "string", "map": ["…"], "functional": "…" } ]\n  },\n  "signals": ["short notes if any"]\n}\n\nSTYLE:\n- Deterministic, concise, JSON only. No prose outside JSON.\n\nINPUT YOU RECEIVE (actual):\n{{{json this}}}
\nReturn ONLY the JSON per schema.`,
};

const mapWordToLanguageFamiliesFlow = ai.defineFlow(
  {
    name: 'mapWordToLanguageFamiliesFlow',
    inputSchema: MapWordToLanguageFamiliesInputSchema,
    outputSchema: MapWordToLanguageFamiliesOutputSchema,
  },
  async input => {
    let lastError: any;
    for (const model of MODELS) {
      try {
        const {output} = await ai.generate({
          model,
          prompt: promptConfig.prompt,
          input,
          output: {
            format: 'json',
            schema: MapWordToLanguageFamiliesOutputSchema,
          },
        });
        return output;
      } catch (e) {
        lastError = e;
        console.warn(`Model ${model.name} failed, trying next model.`, e);
      }
    }
    throw lastError;
  }
);

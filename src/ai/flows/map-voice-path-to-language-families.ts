'use server';

/**
 * @fileOverview Maps a solved voice path to potential language families using GenAI.
 *
 * - mapVoicePathToLanguageFamilies - A function that takes a voice path and returns potential language families.
 * - MapVoicePathToLanguageFamiliesInput - The input type for the mapVoicePathToLanguageFamilies function.
 * - MapVoicePathToLanguageFamiliesOutput - The return type for the mapVoicePathToLanguageFamilies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MapVoicePathToLanguageFamiliesInputSchema = z.object({
  voicePath: z.string().describe('The solved voice path of a word.'),
});
export type MapVoicePathToLanguageFamiliesInput = z.infer<typeof MapVoicePathToLanguageFamiliesInputSchema>;

const MapVoicePathToLanguageFamiliesOutputSchema = z.object({
  languageFamilies: z.array(z.string()).describe('Potential language families for the given voice path.'),
});
export type MapVoicePathToLanguageFamiliesOutput = z.infer<typeof MapVoicePathToLanguageFamiliesOutputSchema>;

export async function mapVoicePathToLanguageFamilies(
  input: MapVoicePathToLanguageFamiliesInput
): Promise<MapVoicePathToLanguageFamiliesOutput> {
  return mapVoicePathToLanguageFamiliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mapVoicePathToLanguageFamiliesPrompt',
  input: {schema: MapVoicePathToLanguageFamiliesInputSchema},
  output: {schema: MapVoicePathToLanguageFamiliesOutputSchema},
  prompt: `You are an expert linguist. Given the solved voice path of a word, identify potential language families.

Voice Path: {{{voicePath}}}

Potential Language Families:`, // Prompt the model to list potential language families.
});

const mapVoicePathToLanguageFamiliesFlow = ai.defineFlow(
  {
    name: 'mapVoicePathToLanguageFamiliesFlow',
    inputSchema: MapVoicePathToLanguageFamiliesInputSchema,
    outputSchema: MapVoicePathToLanguageFamiliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

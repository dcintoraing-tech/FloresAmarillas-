'use server';
/**
 * @fileOverview This file defines a Genkit flow for customizing animated flower styles.
 *
 * - customizeAnimationStyle - A function that interprets user text descriptions to adjust animation patterns.
 * - AnimationStyleCustomizationInput - The input type for the customizeAnimationStyle function.
 * - AnimationStyleCustomizationOutput - The return type for the customizeAnimationStyle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnimationStyleCustomizationInputSchema = z.object({
  description: z.string().describe('A natural language description of the desired animation style (e.g., \'gentle breeze\', \'lively dance\').'),
});
export type AnimationStyleCustomizationInput = z.infer<typeof AnimationStyleCustomizationInputSchema>;

const AnimationStyleCustomizationOutputSchema = z.object({
  speedMultiplier: z.number().min(0.5).max(2.0).describe('A multiplier for the animation speed. 1.0 is normal speed. Values greater than 1.0 make it faster, less than 1.0 make it slower.'),
  swayMagnitude: z.number().min(0.0).max(1.0).describe('The intensity of the flowers swaying motion. 0.0 for no sway, 1.0 for strong sway.'),
  driftDirection: z.enum(['none', 'left', 'right', 'up', 'down', 'random']).describe('The primary direction the flowers tend to drift. "none" for no drift.'),
  driftSpeed: z.number().min(0.0).max(1.0).describe('The speed at which flowers drift. 0.0 for no drift, 1.0 for fast drift.'),
  pulseEffect: z.number().min(0.0).max(1.0).describe('The intensity of a subtle pulsing/blooming effect. 0.0 for no pulse, 1.0 for noticeable pulse.'),
});
export type AnimationStyleCustomizationOutput = z.infer<typeof AnimationStyleCustomizationOutputSchema>;

export async function customizeAnimationStyle(input: AnimationStyleCustomizationInput): Promise<AnimationStyleCustomizationOutput> {
  return animationStyleCustomizationFlow(input);
}

const animationStyleCustomizationPrompt = ai.definePrompt({
  name: 'animationStyleCustomizationPrompt',
  input: { schema: AnimationStyleCustomizationInputSchema },
  output: { schema: AnimationStyleCustomizationOutputSchema },
  prompt: `You are an AI assistant tasked with translating natural language descriptions into animation parameters for animated yellow flowers.

Analyze the following description and provide concrete numerical and enum values for the animation parameters. Ensure the output strictly conforms to the provided JSON schema. If a parameter is not explicitly suggested by the description, use a neutral or default value (e.g., speedMultiplier: 1.0, swayMagnitude: 0.5, driftDirection: "none", driftSpeed: 0.0, pulseEffect: 0.0).

Here is the description:
"{{{description}}}"`,
});

const animationStyleCustomizationFlow = ai.defineFlow(
  {
    name: 'animationStyleCustomizationFlow',
    inputSchema: AnimationStyleCustomizationInputSchema,
    outputSchema: AnimationStyleCustomizationOutputSchema,
  },
  async (input) => {
    const { output } = await animationStyleCustomizationPrompt(input);
    return output!;
  },
);

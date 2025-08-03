
'use server';

/**
 * @fileOverview Provides AI-powered advice for a specific week of pregnancy.
 * 
 * - getPregnancyAdvice - A function that returns detailed information about a given week of gestation.
 * - GetPregnancyAdviceInput - The input type for the getPregnancyAdvice function.
 * - GetPregnancyAdviceOutput - The return type for the getPregnancyAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetPregnancyAdviceInputSchema = z.object({
  gestationalWeek: z.number().int().min(1).max(42).describe("The current week of pregnancy (gestational age)."),
});
export type GetPregnancyAdviceInput = z.infer<typeof GetPregnancyAdviceInputSchema>;

const GetPregnancyAdviceOutputSchema = z.object({
  trimester: z.number().int().min(1).max(3).describe("The current trimester."),
  babyDevelopment: z.string().describe("A summary of the baby's key development milestones for this week."),
  momChanges: z.string().describe("A summary of common physical and emotional changes for the mother this week."),
  nutritionTips: z.array(z.string()).describe("A list of 3-5 specific, actionable nutrition and food tips for this week."),
  vaccineInfo: z.string().describe("Information about any recommended vaccines or check-ups around this time."),
  generalTips: z.array(z.string()).describe("A list of 3-5 other helpful tips (e.g., exercise, sleep, preparation) for this week."),
  teratogenicityInfo: z.string().describe("An educational overview of teratogens and general risks during pregnancy. Must include a strong disclaimer to consult a healthcare provider."),
  medicinesToAvoid: z.array(z.string()).describe("A list of common over-the-counter and prescription medicine compositions to be cautious about. This is not exhaustive and must advise consulting a doctor."),
});
export type GetPregnancyAdviceOutput = z.infer<typeof GetPregnancyAdviceOutputSchema>;

export async function getPregnancyAdvice(input: GetPregnancyAdviceInput): Promise<GetPregnancyAdviceOutput> {
  return getPregnancyAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pregnancyAdvicePrompt',
  input: { schema: GetPregnancyAdviceInputSchema },
  output: { schema: GetPregnancyAdviceOutputSchema },
  prompt: `You are a friendly and knowledgeable virtual obstetrician. A user is asking for information about their pregnancy at week {{{gestationalWeek}}}.

Provide a detailed and reassuring overview for this specific week.

Your response must be in the specified JSON format. Ensure all lists have between 3 and 5 items.
- Based on the week, determine the correct trimester (1-13 is 1st, 14-27 is 2nd, 28+ is 3rd).
- Describe the baby's development this week. Be specific about size (use common fruit/veg comparisons), new organs, or abilities.
- Describe what the mother might be feeling or experiencing physically and emotionally.
- Provide a list of specific, actionable nutrition tips relevant to this stage.
- Provide information about vaccines (like Flu, Tdap) or important check-ups that are commonly recommended around this time. If none are typical for this specific week, mention what to expect soon.
- Provide a list of general, helpful tips related to things like exercise, sleep, appointments, or preparing for the baby.
- Provide a general, educational explanation of teratogenicity. Explain what teratogens are (substances that can cause birth defects) and mention that exposure is most critical during the first trimester. Give examples like alcohol, certain medications, and infections. CRITICALLY, you must include the sentence: "This information is for educational purposes only. Always consult your healthcare provider about your specific situation and before taking any medication."
- Provide a list of common medicine compositions that pregnant women are often advised to avoid or use with caution. Include examples like Ibuprofen, Aspirin (in later stages), certain acne medications (like Isotretinoin), and some decongestants. For each, briefly state why. CRITICALLY, you must start this list with the disclaimer: "The following is a general, non-exhaustive list. YOU MUST consult your doctor before taking, stopping, or changing any medication."
`,
});

const getPregnancyAdviceFlow = ai.defineFlow(
  {
    name: 'getPregnancyAdviceFlow',
    inputSchema: GetPregnancyAdviceInputSchema,
    outputSchema: GetPregnancyAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

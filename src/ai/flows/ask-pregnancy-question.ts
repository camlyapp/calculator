'use server';

/**
 * @fileOverview Provides AI-powered answers to user questions about pregnancy.
 * 
 * - askPregnancyQuestion - A function that returns an answer to a specific question about a given week of gestation.
 * - AskPregnancyQuestionInput - The input type for the askPregnancyQuestion function.
 * - AskPregnancyQuestionOutput - The return type for the askPregnancyQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskPregnancyQuestionInputSchema = z.object({
  gestationalWeek: z.number().int().min(1).max(42).describe("The current week of pregnancy (gestational age)."),
  question: z.string().min(5).describe("The user's specific question about their pregnancy."),
});
export type AskPregnancyQuestionInput = z.infer<typeof AskPregnancyQuestionInputSchema>;

const AskPregnancyQuestionOutputSchema = z.object({
  answer: z.string().describe("A helpful and reassuring answer to the user's question, tailored to the specific week of pregnancy."),
});
export type AskPregnancyQuestionOutput = z.infer<typeof AskPregnancyQuestionOutputSchema>;

export async function askPregnancyQuestion(input: AskPregnancyQuestionInput): Promise<AskPregnancyQuestionOutput> {
  return askPregnancyQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askPregnancyQuestionPrompt',
  input: { schema: AskPregnancyQuestionInputSchema },
  output: { schema: AskPregnancyQuestionOutputSchema },
  prompt: `You are a friendly and knowledgeable virtual obstetrician. A user who is in week {{{gestationalWeek}}} of their pregnancy is asking the following question:

"{{{question}}}"

Provide a helpful, clear, and reassuring answer based on their stage of pregnancy.

IMPORTANT: Always end your answer with the following disclaimer, formatted exactly as shown below:
"Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice. Please consult with your healthcare provider for any personal health concerns."
`,
});

const askPregnancyQuestionFlow = ai.defineFlow(
  {
    name: 'askPregnancyQuestionFlow',
    inputSchema: AskPregnancyQuestionInputSchema,
    outputSchema: AskPregnancyQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

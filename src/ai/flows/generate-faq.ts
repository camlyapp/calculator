
'use server';

/**
 * @fileOverview Generates a list of frequently asked questions (FAQs) for a given calculator.
 *
 * - generateFaq - A function that takes a calculator name and returns a list of relevant FAQs.
 * - GenerateFaqInput - The input type for the generateFaq function.
 * - GenerateFaqOutput - The return type for the generateFaq function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFaqInputSchema = z.object({
  calculatorName: z.string().describe("The name of the calculator, e.g., 'Loan Calculator', 'Retirement Calculator'."),
});
export type GenerateFaqInput = z.infer<typeof GenerateFaqInputSchema>;

const FaqItemSchema = z.object({
    question: z.string().describe("The frequently asked question."),
    answer: z.string().describe("A clear and concise answer to the question."),
});

const GenerateFaqOutputSchema = z.object({
  faqs: z.array(FaqItemSchema).describe("A list of 3-5 relevant FAQs for the specified calculator."),
});
export type GenerateFaqOutput = z.infer<typeof GenerateFaqOutputSchema>;

const getFallbackFaqs = (calculatorName: string): GenerateFaqOutput => {
    return {
        faqs: [
            {
                question: `How accurate is the ${calculatorName}?`,
                answer: `The ${calculatorName} provides estimates based on the data you provide. While we strive for accuracy, the results should be considered for informational purposes only. For financial calculators, consult a qualified professional for personalized advice.`,
            },
            {
                question: "Can I save or export my calculation results?",
                answer: "Yes, most of our calculators feature a 'Share / Download' button that allows you to save your results as a PNG, JPG, or PDF file for your records.",
            },
            {
                question: "Is my data safe?",
                answer: "Yes, your privacy is important to us. The data you enter is processed on your device or sent to our AI services for processing and is not stored on our servers. For more details, please see our Privacy Policy.",
            }
        ]
    };
}


export async function generateFaq(input: GenerateFaqInput): Promise<GenerateFaqOutput> {
    try {
        const result = await generateFaqFlow(input);
        // Basic validation to ensure the AI returned something reasonable
        if (result && result.faqs && result.faqs.length > 0) {
            return result;
        }
        // Fallback if AI returns empty or invalid data
        return getFallbackFaqs(input.calculatorName);
    } catch (error) {
        console.error(`AI FAQ generation failed for ${input.calculatorName}, providing fallback.`, error);
        return getFallbackFaqs(input.calculatorName);
    }
}


const generateFaqFlow = ai.defineFlow(
  {
    name: 'generateFaqFlow',
    inputSchema: GenerateFaqInputSchema,
    outputSchema: GenerateFaqOutputSchema,
  },
  async (input) => {
    
    const prompt = `You are a helpful assistant that generates Frequently Asked Questions (FAQs) for financial and health calculators.
    
    Your task is to generate a list of 3 to 5 relevant and insightful FAQs for the following calculator: "${input.calculatorName}".
    
    The questions should anticipate the user's potential queries after using the calculator. The answers should be clear, concise, and easy to understand.
    For financial calculators, answers can include general advice but should not be considered personalized financial counsel.
    
    Your response must be in the specified JSON format.
    `;

    const { output } = await ai.generate({
      prompt,
      output: { schema: GenerateFaqOutputSchema },
    });
    
    return output!;
  }
);

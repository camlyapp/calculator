// src/ai/flows/suggest-loan-optimizations.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions on optimizing a loan based on user's financial input.
 *
 * - suggestLoanOptimizations - A function that takes loan details and financial situation as input and returns loan optimization suggestions.
 * - SuggestLoanOptimizationsInput - The input type for the suggestLoanOptimizations function.
 * - SuggestLoanOptimizationsOutput - The return type for the suggestLoanOptimizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLoanOptimizationsInputSchema = z.object({
  loanAmount: z.number().describe('The total amount of the loan.'),
  interestRate: z.number().describe('The annual interest rate of the loan (e.g., 0.05 for 5%).'),
  loanTermMonths: z.number().describe('The term of the loan in months.'),
  monthlyIncome: z.number().describe('The user\u2019s monthly income.'),
  monthlyExpenses: z.number().describe('The user\u2019s total monthly expenses, excluding loan payments.'),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe("The user's risk tolerance level (low, medium, or high)."),
  financialGoals: z
    .string()
    .describe('The user\u2019s financial goals (e.g., early retirement, saving for a down payment).'),
});
export type SuggestLoanOptimizationsInput = z.infer<typeof SuggestLoanOptimizationsInputSchema>;

const SuggestLoanOptimizationsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of AI-powered suggestions to optimize the loan.'),
  rationale: z
    .string()
    .describe('Explanation of why each suggestion was provided.'),
});
export type SuggestLoanOptimizationsOutput = z.infer<typeof SuggestLoanOptimizationsOutputSchema>;

// Fallback function in case the AI call fails
const getFallbackSuggestions = (input: SuggestLoanOptimizationsInput): SuggestLoanOptimizationsOutput => {
    const suggestions = [
        "Consider making bi-weekly payments instead of monthly. This results in one extra monthly payment per year, accelerating your loan payoff.",
        "Round up your monthly payments. Even an extra $50 per month can significantly reduce the total interest paid over the life of the loan.",
        "Explore refinancing options if current interest rates are lower than your loan's rate. A lower rate can lead to substantial savings.",
        "Review your budget to identify areas where you can cut back on expenses. The saved money can be applied as extra payments towards your loan principal."
    ];

    const rationale = `These are general financial best practices for loan optimization. For personalized advice, please ensure your environment is configured for AI suggestions. The AI considers your specific income, expenses, and risk tolerance to provide tailored strategies.`;

    return { suggestions, rationale };
}


export async function suggestLoanOptimizations(input: SuggestLoanOptimizationsInput): Promise<SuggestLoanOptimizationsOutput> {
  try {
    const result = await suggestLoanOptimizationsFlow(input);
    return result;
  } catch (error) {
    console.error("AI suggestions failed, providing fallback.", error);
    return getFallbackSuggestions(input);
  }
}

const prompt = ai.definePrompt({
  name: 'suggestLoanOptimizationsPrompt',
  input: {schema: SuggestLoanOptimizationsInputSchema},
  output: {schema: SuggestLoanOptimizationsOutputSchema},
  prompt: `You are an AI-powered financial advisor specializing in loan optimization.

  Based on the user's loan details and financial situation, provide a list of actionable suggestions to help them save money and pay off their loan faster. Explain why each suggestion was made.

  Loan Amount: {{{loanAmount}}}
  Interest Rate: {{{interestRate}}}
  Loan Term (Months): {{{loanTermMonths}}}
  Monthly Income: {{{monthlyIncome}}}
  Monthly Expenses: {{{monthlyExpenses}}}
  Risk Tolerance: {{{riskTolerance}}}
  Financial Goals: {{{financialGoals}}}

  Consider strategies such as making extra payments, exploring options for refinancing, or adjusting the loan term.

  Provide each suggestion with a clear rationale.

  Output your suggestions in the requested JSON format, as a list of strings.
  `,
});

const suggestLoanOptimizationsFlow = ai.defineFlow(
  {
    name: 'suggestLoanOptimizationsFlow',
    inputSchema: SuggestLoanOptimizationsInputSchema,
    outputSchema: SuggestLoanOptimizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

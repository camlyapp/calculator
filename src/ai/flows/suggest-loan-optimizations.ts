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
import { calculateMonthlyPayment } from '@/lib/loan-utils';
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

// Enhanced fallback function that uses the input
const getFallbackSuggestions = (input: SuggestLoanOptimizationsInput): SuggestLoanOptimizationsOutput => {
    const monthlyPayment = calculateMonthlyPayment(input.loanAmount, input.interestRate * 100, input.loanTermMonths / 12);
    const disposableIncome = input.monthlyIncome - input.monthlyExpenses - monthlyPayment;

    const suggestions = [
        "Consider making bi-weekly payments instead of monthly. This results in one extra monthly payment per year, accelerating your loan payoff.",
        "Round up your monthly payments. Even a small extra amount each month can significantly reduce the total interest paid over the life of the loan.",
    ];
    
    if (disposableIncome > 200) { // Arbitrary threshold for suggesting extra payments
        suggestions.push(`With an estimated disposable income of around $${disposableIncome.toFixed(0)}, consider applying an extra $100-$200 towards your principal each month to pay off the loan faster.`);
    }

    if (input.interestRate > 0.06) { // Arbitrary threshold for suggesting refinance
        suggestions.push("Explore refinancing options. If current market rates are lower than your loan's rate, a new loan could lead to substantial savings.");
    }

    const rationale = `These are general financial best practices for loan optimization. For personalized advice tailored to your risk tolerance and financial goals, please ensure your environment is configured for AI suggestions.`;

    return { suggestions, rationale };
}


export async function suggestLoanOptimizations(input: SuggestLoanOptimizationsInput): Promise<SuggestLoanOptimizationsOutput> {
  try {
    const result = await suggestLoanOptimizationsFlow(input);
    return result;
  } catch (error) {
    console.error("AI suggestions failed, providing fallback.", error);
    // Use the new, more dynamic fallback
    return getFallbackSuggestions(input);
  }
}

const prompt = ai.definePrompt({
  name: 'suggestLoanOptimizationsPrompt',
  input: {schema: SuggestLoanOptimizationsInputSchema},
  output: {schema: SuggestLoanOptimizationsOutputSchema},
  prompt: `You are an AI-powered financial advisor specializing in loan optimization.

  Analyze the user's financial situation and provide a list of actionable suggestions to help them save money and pay off their loan faster. Explain why each suggestion was made.

  User's Financial Profile:
  - Loan Amount: \${{{loanAmount}}}
  - Interest Rate: {{multiply interestRate 100}}%
  - Loan Term: {{divide loanTermMonths 12}} years
  - Monthly Income: \${{{monthlyIncome}}}
  - Monthly Expenses: \${{{monthlyExpenses}}}
  - Stated Risk Tolerance: {{{riskTolerance}}}
  - Stated Financial Goals: "{{{financialGoals}}}"

  Calculated Metrics (for your reference):
  - Estimated Monthly Payment: \${{{@root.monthlyPayment}}}
  - Debt-to-Income (DTI) Ratio: {{@root.dti}}% (This is based on provided expenses, excluding the new loan payment)
  - Disposable Income (after expenses and loan payment): \${{{@root.disposableIncome}}}

  Your Task:
  - Generate 3-5 clear, actionable suggestions.
  - Base your suggestions on all the data provided, especially their risk tolerance and financial goals. For example, if risk tolerance is high and the goal is to be debt-free, suggest aggressive extra payments. If risk is low, suggest smaller, consistent extra payments.
  - Provide a concise rationale explaining *why* you are making these suggestions, linking them back to the user's specific situation.

  Output your response in the requested JSON format.
  `,
});

const suggestLoanOptimizationsFlow = ai.defineFlow(
  {
    name: 'suggestLoanOptimizationsFlow',
    inputSchema: SuggestLoanOptimizationsInputSchema,
    outputSchema: SuggestLoanOptimizationsOutputSchema,
  },
  async (input) => {
    // Perform calculations to enrich the prompt context
    const monthlyPayment = calculateMonthlyPayment(input.loanAmount, input.interestRate * 100, input.loanTermMonths / 12);
    const dti = input.monthlyIncome > 0 ? ((input.monthlyExpenses) / input.monthlyIncome) * 100 : 0;
    const disposableIncome = input.monthlyIncome - input.monthlyExpenses - monthlyPayment;

    const promptInput = {
      ...input,
      monthlyPayment: monthlyPayment.toFixed(2),
      dti: dti.toFixed(2),
      disposableIncome: disposableIncome.toFixed(2),
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);

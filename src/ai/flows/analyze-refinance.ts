
'use server';

/**
 * @fileOverview Provides an AI-powered analysis of a loan refinancing scenario.
 *
 * - analyzeRefinance - A function that compares a current loan with a new loan to determine if refinancing is advisable.
 * - AnalyzeRefinanceInput - The input type for the analyzeRefinance function.
 * - AnalyzeRefinanceOutput - The return type for the analyzeRefinance function.
 */

import { ai } from '@/ai/genkit';
import { generateAmortizationSchedule } from '@/lib/loan-utils';
import { z } from 'genkit';

const AnalyzeRefinanceInputSchema = z.object({
  currentLoanAmount: z.number().describe('The original amount of the current loan.'),
  currentInterestRate: z.number().describe('The annual interest rate of the current loan (e.g., 0.065 for 6.5%).'),
  currentLoanTerm: z.number().describe('The original term of the current loan in years.'),
  loanAge: z.number().describe('How many years the user has been paying the current loan.'),
  newInterestRate: z.number().describe('The annual interest rate of the new loan (e.g., 0.05 for 5%).'),
  newLoanTerm: z.number().describe('The term of the new loan in years.'),
  refinanceCosts: z.number().describe('The total closing costs and fees for the refinancing.'),
});
export type AnalyzeRefinanceInput = z.infer<typeof AnalyzeRefinanceInputSchema>;

const AnalyzeRefinanceOutputSchema = z.object({
  isRecommended: z.boolean().describe('Whether or not refinancing is recommended.'),
  recommendation: z.string().describe('A short, clear recommendation (e.g., "Recommended" or "Not Recommended").'),
  lifetimeSavings: z.number().describe('The total estimated savings over the life of the loan if refinanced.'),
  currentMonthlyPayment: z.number().describe('The monthly payment for the current loan.'),
  newMonthlyPayment: z.number().describe('The monthly payment for the new loan.'),
  detailedAnalysis: z.string().describe('A detailed explanation of the pros and cons of refinancing in this scenario.'),
});
export type AnalyzeRefinanceOutput = z.infer<typeof AnalyzeRefinanceOutputSchema>;

// Helper function to calculate remaining balance
const calculateRemainingBalance = (originalAmount: number, annualRate: number, originalTermYears: number, paymentsMadeMonths: number) => {
    const { schedule } = generateAmortizationSchedule(originalAmount, annualRate * 100, originalTermYears, 0);
    if (paymentsMadeMonths >= schedule.length || paymentsMadeMonths <= 0) {
        return originalAmount; // Return original amount if no payments made or loan is over
    }
    return schedule[paymentsMadeMonths - 1].remainingBalance;
};

export async function analyzeRefinance(input: AnalyzeRefinanceInput): Promise<AnalyzeRefinanceOutput> {
    const paymentsMade = input.loanAge * 12;

    const remainingBalance = calculateRemainingBalance(
      input.currentLoanAmount,
      input.currentInterestRate,
      input.currentLoanTerm,
      paymentsMade
    );
    
    const newLoanAmount = remainingBalance + input.refinanceCosts;

    // Calculate remaining cost of current loan
    const { schedule: currentSchedule, monthlyPayment: currentMonthlyPayment } = generateAmortizationSchedule(
      input.currentLoanAmount,
      input.currentInterestRate * 100,
      input.currentLoanTerm,
      0
    );
    const remainingPayments = currentSchedule.slice(paymentsMade);
    const remainingCurrentCost = remainingPayments.reduce((sum, row) => sum + row.totalPayment, 0);
    
    // Calculate total cost of new loan
    const { schedule: newSchedule, monthlyPayment: newMonthlyPayment } = generateAmortizationSchedule(
      newLoanAmount,
      input.newInterestRate * 100,
      input.newLoanTerm,
      0
    );
    const totalNewCost = newSchedule.reduce((sum, row) => sum + row.totalPayment, 0);

    const lifetimeSavings = remainingCurrentCost - totalNewCost;

    const analysisInput = {
        remainingBalance,
        currentInterestRate: input.currentInterestRate,
        currentLoanTerm: input.currentLoanTerm,
        loanAge: input.loanAge,
        currentMonthlyPayment,
        newLoanAmount,
        newInterestRate: input.newInterestRate,
        newLoanTerm: input.newLoanTerm,
        newMonthlyPayment,
        refinanceCosts: input.refinanceCosts,
        lifetimeSavings,
    };
    
    const aiAnalysis = await analyzeRefinanceFlow(analysisInput);

    return {
        ...aiAnalysis,
        lifetimeSavings,
        currentMonthlyPayment,
        newMonthlyPayment,
    };
}


const analyzeRefinanceFlow = ai.defineFlow(
  {
    name: 'analyzeRefinanceFlow',
    inputSchema: z.any(), // Input is pre-processed now
    outputSchema: AnalyzeRefinanceOutputSchema.omit({ lifetimeSavings: true, currentMonthlyPayment: true, newMonthlyPayment: true }),
  },
  async (input) => {
    const prompt = `You are an expert financial advisor specializing in loan refinancing. Analyze the following scenario and provide a clear recommendation.

    Current Loan:
    - Remaining Balance: $${input.remainingBalance.toFixed(2)}
    - Interest Rate: ${(input.currentInterestRate * 100).toFixed(2)}%
    - Remaining Term: ${input.currentLoanTerm - input.loanAge} years
    - Monthly Payment: $${input.currentMonthlyPayment.toFixed(2)}

    Proposed New Loan:
    - Loan Amount: $${input.newLoanAmount.toFixed(2)} (includes $${input.refinanceCosts.toFixed(2)} in closing costs)
    - Interest Rate: ${(input.newInterestRate * 100).toFixed(2)}%
    - Term: ${input.newLoanTerm} years
    - Monthly Payment: $${input.newMonthlyPayment.toFixed(2)}

    Analysis:
    - The user will save $${input.lifetimeSavings.toFixed(2)} over the life of the loan by refinancing.

    Based on this data, provide a clear recommendation (Recommended/Not Recommended) and a detailed analysis.
    Explain the pros (e.g., lower monthly payment, interest savings) and cons (e.g., extending the loan term, upfront costs).
    Your response should be in JSON format.
    `;

    const { output } = await ai.generate({
      prompt,
      output: { schema: AnalyzeRefinanceOutputSchema.omit({ lifetimeSavings: true, currentMonthlyPayment: true, newMonthlyPayment: true }) },
    });
    
    return output!;
  }
);

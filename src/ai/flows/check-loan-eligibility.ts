
'use server';

/**
 * @fileOverview Provides an AI-powered analysis of loan eligibility.
 *
 * - checkLoanEligibility - A function that assesses a user's financial profile to determine loan eligibility.
 * - CheckLoanEligibilityInput - The input type for the checkLoanEligibility function.
 * - CheckLoanEligibilityOutput - The return type for the checkLoanEligibility function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckLoanEligibilityInputSchema = z.object({
  monthlyIncome: z.number().describe("The user's total monthly income before taxes."),
  monthlyExpenses: z.number().describe("The user's total monthly expenses (rent, bills, etc.), excluding any current loan payments."),
  loanAmount: z.number().describe('The desired loan amount.'),
  loanTerm: z.number().describe('The desired loan term in years.'),
  creditScore: z.number().describe('The user\'s credit score (e.g., on a scale of 300-850).'),
});
export type CheckLoanEligibilityInput = z.infer<typeof CheckLoanEligibilityInputSchema>;

const CheckLoanEligibilityOutputSchema = z.object({
  eligibilityStatus: z.enum(['Eligible', 'Not Eligible', 'Provisional']).describe('The final eligibility status.'),
  estimatedEligibleAmount: z.number().describe('The loan amount the user is likely eligible for.'),
  estimatedInterestRate: z.number().describe('An estimated annual interest rate based on their profile (e.g., 5.5 for 5.5%).'),
  debtToIncomeRatio: z.number().describe('The calculated debt-to-income ratio as a percentage.'),
  analysis: z.string().describe('A detailed analysis explaining the decision, mentioning the impact of credit score, DTI, and other factors.'),
});
export type CheckLoanEligibilityOutput = z.infer<typeof CheckLoanEligibilityOutputSchema>;


export async function checkLoanEligibility(input: CheckLoanEligibilityInput): Promise<CheckLoanEligibilityOutput> {
  return checkLoanEligibilityFlow(input);
}


const checkLoanEligibilityFlow = ai.defineFlow(
  {
    name: 'checkLoanEligibilityFlow',
    inputSchema: CheckLoanEligibilityInputSchema,
    outputSchema: CheckLoanEligibilityOutputSchema,
  },
  async (input) => {
    
    // Basic DTI Calculation (can be refined)
    const monthlyDebt = input.monthlyExpenses; // Simplified, could add other debts
    const dti = (monthlyDebt / input.monthlyIncome) * 100;
    
    const prompt = `You are a loan officer AI. Analyze the following applicant's profile to determine their loan eligibility.

    Applicant Profile:
    - Monthly Income: $${input.monthlyIncome}
    - Monthly Expenses: $${input.monthlyExpenses}
    - Desired Loan Amount: $${input.loanAmount}
    - Desired Loan Term: ${input.loanTerm} years
    - Credit Score: ${input.creditScore}
    - Calculated Debt-to-Income (DTI) Ratio: ${dti.toFixed(2)}%

    Analysis Guidelines:
    1.  **DTI Ratio**: A DTI below 36% is generally strong. 37-43% is acceptable. Above 43% is a high risk. The new loan payment should be included when considering affordability. A rough estimate for the new monthly payment is (loanAmount / (loanTerm * 12)).
    2.  **Credit Score**: 
        - 740+: Excellent. Likely to get the best rates.
        - 670-739: Good. Likely to be approved, but at slightly higher rates.
        - 580-669: Fair. May be approved, but with higher rates and stricter terms.
        - Below 580: Poor. Unlikely to be approved.
    3.  **Eligibility Status**:
        - 'Eligible': Strong profile, good DTI, good credit.
        - 'Provisional': Borderline case. Maybe the DTI is high, or the credit score is fair. They might be eligible for a lower amount.
        - 'Not Eligible': High DTI, low credit score, or the loan amount is clearly unaffordable.

    Your Task:
    - Determine the 'eligibilityStatus'.
    - Calculate an 'estimatedEligibleAmount'. If they are not eligible for the requested amount, provide a more realistic figure they might be approved for. If they are eligible, this can be the same as the requested amount.
    - Suggest an 'estimatedInterestRate'. Higher risk profiles should get higher rates.
    - Provide a detailed 'analysis' explaining your reasoning based on DTI, credit score, and overall financial health. Be encouraging but realistic.
    
    Provide the output in the specified JSON format.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: CheckLoanEligibilityOutputSchema },
    });
    
    return { ...output!, debtToIncomeRatio: parseFloat(dti.toFixed(2)) };
  }
);

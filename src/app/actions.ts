'use server';

import { suggestLoanOptimizations, type SuggestLoanOptimizationsInput, type SuggestLoanOptimizationsOutput } from '@/ai/flows/suggest-loan-optimizations';
import { z } from 'zod';

const SmartSuggestionsSchema = z.object({
  loanAmount: z.coerce.number().min(1),
  interestRate: z.coerce.number().min(0),
  loanTerm: z.coerce.number().min(1),
  monthlyIncome: z.coerce.number().min(0),
  monthlyExpenses: z.coerce.number().min(0),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  financialGoals: z.string().min(1, "Financial goals are required."),
});


export async function getSmartSuggestions(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; suggestions?: SuggestLoanOptimizationsOutput; errors?: any, error?: string }> {
    const validatedFields = SmartSuggestionsSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data. Please check your inputs.',
        };
    }
    
    const { loanTerm, ...rest } = validatedFields.data;

    const aiInput: SuggestLoanOptimizationsInput = {
        ...rest,
        loanTermMonths: loanTerm * 12,
        interestRate: validatedFields.data.interestRate / 100, // Convert percentage to decimal
    };

    try {
        const result = await suggestLoanOptimizations(aiInput);
        return { suggestions: result, message: "Here are your personalized suggestions!" };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred while fetching AI suggestions. Please try again later.' };
    }
}

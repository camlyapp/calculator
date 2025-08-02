'use server';

import { suggestLoanOptimizations, type SuggestLoanOptimizationsInput, type SuggestLoanOptimizationsOutput } from '@/ai/flows/suggest-loan-optimizations';
import { analyzeRefinance, type AnalyzeRefinanceInput, type AnalyzeRefinanceOutput } from '@/ai/flows/analyze-refinance';
import { convertCurrency, type ConvertCurrencyInput, type ConvertCurrencyOutput } from '@/ai/flows/convert-currency';
import { calculateIndianTax, type CalculateIndianTaxInput, type CalculateIndianTaxOutput } from '@/ai/flows/calculate-indian-tax';
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

const RefinanceAnalysisSchema = z.object({
    currentLoanAmount: z.coerce.number().min(1),
    currentInterestRate: z.coerce.number().min(0),
    currentLoanTerm: z.coerce.number().min(1),
    loanAge: z.coerce.number().min(0),
    newInterestRate: z.coerce.number().min(0),
    newLoanTerm: z.coerce.number().min(1),
    refinanceCosts: z.coerce.number().min(0),
});

export async function analyzeRefinanceAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; analysis?: AnalyzeRefinanceOutput; errors?: any, error?: string }> {
    const validatedFields = RefinanceAnalysisSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data. Please check your inputs.',
        };
    }

    const { currentInterestRate, newInterestRate, ...rest } = validatedFields.data;

    const aiInput: AnalyzeRefinanceInput = {
        ...rest,
        currentInterestRate: currentInterestRate / 100,
        newInterestRate: newInterestRate / 100,
    };

    try {
        const result = await analyzeRefinance(aiInput);
        return { analysis: result, message: "Your refinancing analysis is ready." };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred while analyzing the refinance option. Please try again later.' };
    }
}

const currencyCodes = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD", "CHF", "CNY"] as const;

const CurrencyConverterSchema = z.object({
  amount: z.coerce.number().min(0),
  fromCurrency: z.enum(currencyCodes),
  toCurrency: z.enum(currencyCodes),
});

export async function convertCurrencyAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; conversion?: ConvertCurrencyOutput; errors?: any, error?: string }> {
    const validatedFields = CurrencyConverterSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data. Please check your inputs.',
        };
    }

    const aiInput: ConvertCurrencyInput = validatedFields.data;

    try {
        const result = await convertCurrency(aiInput);
        return { conversion: result, message: "Conversion successful." };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred during currency conversion. Please try again later.' };
    }
}

const IndianTaxSchema = z.object({
  grossIncome: z.coerce.number().min(0, "Income must be a positive number."),
  deductions: z.coerce.number().min(0, "Deductions cannot be negative.").default(0),
  taxRegime: z.enum(['new', 'old']),
});

export async function calculateIndianTaxAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; result?: CalculateIndianTaxOutput; errors?: any, error?: string }> {
    const validatedFields = IndianTaxSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data. Please check your inputs.',
        };
    }

    const aiInput: CalculateIndianTaxInput = validatedFields.data;

    try {
        const result = await calculateIndianTax(aiInput);
        return { result, message: "Tax calculation successful." };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred during tax calculation. Please try again later.' };
    }
}

'use server';

import { suggestLoanOptimizations, type SuggestLoanOptimizationsInput, type SuggestLoanOptimizationsOutput } from '@/ai/flows/suggest-loan-optimizations';
import { analyzeRefinance, type AnalyzeRefinanceInput, type AnalyzeRefinanceOutput } from '@/ai/flows/analyze-refinance';
import { convertCurrency, type ConvertCurrencyInput, type ConvertCurrencyOutput } from '@/ai/flows/convert-currency';
import { calculateIndianTax, type CalculateIndianTaxInput, type CalculateIndianTaxOutput } from '@/ai/flows/calculate-indian-tax';
import { checkLoanEligibility, type CheckLoanEligibilityInput, type CheckLoanEligibilityOutput } from '@/ai/flows/check-loan-eligibility';
import { calculateGratuity, type CalculateGratuityInput, type CalculateGratuityOutput } from '@/ai/flows/calculate-gratuity';
import { getPregnancyAdvice, type GetPregnancyAdviceInput, type GetPregnancyAdviceOutput } from '@/ai/flows/get-pregnancy-advice';
import { askPregnancyQuestion, type AskPregnancyQuestionInput, type AskPregnancyQuestionOutput } from '@/ai/flows/ask-pregnancy-question';


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


const LoanEligibilitySchema = z.object({
  monthlyIncome: z.coerce.number().min(0, "Monthly income must be a positive number."),
  monthlyExpenses: z.coerce.number().min(0, "Monthly expenses must be a positive number."),
  loanAmount: z.coerce.number().min(1, "Loan amount must be greater than zero."),
  loanTerm: z.coerce.number().min(1, "Loan term must be at least 1 year."),
  creditScore: z.coerce.number().min(300, "Credit score must be at least 300.").max(850, "Credit score cannot exceed 850."),
});

export async function checkLoanEligibilityAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; result?: CheckLoanEligibilityOutput; errors?: any, error?: string }> {
    const validatedFields = LoanEligibilitySchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data. Please check your inputs.',
        };
    }

    const aiInput: CheckLoanEligibilityInput = validatedFields.data;

    try {
        const result = await checkLoanEligibility(aiInput);
        return { result, message: "Your eligibility analysis is complete." };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred during eligibility check. Please try again later.' };
    }
}


const GratuitySchema = z.object({
  monthlySalary: z.coerce.number().min(0, "Salary must be a positive number."),
  yearsOfService: z.coerce.number().min(0, "Years of service must be a positive number."),
});

export async function calculateGratuityAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; result?: CalculateGratuityOutput; errors?: any, error?: string }> {
    const validatedFields = GratuitySchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data. Please check your inputs.',
        };
    }

    const aiInput: CalculateGratuityInput = validatedFields.data;

    try {
        const result = await calculateGratuity(aiInput);
        return { result, message: "Gratuity calculation successful." };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred during gratuity calculation. Please try again later.' };
    }
}


const PregnancyAdviceSchema = z.object({
  gestationalWeek: z.coerce.number().min(1).max(42),
});

export async function getPregnancyAdviceAction(
  gestationalWeek: number
): Promise<{ advice?: GetPregnancyAdviceOutput; error?: string }> {
    const validatedFields = PregnancyAdviceSchema.safeParse({ gestationalWeek });
    
    if (!validatedFields.success) {
        return {
            error: 'Invalid gestational week provided.',
        };
    }
    
    const aiInput: GetPregnancyAdviceInput = validatedFields.data;

    try {
        const result = await getPregnancyAdvice(aiInput);
        return { advice: result };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred while fetching AI-powered advice. Please try again later.' };
    }
}

const AskQuestionSchema = z.object({
  gestationalWeek: z.coerce.number().min(1).max(42),
  question: z.string().min(5, "Question must be at least 5 characters long."),
});

export async function askPregnancyQuestionAction(
  prevState: any,
  formData: FormData
): Promise<{ answer?: AskPregnancyQuestionOutput; error?: string; errors?: any; }> {
    const validatedFields = AskQuestionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const aiInput: AskPregnancyQuestionInput = validatedFields.data;

    try {
        const result = await askPregnancyQuestion(aiInput);
        return { answer: result };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred while asking the AI. Please try again later.' };
    }
}

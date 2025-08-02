import { z } from 'zod';

export const LoanSchema = z.object({
  loanAmount: z.coerce.number({ required_error: "Loan amount is required." }).min(1, 'Loan amount must be positive.'),
  interestRate: z.coerce.number({ required_error: "Interest rate is required." }).min(0, 'Interest rate cannot be negative.'),
  loanTerm: z.coerce.number({ required_error: "Loan term is required." }).min(1, 'Loan term must be at least 1 year.'),
  extraPayment: z.coerce.number().min(0, 'Extra payment cannot be negative.').optional().default(0),
  propertyTax: z.coerce.number().min(0, 'Property tax cannot be negative.').optional().default(0),
  homeInsurance: z.coerce.number().min(0, 'Home insurance cannot be negative.').optional().default(0),
  hoaDues: z.coerce.number().min(0, 'HOA dues cannot be negative.').optional().default(0),
});

export type LoanFormValues = z.infer<typeof LoanSchema>;

export interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  extraPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface CalculationResult {
  principalAndInterest: number;
  totalMonthlyPayment: number;
  propertyTax: number;
  homeInsurance: number;
  hoaDues: number;
  totalInterest: number;
  totalPayment: number;
  payoffDate: string;
  originalTotalInterest?: number;
  interestSaved?: number;
  payoffTimeSaved?: string;
}

export interface ChartData {
  name: string;
  Principal: number;
  Interest: number;
}

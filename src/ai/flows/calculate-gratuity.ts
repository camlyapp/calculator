'use server';

/**
 * @fileOverview Calculates gratuity amount based on Indian regulations.
 *
 * - calculateGratuity - A function that calculates the gratuity amount.
 * - CalculateGratuityInput - The input type for the calculateGratuity function.
 * - CalculateGratuityOutput - The return type for the calculateGratuity function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateGratuityInputSchema = z.object({
  monthlySalary: z.coerce.number().min(0, "Salary must be a positive number.").describe("Last drawn monthly salary (Basic + Dearness Allowance)."),
  yearsOfService: z.coerce.number().min(0, "Years of service cannot be negative.").describe("Total years of service with the employer."),
});
export type CalculateGratuityInput = z.infer<typeof CalculateGratuityInputSchema>;

const CalculateGratuityOutputSchema = z.object({
    gratuityAmount: z.number(),
});
export type CalculateGratuityOutput = z.infer<typeof CalculateGratuityOutputSchema>;

const performGratuityCalculation = (input: CalculateGratuityInput): CalculateGratuityOutput => {
    const { monthlySalary, yearsOfService } = input;
    
    // The number of years is rounded up to the nearest integer if the service period is more than 6 months.
    const roundedYears = Math.ceil(yearsOfService);

    // Formula for Gratuity = (Last Drawn Salary * 15 * Number of Years of Service) / 26
    const gratuityAmount = (monthlySalary * 15 * roundedYears) / 26;
    
    // The maximum gratuity amount is capped at ₹20,00,000.
    const finalGratuity = Math.min(gratuityAmount, 2000000);

    return {
        gratuityAmount: finalGratuity
    };
};

export async function calculateGratuity(input: CalculateGratuityInput): Promise<CalculateGratuityOutput> {
  return performGratuityCalculation(input);
}


const calculateGratuityFlow = ai.defineFlow(
  {
    name: 'calculateGratuityFlow',
    inputSchema: CalculateGratuityInputSchema,
    outputSchema: CalculateGratuityOutputSchema,
  },
  async (input) => {
    return performGratuityCalculation(input);
  }
);

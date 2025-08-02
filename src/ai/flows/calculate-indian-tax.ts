'use server';

/**
 * @fileOverview Calculates Indian income tax based on user inputs.
 *
 * - calculateIndianTax - A function that calculates tax liability for the Indian system.
 * - CalculateIndianTaxInput - The input type for the calculateIndianTax function.
 * - CalculateIndianTaxOutput - The return type for the calculateIndianTax function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateIndianTaxInputSchema = z.object({
  grossIncome: z.coerce.number().min(0, "Income must be a positive number."),
  deductions: z.coerce.number().min(0, "Deductions cannot be negative.").default(0),
  taxRegime: z.enum(['new', 'old']),
});
export type CalculateIndianTaxInput = z.infer<typeof CalculateIndianTaxInputSchema>;

const CalculateIndianTaxOutputSchema = z.object({
    taxableIncome: z.number(),
    incomeTax: z.number(),
    cess: z.number(),
    totalTax: z.number(),
    effectiveRate: z.number(),
    breakdown: z.array(z.object({ bracket: z.string(), tax: z.number() })),
});
export type CalculateIndianTaxOutput = z.infer<typeof CalculateIndianTaxOutputSchema>;


export async function calculateIndianTax(input: CalculateIndianTaxInput): Promise<CalculateIndianTaxOutput> {
  return calculateIndianTaxFlow(input);
}


const calculateIndianTaxFlow = ai.defineFlow(
  {
    name: 'calculateIndianTaxFlow',
    inputSchema: CalculateIndianTaxInputSchema,
    outputSchema: CalculateIndianTaxOutputSchema,
  },
  async (input) => {
    const { grossIncome, deductions, taxRegime } = input;

    const newRegimeSlabs = [
        { from: 0, to: 300000, rate: 0 },
        { from: 300001, to: 600000, rate: 0.05 },
        { from: 600001, to: 900000, rate: 0.10 },
        { from: 900001, to: 1200000, rate: 0.15 },
        { from: 1200001, to: 1500000, rate: 0.20 },
        { from: 1500001, to: Infinity, rate: 0.30 },
    ];

    const oldRegimeSlabs = [
        { from: 0, to: 250000, rate: 0 },
        { from: 250001, to: 500000, rate: 0.05 },
        { from: 500001, to: 1000000, rate: 0.20 },
        { from: 1000001, to: Infinity, rate: 0.30 },
    ];

    const STANDARD_DEDUCTION = 50000;
    const CESS_RATE = 0.04;
    
    let taxableIncome: number;
    let taxSlabs;

    if (taxRegime === 'new') {
        taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);
        taxSlabs = newRegimeSlabs;
    } else { // Old Regime
        taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION - deductions);
        taxSlabs = oldRegimeSlabs;
    }
    
    let incomeTax = 0;
    let remainingIncome = taxableIncome;
    const breakdown: { bracket: string, tax: number }[] = [];

    for (const slab of taxSlabs) {
        if (remainingIncome <= 0) break;
        const incomeInSlab = Math.min(remainingIncome, slab.to - slab.from + (slab.to === Infinity ? Infinity : 1));
        const taxForSlab = incomeInSlab * slab.rate;
        
        incomeTax += taxForSlab;
        remainingIncome -= incomeInSlab;

        if (taxForSlab > 0) {
            breakdown.push({
                bracket: `₹${slab.from.toLocaleString('en-IN')} - ₹${slab.to === Infinity ? 'Above' : slab.to.toLocaleString('en-IN')} @ ${(slab.rate * 100)}%`,
                tax: taxForSlab,
            });
        }
    }
    
    // Rebate under Section 87A
    if (taxRegime === 'new' && taxableIncome <= 700000) {
        incomeTax = 0;
    } else if (taxRegime === 'old' && taxableIncome <= 500000) {
        incomeTax = Math.max(0, incomeTax - 12500);
    }
    
    const cess = incomeTax * CESS_RATE;
    const totalTax = incomeTax + cess;

    return {
        taxableIncome,
        incomeTax,
        cess,
        totalTax,
        effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
        breakdown,
    };
  }
);

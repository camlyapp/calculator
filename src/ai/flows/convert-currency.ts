'use server';

/**
 * @fileOverview Provides a simulated currency conversion service.
 *
 * - convertCurrency - A function that converts an amount from one currency to another using simulated rates.
 * - ConvertCurrencyInput - The input type for the convertCurrency function.
 * - ConvertCurrencyOutput - The return type for the convertCurrency function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// In a real application, these would be fetched from a live API.
const MOCK_RATES_TO_USD = {
    USD: 1.0,
    EUR: 1.08, // 1 EUR = 1.08 USD
    GBP: 1.27, // 1 GBP = 1.27 USD
    JPY: 0.0064, // 1 JPY = 0.0064 USD
    INR: 0.012, // 1 INR = 0.012 USD
    AUD: 0.66, // 1 AUD = 0.66 USD
    CAD: 0.73, // 1 CAD = 0.73 USD
    CHF: 1.11, // 1 CHF = 1.11 USD
    CNY: 0.14, // 1 CNY = 0.14 USD
};

const currencyCodes = Object.keys(MOCK_RATES_TO_USD) as [string, ...string[]];

const ConvertCurrencyInputSchema = z.object({
  amount: z.number().describe('The amount of money to convert.'),
  fromCurrency: z.enum(currencyCodes).describe('The currency code to convert from (e.g., "USD").'),
  toCurrency: z.enum(currencyCodes).describe('The currency code to convert to (e.g., "EUR").'),
});
export type ConvertCurrencyInput = z.infer<typeof ConvertCurrencyInputSchema>;

const ConvertCurrencyOutputSchema = z.object({
  convertedAmount: z.number().describe('The resulting amount after conversion.'),
  exchangeRate: z.number().describe('The exchange rate used for the conversion.'),
});
export type ConvertCurrencyOutput = z.infer<typeof ConvertCurrencyOutputSchema>;

export async function convertCurrency(input: ConvertCurrencyInput): Promise<ConvertCurrencyOutput> {
  return convertCurrencyFlow(input);
}

const convertCurrencyFlow = ai.defineFlow(
  {
    name: 'convertCurrencyFlow',
    inputSchema: ConvertCurrencyInputSchema,
    outputSchema: ConvertCurrencyOutputSchema,
  },
  async (input) => {
    const { amount, fromCurrency, toCurrency } = input;

    if (fromCurrency === toCurrency) {
      return { convertedAmount: amount, exchangeRate: 1 };
    }

    const fromRate = MOCK_RATES_TO_USD[fromCurrency];
    const toRate = MOCK_RATES_TO_USD[toCurrency];

    // Convert the amount to USD first, then to the target currency.
    const amountInUSD = amount * fromRate;
    const convertedAmount = amountInUSD / toRate;

    // The direct exchange rate from 'from' to 'to'.
    const exchangeRate = fromRate / toRate;

    return {
      convertedAmount,
      exchangeRate,
    };
  }
);

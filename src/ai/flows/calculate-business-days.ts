'use server';

/**
 * @fileOverview Calculates the number of business days between two dates, accounting for timezone-specific holidays.
 *
 * - calculateBusinessDays - A function that returns the number of business days and lists the holidays.
 * - CalculateBusinessDaysInput - The input type for the calculateBusinessDays function.
 * - CalculateBusinessDaysOutput - The return type for the calculateBusinessDays function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateBusinessDaysInputSchema = z.object({
  startDate: z.string().describe("The start date in 'YYYY-MM-DD' format."),
  endDate: z.string().describe("The end date in 'YYYY-MM-DD' format."),
  timeZone: z.string().describe("The IANA timezone name (e.g., 'America/New_York', 'Asia/Kolkata')."),
});
export type CalculateBusinessDaysInput = z.infer<typeof CalculateBusinessDaysInputSchema>;

const HolidaySchema = z.object({
    date: z.string().describe("The date of the holiday in 'YYYY-MM-DD' format."),
    name: z.string().describe("The name of the holiday."),
});

const CalculateBusinessDaysOutputSchema = z.object({
  totalDays: z.number().describe("The total number of days in the period."),
  weekendDays: z.number().describe("The number of Saturdays and Sundays in the period."),
  businessDays: z.number().describe("The net number of business days after excluding weekends and public holidays."),
  holidays: z.array(HolidaySchema).describe("A list of public holidays that fall on a weekday within the given period for the specified timezone."),
});
export type CalculateBusinessDaysOutput = z.infer<typeof CalculateBusinessDaysOutputSchema>;


export async function calculateBusinessDays(input: CalculateBusinessDaysInput): Promise<CalculateBusinessDaysOutput> {
    // Basic validation
    if (new Date(input.endDate) < new Date(input.startDate)) {
        throw new Error("End date cannot be earlier than the start date.");
    }
    return calculateBusinessDaysFlow(input);
}


const calculateBusinessDaysFlow = ai.defineFlow(
  {
    name: 'calculateBusinessDaysFlow',
    inputSchema: CalculateBusinessDaysInputSchema,
    outputSchema: CalculateBusinessDaysOutputSchema,
  },
  async ({ startDate, endDate, timeZone }) => {
    
    const prompt = `You are a calendar and holiday expert. Your task is to calculate the number of business days between two dates for a specific timezone.

    Follow these steps precisely:
    1.  The date range is from ${startDate} to ${endDate}, inclusive.
    2.  The timezone to consider is ${timeZone}.
    3.  First, calculate the total number of days in this range.
    4.  Second, count the number of weekend days (Saturdays and Sundays) in this range.
    5.  Third, identify all public/national holidays that occur within this date range for the specified timezone.
    6.  CRITICAL: Only count holidays that fall on a weekday (Monday-Friday). If a holiday falls on a weekend, it does not reduce the business day count.
    7.  List the weekday public holidays you found, with their date and name.
    8.  Finally, calculate the net business days by subtracting the count of weekend days AND the count of weekday public holidays from the total number of days.

    Return the result in the specified JSON format.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: CalculateBusinessDaysOutputSchema },
    });
    
    return output!;
  }
);

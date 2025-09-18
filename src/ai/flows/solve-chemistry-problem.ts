
'use server';

/**
 * @fileOverview Provides an AI-powered tool to solve chemistry problems.
 * 
 * - solveChemistryProblem - A function that takes a chemistry problem and returns a step-by-step solution.
 * - SolveChemistryProblemInput - The input type for the solveChemistryProblem function.
 * - SolveChemistryProblemOutput - The return type for the solveChemistryProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SolveChemistryProblemInputSchema = z.object({
  problem: z.string().min(10, "The problem description must be at least 10 characters long.").describe("A detailed description of the chemistry problem to be solved."),
});
export type SolveChemistryProblemInput = z.infer<typeof SolveChemistryProblemInputSchema>;

const SolveChemistryProblemOutputSchema = z.object({
  question: z.string().describe("The user's original question, restated clearly."),
  solution: z.array(z.string()).describe("A list of strings, where each string is a step in the problem-solving process."),
  finalAnswer: z.string().describe("The final, conclusive answer to the problem."),
  assumptions: z.array(z.string()).optional().describe("Any assumptions made to solve the problem, such as standard temperature and pressure."),
});
export type SolveChemistryProblemOutput = z.infer<typeof SolveChemistryProblemOutputSchema>;


export async function solveChemistryProblem(input: SolveChemistryProblemInput): Promise<SolveChemistryProblemOutput> {
    return solveChemistryProblemFlow(input);
}


const solveChemistryProblemFlow = ai.defineFlow(
  {
    name: 'solveChemistryProblemFlow',
    inputSchema: SolveChemistryProblemInputSchema,
    outputSchema: SolveChemistryProblemOutputSchema,
  },
  async (input) => {
    
    const prompt = `You are a world-class chemistry professor. A student has asked for your help solving a chemistry problem.
    
    Problem: "${input.problem}"

    Your task is to provide a clear, step-by-step solution to the problem. 
    1. First, restate the user's question.
    2. Then, break down the solution into logical, easy-to-follow steps.
    3. State any assumptions you made (e.g., standard temperature and pressure).
    4. Finally, provide the final answer clearly.
    
    Your response must be in the specified JSON format.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: SolveChemistryProblemOutputSchema },
    });
    
    return output!;
  }
);


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
  problemType: z.string().describe("The type of chemistry problem (e.g., Stoichiometry, Gas Laws, Thermochemistry)."),
  relevantFormulas: z.array(z.string()).describe("A list of key formulas or principles needed for the solution."),
  conceptualOverview: z.string().describe("A brief, high-level explanation of the concepts involved in solving the problem."),
  solution: z.array(z.string()).describe("A list of strings, where each string is a detailed step in the problem-solving process."),
  finalAnswer: z.string().describe("The final, conclusive answer to the problem, including units."),
  assumptions: z.array(z.string()).optional().describe("Any assumptions made to solve the problem, such as standard temperature and pressure (STP)."),
});
export type SolveChemistryProblemOutput = z.infer<typeof SolveChemistryProblemOutputSchema>;

// Fallback function in case the AI call fails
const getFallbackSolution = (problem: string): SolveChemistryProblemOutput => {
    return {
        question: problem,
        problemType: "Analysis Error",
        relevantFormulas: ["N/A"],
        conceptualOverview: "The AI assistant is currently unavailable to analyze the problem. The request could not be processed at this time. Please try again later.",
        solution: [
            "Ensure you have a stable internet connection.",
            "Verify that the AI service is properly configured and the API key is valid.",
            "Review the problem description for any unsupported characters or formats and simplify if possible."
        ],
        finalAnswer: "Unavailable",
        assumptions: ["An error occurred during processing."]
    };
}


export async function solveChemistryProblem(input: SolveChemistryProblemInput): Promise<SolveChemistryProblemOutput> {
    try {
        const result = await solveChemistryProblemFlow(input);
        return result;
    } catch (error) {
        console.error("AI chemistry problem solving failed, providing fallback.", error);
        return getFallbackSolution(input.problem);
    }
}

const prompt = ai.definePrompt({
    name: 'solveChemistryProblemPrompt',
    input: { schema: SolveChemistryProblemInputSchema },
    output: { schema: SolveChemistryProblemOutputSchema },
    prompt: `You are a world-class chemistry professor known for your ability to make complex topics easy to understand. A student has asked for your help solving a chemistry problem.
    
    Problem: "{{{problem}}}"

    Your task is to provide a comprehensive, professional, and educational solution. Follow these steps precisely:
    1.  **Restate the Question**: Clearly restate the student's original problem.
    2.  **Identify Problem Type**: Categorize the problem (e.g., Stoichiometry, Gas Laws, Thermochemistry, Molarity, etc.).
    3.  **List Relevant Formulas/Principles**: List the key chemical formulas, laws, or principles that are necessary to solve this problem (e.g., Ideal Gas Law: PV=nRT, Molarity: M = moles/Liter).
    4.  **Provide a Conceptual Overview**: Briefly explain the core concepts and the general strategy you will use to arrive at the solution.
    5.  **Detailed Solution Steps**: Break down the solution into a series of logical, easy-to-follow steps. Explain the 'why' behind each calculation. Show your work clearly.
    6.  **State Assumptions**: List any assumptions made (e.g., "Assuming standard temperature and pressure (STP)"). If no assumptions are needed, provide an empty array.
    7.  **Provide the Final Answer**: State the final answer clearly and concisely, making sure to include the correct units.
    
    Your response must be in the specified JSON format.
    `,
});


const solveChemistryProblemFlow = ai.defineFlow(
  {
    name: 'solveChemistryProblemFlow',
    inputSchema: SolveChemistryProblemInputSchema,
    outputSchema: SolveChemistryProblemOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      input,
    });
    return output!;
  }
);

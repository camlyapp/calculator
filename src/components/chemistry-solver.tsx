
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { solveChemistryProblemAction } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Beaker, FlaskConical, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import DownloadResults from './download-results';

const initialState = {
  message: undefined,
  result: undefined,
  errors: undefined,
  error: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Beaker className="mr-2 h-4 w-4" />}
            Solve Problem
        </Button>
    );
}

const ChemistrySolver = () => {
  const [state, formAction] = useActionState(solveChemistryProblemAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.message && !state.errors && state.result) {
        toast({
            title: "Problem Solved!",
            description: state.message,
        })
    }
    if (state?.error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.error,
        })
    }
  }, [state, toast]);


  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">AI Chemistry Problem Solver</CardTitle>
        <CardDescription>
          Enter a chemistry problem and our AI will provide a detailed, step-by-step solution.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="problem-description">Problem Description</Label>
                <Textarea
                    id="problem-description"
                    name="problem"
                    rows={6}
                    placeholder="e.g., 'How many grams of water (H2O) are produced from the combustion of 10 grams of methane (CH4) with excess oxygen (O2)? The unbalanced equation is CH4 + O2 -> CO2 + H2O.'"
                    required
                />
                {state?.errors?.problem && <p className="text-destructive text-sm mt-1">{state.errors.problem[0]}</p>}
            </div>
             <SubmitButton />
        </CardContent>
      </form>

      {state?.result && (
        <>
            <div ref={resultsRef} className="p-6 pt-0">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-primary">AI-Generated Solution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Problem Statement</h4>
                            <p className="text-sm text-muted-foreground italic">"{state.result.question}"</p>
                        </div>
                        
                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><FlaskConical className="h-5 w-5" />Problem Type</h4>
                                <p className="text-sm text-muted-foreground">{state.result.problemType}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5" />Key Concepts & Formulas</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {state.result.relevantFormulas.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-2">Conceptual Overview</h4>
                             <p className="text-sm text-muted-foreground">{state.result.conceptualOverview}</p>
                        </div>

                        <Separator />
                        
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Step-by-Step Solution</h4>
                            <ol className="list-decimal space-y-4 pl-5 text-sm text-muted-foreground">
                                {state.result.solution.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>

                         {state.result.assumptions && state.result.assumptions.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Assumptions Made</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {state.result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            </div>
                         )}

                        <Separator />

                        <div className="text-center p-4 rounded-lg bg-background">
                            <h4 className="text-lg font-semibold">Final Answer</h4>
                            <p className="text-2xl font-bold text-accent">{state.result.finalAnswer}</p>
                        </div>

                    </CardContent>
                </Card>
            </div>
            <CardFooter>
                 <DownloadResults
                    fileName="chemistry_solution"
                    resultsRef={resultsRef}
                />
            </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ChemistrySolver;

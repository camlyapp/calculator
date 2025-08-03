
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeRefinanceAction } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const initialState = {
  message: undefined,
  analysis: undefined,
  errors: undefined,
  error: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
            Analyze Refinancing
        </Button>
    );
}

const RefinanceAnalysis = () => {
  const [state, formAction] = useActionState(analyzeRefinanceAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    if (state?.message && !state.errors && state.analysis) {
        toast({
            title: "Analysis Complete!",
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
        <CardTitle className="text-2xl">Refinancing Analysis</CardTitle>
        <CardDescription>
          Compare your current loan with a new refinancing option to see if you can save money.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg text-primary">Current Loan</h3>
                    <div>
                        <Label htmlFor="currentLoanAmount">Original Loan Amount</Label>
                        <Input id="currentLoanAmount" name="currentLoanAmount" type="number" defaultValue="250000" required/>
                        {state?.errors?.currentLoanAmount && <p className="text-destructive text-sm mt-1">{state.errors.currentLoanAmount[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="currentInterestRate">Interest Rate (%)</Label>
                        <Input id="currentInterestRate" name="currentInterestRate" type="number" step="0.01" defaultValue="6.5" required/>
                        {state?.errors?.currentInterestRate && <p className="text-destructive text-sm mt-1">{state.errors.currentInterestRate[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="currentLoanTerm">Loan Term (Years)</Label>
                        <Input id="currentLoanTerm" name="currentLoanTerm" type="number" defaultValue="30" required/>
                        {state?.errors?.currentLoanTerm && <p className="text-destructive text-sm mt-1">{state.errors.currentLoanTerm[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="loanAge">Loan Age (Years)</Label>
                        <Input id="loanAge" name="loanAge" type="number" defaultValue="5" required/>
                        {state?.errors?.loanAge && <p className="text-destructive text-sm mt-1">{state.errors.loanAge[0]}</p>}
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg text-accent">New Loan (Refinance)</h3>
                    <div>
                        <Label htmlFor="newInterestRate">New Interest Rate (%)</Label>
                        <Input id="newInterestRate" name="newInterestRate" type="number" step="0.01" defaultValue="5.0" required/>
                        {state?.errors?.newInterestRate && <p className="text-destructive text-sm mt-1">{state.errors.newInterestRate[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="newLoanTerm">New Loan Term (Years)</Label>
                        <Input id="newLoanTerm" name="newLoanTerm" type="number" defaultValue="15" required/>
                        {state?.errors?.newLoanTerm && <p className="text-destructive text-sm mt-1">{state.errors.newLoanTerm[0]}</p>}
                    </div>
                     <div>
                        <Label htmlFor="refinanceCosts">Closing Costs</Label>
                        <Input id="refinanceCosts" name="refinanceCosts" type="number" defaultValue="3000" required/>
                        {state?.errors?.refinanceCosts && <p className="text-destructive text-sm mt-1">{state.errors.refinanceCosts[0]}</p>}
                    </div>
                </div>
            </div>
             <SubmitButton />
        </CardContent>
       
      </form>

      {state?.analysis && (
        <>
            <div ref={resultsRef} className="p-6 pt-0">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-primary">Refinancing Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center p-4 rounded-lg bg-background">
                            <h4 className="text-lg font-semibold">AI Recommendation</h4>
                            <p className={`text-xl font-bold ${state.analysis.isRecommended ? 'text-accent' : 'text-destructive'}`}>
                                {state.analysis.recommendation}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-center text-muted-foreground">Monthly Payment</h4>
                                <div className="grid grid-cols-2 text-center gap-2">
                                    <div>
                                        <p className="text-sm">Current</p>
                                        <p className="font-bold text-lg">{formatCurrency(state.analysis.currentMonthlyPayment)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm">New</p>
                                        <p className="font-bold text-lg">{formatCurrency(state.analysis.newMonthlyPayment)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-center text-muted-foreground">Lifetime Savings</h4>
                                <p className="text-center font-bold text-2xl text-accent">
                                    {formatCurrency(state.analysis.lifetimeSavings)}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2">Detailed Analysis</h4>
                            <p className="text-sm text-muted-foreground">{state.analysis.detailedAnalysis}</p>
                        </div>

                    </CardContent>
                </Card>
            </div>
            <CardFooter>
                 <DownloadResults
                    fileName="refinance_analysis"
                    resultsRef={resultsRef}
                />
            </CardFooter>
        </>
      )}
    </Card>
  );
};

export default RefinanceAnalysis;

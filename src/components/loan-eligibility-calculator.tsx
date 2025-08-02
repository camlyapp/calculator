"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { checkLoanEligibilityAction } from '@/app/actions';
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
import { Activity, CheckCircle2, HelpCircle, Loader2, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
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
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
            Check Eligibility
        </Button>
    );
}

const EligibilityIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'Eligible':
            return <CheckCircle2 className="h-16 w-16 text-accent" />;
        case 'Provisional':
            return <HelpCircle className="h-16 w-16 text-primary" />;
        case 'Not Eligible':
            return <XCircle className="h-16 w-16 text-destructive" />;
        default:
            return null;
    }
}

const LoanEligibilityCalculator = () => {
  const [state, formAction] = useActionState(checkLoanEligibilityAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.message && !state.errors && state.result) {
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

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">AI Loan Eligibility Calculator</CardTitle>
        <CardDescription>
          Find out if you're likely to be approved for a loan and get estimated terms.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                    <Input id="monthlyIncome" name="monthlyIncome" type="number" defaultValue="5000" required/>
                    {state?.errors?.monthlyIncome && <p className="text-destructive text-sm mt-1">{state.errors.monthlyIncome[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="monthlyExpenses">Monthly Expenses ($)</Label>
                    <Input id="monthlyExpenses" name="monthlyExpenses" type="number" defaultValue="2000" required/>
                    {state?.errors?.monthlyExpenses && <p className="text-destructive text-sm mt-1">{state.errors.monthlyExpenses[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input id="creditScore" name="creditScore" type="number" defaultValue="720" required/>
                    {state?.errors?.creditScore && <p className="text-destructive text-sm mt-1">{state.errors.creditScore[0]}</p>}
                </div>
                <div>
                    <Label htmlFor="loanAmount">Desired Loan Amount ($)</Label>
                    <Input id="loanAmount" name="loanAmount" type="number" defaultValue="20000" required/>
                     {state?.errors?.loanAmount && <p className="text-destructive text-sm mt-1">{state.errors.loanAmount[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="loanTerm">Desired Loan Term (Years)</Label>
                    <Input id="loanTerm" name="loanTerm" type="number" defaultValue="5" required/>
                     {state?.errors?.loanTerm && <p className="text-destructive text-sm mt-1">{state.errors.loanTerm[0]}</p>}
                </div>
            </div>
             <SubmitButton />
        </CardContent>
       
      </form>

      {state?.result && (
        <>
            <div ref={resultsRef} className="p-6 pt-0">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-primary">Eligibility Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <EligibilityIcon status={state.result.eligibilityStatus} />
                            <div>
                                <h3 className="text-2xl font-bold">{state.result.eligibilityStatus}</h3>
                                <p className="text-muted-foreground">Based on the information provided, here is our analysis of your loan eligibility.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Eligible Amount</p>
                                <p className="font-bold text-2xl">{formatCurrency(state.result.estimatedEligibleAmount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Estimated Rate</p>
                                <p className="font-bold text-2xl">{state.result.estimatedInterestRate.toFixed(2)}%</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">DTI Ratio</p>
                                <p className="font-bold text-2xl">{state.result.debtToIncomeRatio}%</p>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2">Analyst's Notes</h4>
                            <p className="text-sm text-muted-foreground">{state.result.analysis}</p>
                        </div>

                    </CardContent>
                </Card>
            </div>
            <CardFooter>
                 <DownloadResults
                    fileName="loan_eligibility_analysis"
                    resultsRef={resultsRef}
                />
            </CardFooter>
        </>
      )}
    </Card>
  );
};

export default LoanEligibilityCalculator;

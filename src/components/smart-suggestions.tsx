"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getSmartSuggestions } from '@/app/actions';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: undefined,
  suggestions: undefined,
  errors: undefined,
  error: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Get Smart Suggestions
        </Button>
    );
}

const SmartSuggestions = () => {
  const [state, formAction] = useActionState(getSmartSuggestions, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors && state.suggestions) {
        toast({
            title: "Success!",
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
        <CardTitle className="text-2xl">AI-Powered Suggestions</CardTitle>
        <CardDescription>
          Provide more details about your financial situation to receive personalized advice on how to optimize your loan.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                    <Input id="loanAmount" name="loanAmount" type="number" defaultValue="100000" required/>
                    {state?.errors?.loanAmount && <p className="text-destructive text-sm mt-1">{state.errors.loanAmount[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input id="interestRate" name="interestRate" type="number" step="0.01" defaultValue="5.5" required/>
                    {state?.errors?.interestRate && <p className="text-destructive text-sm mt-1">{state.errors.interestRate[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                    <Input id="loanTerm" name="loanTerm" type="number" defaultValue="30" required/>
                    {state?.errors?.loanTerm && <p className="text-destructive text-sm mt-1">{state.errors.loanTerm[0]}</p>}
                </div>
                <div>
                    <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                    <Input id="monthlyIncome" name="monthlyIncome" type="number" defaultValue="6000" required/>
                    {state?.errors?.monthlyIncome && <p className="text-destructive text-sm mt-1">{state.errors.monthlyIncome[0]}</p>}
                </div>
                 <div>
                    <Label htmlFor="monthlyExpenses">Monthly Expenses ($)</Label>
                    <Input id="monthlyExpenses" name="monthlyExpenses" type="number" defaultValue="3500" required/>
                    {state?.errors?.monthlyExpenses && <p className="text-destructive text-sm mt-1">{state.errors.monthlyExpenses[0]}</p>}
                </div>
                <div>
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Select name="riskTolerance" defaultValue="medium">
                        <SelectTrigger id="riskTolerance">
                            <SelectValue placeholder="Select tolerance" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                    {state?.errors?.riskTolerance && <p className="text-destructive text-sm mt-1">{state.errors.riskTolerance[0]}</p>}
                </div>
            </div>
            <div>
                <Label htmlFor="financialGoals">Financial Goals</Label>
                <Textarea id="financialGoals" name="financialGoals" placeholder="e.g., Pay off debt quickly, save for retirement..." defaultValue="Pay off my house in 15 years." required/>
                {state?.errors?.financialGoals && <p className="text-destructive text-sm mt-1">{state.errors.financialGoals[0]}</p>}
            </div>
        </CardContent>
        <CardFooter>
            <SubmitButton />
        </CardFooter>
      </form>

      {state?.suggestions && (
        <div className="p-6 pt-0">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Lightbulb />
                        Your Optimization Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="suggestions">
                            <AccordionTrigger className="text-lg font-semibold">View Suggestions</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc space-y-2 pl-5">
                                    {state.suggestions.suggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="rationale">
                            <AccordionTrigger className="text-lg font-semibold">View Rationale</AccordionTrigger>
                            <AccordionContent>
                                <p>{state.suggestions.rationale}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      )}
    </Card>
  );
};

export default SmartSuggestions;

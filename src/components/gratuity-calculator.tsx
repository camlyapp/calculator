
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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
import DownloadResults from './download-results';
import { calculateGratuityAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

const initialState = {
  message: undefined,
  result: undefined,
  errors: undefined,
  error: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
             {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Calculate Gratuity
        </Button>
    );
}

const GratuityCalculator = () => {
  const [state, formAction] = useActionState(calculateGratuityAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (state?.error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.error,
        })
    }
  }, [state, toast]);

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const result = state?.result;

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Gratuity Calculator (India)</CardTitle>
        <CardDescription>
          Estimate your gratuity amount based on your salary and years of service.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="monthlySalary">Last Drawn Monthly Salary (Basic + DA) (₹)</Label>
                        <Input id="monthlySalary" name="monthlySalary" type="number" placeholder="e.g., 50000" defaultValue="50000" required />
                         {state?.errors?.monthlySalary && <p className="text-destructive text-sm mt-1">{state.errors.monthlySalary[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="yearsOfService">Total Years of Service</Label>
                        <Input id="yearsOfService" name="yearsOfService" type="number" step="0.1" placeholder="e.g., 10.5" defaultValue="10" />
                        {state?.errors?.yearsOfService && <p className="text-destructive text-sm mt-1">{state.errors.yearsOfService[0]}</p>}
                    </div>
                 </div>
                 <SubmitButton />
            </div>

            {result && (
            <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
                <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-center">Estimated Gratuity Amount</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-4xl font-bold text-primary">{formatCurrency(result.gratuityAmount)}</p>
                    <p className="text-xs text-muted-foreground mt-2">Maximum gratuity payable is capped at ₹20,00,000.</p>
                </CardContent>
                </Card>
            </div>
            )}
        </CardContent>
         {result && (
            <CardFooter>
                <DownloadResults
                    fileName="gratuity_estimate"
                    resultsRef={resultsRef}
                />
            </CardFooter>
        )}
      </form>
    </Card>
  );
};

export default GratuityCalculator;

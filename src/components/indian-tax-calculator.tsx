
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DownloadResults from './download-results';
import { calculateIndianTaxAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { useCurrency } from '@/context/currency-context';

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
            Calculate Tax
        </Button>
    );
}


const IndianTaxCalculator = () => {
  const [state, formAction] = useActionState(calculateIndianTaxAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();
  
  useEffect(() => {
    if (state?.error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.error,
        })
    }
  }, [state, toast]);

  const result = state?.result;

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Indian Income Tax Calculator (FY 2023-24)</CardTitle>
        <CardDescription>
          Estimate your income tax liability for Assessment Year 2024-25.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="grossIncome">Annual Gross Income</Label>
                        <Input id="grossIncome" name="grossIncome" type="number" placeholder="e.g., 1000000" defaultValue="1000000" required />
                         {state?.errors?.grossIncome && <p className="text-destructive text-sm mt-1">{state.errors.grossIncome[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="deductions">Total Deductions (Old Regime, e.g., 80C)</Label>
                        <Input id="deductions" name="deductions" type="number" placeholder="e.g., 150000" defaultValue="150000" />
                        {state?.errors?.deductions && <p className="text-destructive text-sm mt-1">{state.errors.deductions[0]}</p>}
                    </div>
                 </div>
                 <div>
                    <Label>Select Tax Regime</Label>
                    <RadioGroup name="taxRegime" defaultValue="new" className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 pt-2">
                        <div className="flex items-center space-x-3 space-y-0">
                           <RadioGroupItem value="new" id="new-regime" />
                           <Label htmlFor="new-regime" className="font-normal">New Tax Regime (Default)</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                           <RadioGroupItem value="old" id="old-regime"/>
                           <Label htmlFor='old-regime' className="font-normal">Old Tax Regime</Label>
                        </div>
                    </RadioGroup>
                     {state?.errors?.taxRegime && <p className="text-destructive text-sm mt-1">{state.errors.taxRegime[0]}</p>}
                 </div>
                 <SubmitButton />
            </div>

            {result && (
            <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
                <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Tax Estimate Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                    <p className="text-muted-foreground">Taxable Income</p>
                    <p className="text-3xl font-bold">{formatCurrency(result.taxableIncome)}</p>
                    </div>
                    <div>
                    <p className="text-muted-foreground">Total Income Tax</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(result.totalTax)}</p>
                    </div>
                    <div>
                    <p className="text-muted-foreground">Effective Tax Rate</p>
                    <p className="text-3xl font-bold text-accent">{result.effectiveRate.toFixed(2)}%</p>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Tax Calculation Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            {result.breakdown.length > 0 && (
                                <>
                                {result.breakdown.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>Tax on {item.bracket}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.tax)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                     <TableCell>Subtotal (Income Tax)</TableCell>
                                    <TableCell className="text-right">{formatCurrency(result.incomeTax)}</TableCell>
                                </TableRow>
                                </>
                            )}
                            <TableRow>
                                <TableCell>Health & Education Cess (4%)</TableCell>
                                <TableCell className="text-right">{formatCurrency(result.cess)}</TableCell>
                            </TableRow>
                            <TableRow className="font-bold text-lg bg-muted/50">
                                <TableCell>Total Tax Liability</TableCell>
                                <TableCell className="text-right">{formatCurrency(result.totalTax)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </div>
            )}
        </CardContent>
      </form>
      {result && (
        <CardFooter>
            <DownloadResults
                fileName="indian_tax_estimate"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default IndianTaxCalculator;

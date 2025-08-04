
"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
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
  const [taxRegime, setTaxRegime] = useState('new');
  
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
                 <h3 className="text-lg font-semibold text-primary border-b pb-2">Income Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="grossIncome">Annual Salary Income</Label>
                        <Input id="grossIncome" name="grossIncome" type="number" placeholder="e.g., 1000000" defaultValue="1000000" required />
                         {state?.errors?.grossIncome && <p className="text-destructive text-sm mt-1">{state.errors.grossIncome[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="otherIncome">Income from Other Sources</Label>
                        <Input id="otherIncome" name="otherIncome" type="number" placeholder="e.g., 50000" defaultValue="50000" />
                        {state?.errors?.otherIncome && <p className="text-destructive text-sm mt-1">{state.errors.otherIncome[0]}</p>}
                    </div>
                 </div>

                 <h3 className="text-lg font-semibold text-primary border-b pb-2">Tax Regime & Deductions</h3>
                 <div>
                    <Label>Select Tax Regime</Label>
                    <RadioGroup name="taxRegime" defaultValue="new" className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 pt-2" onValueChange={(val) => setTaxRegime(val)}>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="deduction80C">Section 80C (PPF, ELSS, etc.)</Label>
                        <Input id="deduction80C" name="deduction80C" type="number" placeholder="e.g., 150000" defaultValue="150000" disabled={taxRegime === 'new'} />
                        {state?.errors?.deduction80C && <p className="text-destructive text-sm mt-1">{state.errors.deduction80C[0]}</p>}
                    </div>
                     <div>
                        <Label htmlFor="deduction80D">Section 80D (Medical Insurance)</Label>
                        <Input id="deduction80D" name="deduction80D" type="number" placeholder="e.g., 25000" defaultValue="25000" disabled={taxRegime === 'new'}/>
                        {state?.errors?.deduction80D && <p className="text-destructive text-sm mt-1">{state.errors.deduction80D[0]}</p>}
                    </div>
                     <div>
                        <Label htmlFor="homeLoanInterest">Home Loan Interest</Label>
                        <Input id="homeLoanInterest" name="homeLoanInterest" type="number" placeholder="e.g., 200000" defaultValue="0" disabled={taxRegime === 'new'}/>
                        {state?.errors?.homeLoanInterest && <p className="text-destructive text-sm mt-1">{state.errors.homeLoanInterest[0]}</p>}
                    </div>
                </div>

                 <SubmitButton />
            </div>

            {result && (
            <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle>Tax Estimate Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-muted-foreground">Total Income</p>
                                <p className="text-2xl font-bold">{formatCurrency(result.totalIncome)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Deductions</p>
                                <p className="text-2xl font-bold">{formatCurrency(result.totalDeductions)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Taxable Income</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(result.taxableIncome)}</p>
                            </div>
                         </div>
                         <Separator />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center pt-4">
                            <div>
                                <p className="text-muted-foreground">Total Income Tax</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(result.totalTax)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Effective Tax Rate</p>
                                <p className="text-3xl font-bold text-accent">{result.effectiveRate.toFixed(2)}%</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Monthly TDS</p>
                                <p className="text-3xl font-bold">{formatCurrency(result.monthlyTds)}</p>
                            </div>
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
                            {result.breakdown.length > 0 ? (
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
                            ) : (
                                <TableRow>
                                    <TableCell>Income Tax</TableCell>
                                    <TableCell className="text-right">{formatCurrency(result.incomeTax)}</TableCell>
                                </TableRow>
                            )}
                             {result.surcharge > 0 && (
                                <TableRow>
                                    <TableCell>Surcharge</TableCell>
                                    <TableCell className="text-right">{formatCurrency(result.surcharge)}</TableCell>
                                </TableRow>
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

"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DownloadResults from './download-results';

const taxSchema = z.object({
  grossIncome: z.coerce.number().min(0, "Income must be a positive number."),
  deductions: z.coerce.number().min(0, "Deductions cannot be negative.").default(0),
  taxRegime: z.enum(['new', 'old']),
});

type TaxFormValues = z.infer<typeof taxSchema>;

const newRegimeSlabs = [
    { from: 0, to: 300000, rate: 0 },
    { from: 300001, to: 600000, rate: 0.05 },
    { from: 600001, to: 900000, rate: 0.10 },
    { from: 900001, to: 1200000, rate: 0.15 },
    { from: 1200001, to: 1500000, rate: 0.20 },
    { from: 1500001, to: Infinity, rate: 0.30 },
];

const oldRegimeSlabs = [
    { from: 0, to: 250000, rate: 0 },
    { from: 250001, to: 500000, rate: 0.05 },
    { from: 500001, to: 1000000, rate: 0.20 },
    { from: 1000001, to: Infinity, rate: 0.30 },
];

const STANDARD_DEDUCTION = 50000;
const CESS_RATE = 0.04;

interface TaxResult {
    taxableIncome: number;
    incomeTax: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
    breakdown: { bracket: string, tax: number }[];
}

const IndianTaxCalculator = () => {
  const [result, setResult] = useState<TaxResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      grossIncome: 1000000,
      deductions: 150000,
      taxRegime: 'new',
    },
  });

  const onSubmit = (values: TaxFormValues) => {
    const { grossIncome, deductions, taxRegime } = values;

    let taxableIncome: number;
    let taxSlabs;

    if (taxRegime === 'new') {
        taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);
        taxSlabs = newRegimeSlabs;
    } else { // Old Regime
        taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION - deductions);
        taxSlabs = oldRegimeSlabs;
    }
    
    let incomeTax = 0;
    let remainingIncome = taxableIncome;
    const breakdown: { bracket: string, tax: number }[] = [];

    for (const slab of taxSlabs) {
        if (remainingIncome <= 0) break;
        const incomeInSlab = Math.min(remainingIncome, slab.to - slab.from + (slab.to === Infinity ? Infinity : 1));
        const taxForSlab = incomeInSlab * slab.rate;
        
        incomeTax += taxForSlab;
        remainingIncome -= incomeInSlab;

        if (taxForSlab > 0) {
            breakdown.push({
                bracket: `₹${slab.from.toLocaleString('en-IN')} - ₹${slab.to === Infinity ? 'Above' : slab.to.toLocaleString('en-IN')} @ ${(slab.rate * 100)}%`,
                tax: taxForSlab,
            });
        }
    }
    
    // Rebate under Section 87A
    if (taxRegime === 'new' && taxableIncome <= 700000) {
        incomeTax = 0;
    } else if (taxRegime === 'old' && taxableIncome <= 500000) {
        incomeTax = Math.max(0, incomeTax - 12500);
    }
    
    const cess = incomeTax * CESS_RATE;
    const totalTax = incomeTax + cess;

    setResult({
        taxableIncome,
        incomeTax,
        cess,
        totalTax,
        effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
        breakdown,
    });
  };

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Indian Income Tax Calculator (FY 2023-24)</CardTitle>
        <CardDescription>
          Estimate your income tax liability for Assessment Year 2024-25.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="grossIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Gross Income (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Deductions (Old Regime, e.g., 80C) (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="taxRegime"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Tax Regime</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="new" />
                          </FormControl>
                          <FormLabel className="font-normal">
                           New Tax Regime (Default)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="old" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Old Tax Regime
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate Tax</Button>
          </form>
        </Form>

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
                    <TableRow>
                        <TableCell>Income Tax</TableCell>
                        <TableCell className="text-right">{formatCurrency(result.incomeTax)}</TableCell>
                    </TableRow>
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

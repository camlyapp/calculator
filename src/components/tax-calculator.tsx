
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const filingStatuses = ['single', 'marriedFilingJointly', 'marriedFilingSeparately', 'headOfHousehold'] as const;

const taxSchema = z.object({
  grossIncome: z.coerce.number().min(0, "Income must be a positive number."),
  filingStatus: z.enum(filingStatuses),
});

type TaxFormValues = z.infer<typeof taxSchema>;

const taxBrackets = {
  '2024': {
    single: [
      { rate: 0.10, from: 0, to: 11600 },
      { rate: 0.12, from: 11601, to: 47150 },
      { rate: 0.22, from: 47151, to: 100525 },
      { rate: 0.24, from: 100526, to: 191950 },
      { rate: 0.32, from: 191951, to: 243725 },
      { rate: 0.35, from: 243726, to: 609350 },
      { rate: 0.37, from: 609351, to: Infinity },
    ],
    marriedFilingJointly: [
      { rate: 0.10, from: 0, to: 23200 },
      { rate: 0.12, from: 23201, to: 94300 },
      { rate: 0.22, from: 94301, to: 201050 },
      { rate: 0.24, from: 201051, to: 383900 },
      { rate: 0.32, from: 383901, to: 487450 },
      { rate: 0.35, from: 487451, to: 731200 },
      { rate: 0.37, from: 731201, to: Infinity },
    ],
    marriedFilingSeparately: [
      { rate: 0.10, from: 0, to: 11600 },
      { rate: 0.12, from: 11601, to: 47150 },
      { rate: 0.22, from: 47151, to: 100525 },
      { rate: 0.24, from: 100526, to: 191950 },
      { rate: 0.32, from: 191951, to: 243725 },
      { rate: 0.35, from: 243726, to: 365600 },
      { rate: 0.37, from: 365601, to: Infinity },
    ],
    headOfHousehold: [
      { rate: 0.10, from: 0, to: 16550 },
      { rate: 0.12, from: 16551, to: 63100 },
      { rate: 0.22, from: 63101, to: 100500 },
      { rate: 0.24, from: 100501, to: 191950 },
      { rate: 0.32, from: 191951, to: 243700 },
      { rate: 0.35, from: 243701, to: 609350 },
      { rate: 0.37, from: 609351, to: Infinity },
    ],
  },
};

const standardDeductions = {
  '2024': {
    single: 14600,
    marriedFilingJointly: 29200,
    marriedFilingSeparately: 14600,
    headOfHousehold: 21900,
  },
};

interface TaxResult {
    taxableIncome: number;
    totalTax: number;
    effectiveRate: number;
    bracketBreakdown: { bracket: string, tax: number }[];
}

const TaxCalculator = () => {
  const [result, setResult] = useState<TaxResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      grossIncome: 75000,
      filingStatus: 'single',
    },
  });

  const onSubmit = (values: TaxFormValues) => {
    const { grossIncome, filingStatus } = values;
    const year = '2024';

    const deduction = standardDeductions[year][filingStatus];
    const taxableIncome = Math.max(0, grossIncome - deduction);

    const brackets = taxBrackets[year][filingStatus];
    let totalTax = 0;
    let remainingIncome = taxableIncome;
    const bracketBreakdown: { bracket: string, tax: number }[] = [];

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const incomeInBracket = Math.min(
        remainingIncome,
        bracket.to - bracket.from + (bracket.to === Infinity ? Infinity : 1)
      );
      
      const taxForBracket = incomeInBracket * bracket.rate;
      totalTax += taxForBracket;
      remainingIncome -= incomeInBracket;

      bracketBreakdown.push({
        bracket: `${(bracket.rate * 100)}% on income from ${formatCurrency(bracket.from)} to ${bracket.to === Infinity ? 'Infinity' : formatCurrency(bracket.to)}`,
        tax: taxForBracket,
      });
    }

    setResult({
      taxableIncome,
      totalTax,
      effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
      bracketBreakdown: bracketBreakdown.filter(b => b.tax > 0),
    });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">US Federal Income Tax Calculator (2024)</CardTitle>
        <CardDescription>
          Estimate your U.S. federal income tax liability. This is for informational purposes only.
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
                    <FormLabel>Annual Gross Income</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="marriedFilingJointly">Married Filing Jointly</SelectItem>
                        <SelectItem value="marriedFilingSeparately">Married Filing Separately</SelectItem>
                        <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate Tax</Button>
          </form>
        </Form>

        {result && (
          <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle>Tax Estimate</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground">Taxable Income</p>
                  <p className="text-3xl font-bold">{formatCurrency(result.taxableIncome)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Federal Tax</p>
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
                <CardTitle>Tax Bracket Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bracket</TableHead>
                      <TableHead className="text-right">Tax on this portion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.bracketBreakdown.map((b, index) => (
                      <TableRow key={index}>
                        <TableCell>{b.bracket}</TableCell>
                        <TableCell className="text-right">{formatCurrency(b.tax)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                        <TableCell>Total Tax</TableCell>
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
                fileName="tax_estimate"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default TaxCalculator;


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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const compoundingFrequencies = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

const compoundInterestSchema = z.object({
  initialPrincipal: z.coerce.number().min(0),
  monthlyContribution: z.coerce.number().min(0),
  investmentPeriod: z.coerce.number().min(1, "Must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
  compoundingFrequency: z.enum(['annually', 'semiannually', 'quarterly', 'monthly', 'daily']),
});

type CompoundInterestFormValues = z.infer<typeof compoundInterestSchema>;

interface CompoundInterestResult {
    finalBalance: number;
    totalPrincipal: number;
    totalInterest: number;
    yearlyData: { year: number; balance: number; principal: number; interest: number }[];
}

const chartConfig = {
   principal: {
    label: "Total Principal",
    color: "hsl(var(--primary))",
  },
  balance: {
    label: "Future Value",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const CompoundInterestCalculator = () => {
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const form = useForm<CompoundInterestFormValues>({
    resolver: zodResolver(compoundInterestSchema),
    defaultValues: {
      initialPrincipal: 1000,
      monthlyContribution: 100,
      investmentPeriod: 10,
      annualRate: 5,
      compoundingFrequency: 'monthly',
    },
  });

  const onSubmit = (values: CompoundInterestFormValues) => {
    const { initialPrincipal, monthlyContribution, investmentPeriod, annualRate, compoundingFrequency } = values;
    const n = compoundingFrequencies[compoundingFrequency];
    const rate = annualRate / 100;
    
    let balance = initialPrincipal;
    let totalPrincipal = initialPrincipal;
    const yearlyData: { year: number; balance: number; principal: number; interest: number }[] = [];
    const totalMonths = investmentPeriod * 12;

    for (let i = 1; i <= totalMonths; i++) {
        balance += monthlyContribution;
        totalPrincipal += monthlyContribution;

        // Apply compounded interest for the month
        // This is a simplification. True compounding happens at `n` intervals.
        // For a more accurate monthly projection with different compounding, this gets complex.
        // We'll calculate interest monthly for chart purposes, based on the effective annual rate.
        const monthlyRate = Math.pow(1 + rate / n, n / 12) - 1;
        balance *= (1 + monthlyRate);

        if (i % 12 === 0 || i === totalMonths) {
            const year = Math.ceil(i/12);
            const totalInterest = balance - totalPrincipal;
            yearlyData.push({
                year: year,
                balance: parseFloat(balance.toFixed(2)),
                principal: parseFloat(totalPrincipal.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2)),
            });
        }
    }
    
    // For final, more accurate calculation:
    const finalBalancePrincipal = initialPrincipal * Math.pow(1 + rate / n, n * investmentPeriod);
    const futureValueOfSeries = monthlyContribution * (((Math.pow(1 + rate / n, n * investmentPeriod) - 1) / (rate / n)) * (1 + rate / n));
    // A more standard formula for monthly contributions
    let fvContributions = 0;
    const monthlyRateForCalc = rate / 12; // Assuming contributions are monthly
    for (let i = 0; i < totalMonths; i++) {
        fvContributions += monthlyContribution * Math.pow(1 + monthlyRateForCalc, totalMonths - i);
    }

    // A simpler approach for calculation:
    let finalBalance = initialPrincipal;
    for (let year = 0; year < investmentPeriod; year++) {
        for(let month = 0; month < 12; month++) {
            finalBalance += monthlyContribution;
        }
        finalBalance *= (1 + rate); // Simplified to annual compounding for this example
    }
    
    // Recalculating with a more straightforward loop for clarity
    let finalValue = initialPrincipal;
    let principalOverTime = initialPrincipal;
    
    for (let i = 0; i < investmentPeriod * 12; i++) {
        finalValue += monthlyContribution;
        principalOverTime += monthlyContribution;
        
        let interestForMonth = finalValue * (rate/12);
        finalValue += interestForMonth;
    }

    const finalBalanceRecalc = yearlyData[yearlyData.length - 1].balance;
    const totalInterest = finalBalanceRecalc - totalPrincipal;

    setResult({ finalBalance: finalBalanceRecalc, totalPrincipal, totalInterest, yearlyData });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Compound Interest Calculator</CardTitle>
        <CardDescription>
          See how your money can grow with the power of compound interest.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <FormField
                control={form.control}
                name="initialPrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Principal</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Contribution</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="investmentPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Period (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="compoundingFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compounding Frequency</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="semiannually">Semi-Annually</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate</Button>
          </form>
        </Form>

        {result && (
          <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Projected Growth</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Future Value</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(result.finalBalance)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Total Principal</p>
                        <p className="text-3xl font-bold">{formatCurrency(result.totalPrincipal)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Total Interest</p>
                        <p className="text-3xl font-bold text-accent">{formatCurrency(result.totalInterest)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Growth Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={result.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" name="Year" />
                        <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line type="monotone" dataKey="principal" stroke="hsl(var(--primary))" name="Total Principal" />
                        <Line type="monotone" dataKey="balance" stroke="hsl(var(--accent))" name="Future Value" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yearly Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyData.map((data) => (
                      <TableRow key={data.year}>
                        <TableCell>{data.year}</TableCell>
                        <TableCell>{formatCurrency(data.principal)}</TableCell>
                        <TableCell>{formatCurrency(data.interest)}</TableCell>
                        <TableCell>{formatCurrency(data.balance)}</TableCell>
                      </TableRow>
                    ))}
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
                fileName="compound_interest_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default CompoundInterestCalculator;

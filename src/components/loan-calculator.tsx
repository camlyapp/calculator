
"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  AmortizationRow,
  CalculationResult,
  LoanFormValues,
  LoanSchema,
  ChartData,
} from '@/lib/types';
import { generateAmortizationSchedule } from '@/lib/loan-utils';
import AmortizationTable from './amortization-table';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { format } from 'date-fns';
import { Separator } from './ui/separator';
import DownloadResults from './download-results';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const chartConfig = {
  Principal: {
    label: 'Principal',
    color: 'hsl(var(--primary))',
  },
  Interest: {
    label: 'Interest',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

type Currency = 'USD' | 'INR';

const LoanCalculator = () => {
  const [result, setResult] = useState<Partial<CalculationResult> | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<Pick<LoanFormValues, 'loanAmount' | 'interestRate' | 'loanTerm' | 'extraPayment'>>({
    resolver: zodResolver(LoanSchema.pick({ loanAmount: true, interestRate: true, loanTerm: true, extraPayment: true })),
    defaultValues: {
      loanAmount: 100000,
      interestRate: 5.5,
      loanTerm: 10,
      extraPayment: 0,
    },
  });

  const onSubmit = (values: Pick<LoanFormValues, 'loanAmount' | 'interestRate' | 'loanTerm' | 'extraPayment'>) => {
    const { loanAmount, interestRate, loanTerm, extraPayment = 0 } = values;

    const { schedule: calculatedSchedule, monthlyPayment: principalAndInterest } = generateAmortizationSchedule(loanAmount, interestRate, loanTerm, extraPayment);
    
    const totalInterest = calculatedSchedule.reduce((acc, row) => acc + row.interest, 0);
    const totalPayment = loanAmount + totalInterest;
    
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + calculatedSchedule.length);

    const newResult: Partial<CalculationResult> = {
        principalAndInterest,
        totalMonthlyPayment: principalAndInterest + (extraPayment || 0),
        totalInterest,
        totalPayment,
        payoffDate: format(payoffDate, 'MMMM yyyy'),
    };

    if (extraPayment && extraPayment > 0) {
        const { schedule: originalSchedule } = generateAmortizationSchedule(loanAmount, interestRate, loanTerm, 0);
        newResult.originalTotalInterest = originalSchedule.reduce((acc, row) => acc + row.interest, 0);
        newResult.interestSaved = newResult.originalTotalInterest - totalInterest;
        const monthsSaved = originalSchedule.length - calculatedSchedule.length;
        const yearsSaved = Math.floor(monthsSaved / 12);
        const remainingMonthsSaved = monthsSaved % 12;
        newResult.payoffTimeSaved = `${yearsSaved} year(s) and ${remainingMonthsSaved} month(s)`;
    }

    setResult(newResult);
    setAmortizationSchedule(calculatedSchedule);

    // Prepare chart data for stacked bar chart
    const yearlyData: { [key: number]: { Principal: number, Interest: number } } = {};
    calculatedSchedule.forEach(row => {
        const year = Math.ceil(row.month / 12);
        if (!yearlyData[year]) {
            yearlyData[year] = { Principal: 0, Interest: 0 };
        }
        yearlyData[year].Principal += (row.principal);
        yearlyData[year].Interest += row.interest;
    });

    setChartData(Object.entries(yearlyData).map(([year, data]) => ({
        name: `Year ${year}`,
        Principal: parseFloat(data.Principal.toFixed(2)),
        Interest: parseFloat(data.Interest.toFixed(2)),
    })));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const formatCurrencyAxis = (value: number) => {
      const symbol = currency === 'INR' ? '₹' : '$';
      if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
      return `${symbol}${value}`;
  }


  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Advanced EMI Calculator</CardTitle>
              <CardDescription>
                Enter your loan details to see a payment breakdown and amortization schedule.
              </CardDescription>
            </div>
            <div className="mt-4 sm:mt-0">
                <Label htmlFor="currency-select">Currency</Label>
                 <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                    <SelectTrigger id="currency-select" className="w-[180px]">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="extraPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Monthly Payment</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate</Button>
          </form>
        </Form>

        {result && result.totalMonthlyPayment !== undefined && (
          <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle>Monthly Payment</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center'>
                        <p className="text-4xl font-bold text-primary">
                            {formatCurrency(result.totalMonthlyPayment)}
                        </p>
                        {form.getValues('extraPayment') > 0 && result.principalAndInterest && (
                             <p className="text-sm text-muted-foreground mt-2">
                                ({formatCurrency(result.principalAndInterest)} base + {formatCurrency(form.getValues('extraPayment'))} extra)
                             </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Principal</span>
                        <span className="font-semibold text-lg">{formatCurrency(form.getValues('loanAmount'))}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold text-lg">{formatCurrency(result.totalInterest!)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Payoff Date</span>
                        <span className="font-bold text-lg">{result.payoffDate}</span>
                      </div>
                    </CardContent>
                </Card>
            </div>


            {result.interestSaved !== undefined && result.interestSaved > 0 && (
                <Card className="bg-accent/20 border-accent">
                    <CardHeader>
                        <CardTitle className="text-accent-foreground">Extra Payment Savings</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                        <div>
                            <p className="font-semibold">Interest Saved</p>
                            <p className="text-2xl font-bold text-accent">{formatCurrency(result.interestSaved)}</p>
                        </div>
                         <div>
                            <p className="font-semibold">Payoff Time Saved</p>
                            <p className="text-2xl font-bold text-accent">{result.payoffTimeSaved}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Loan Principal vs. Interest</CardTitle>
                <CardDescription>This chart shows the breakdown of principal and interest payments over the life of the loan.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                     <YAxis
                        tickFormatter={formatCurrencyAxis}
                     />
                    <ChartTooltipContent indicator="dot" formatter={(value, name) => <div>{name}: {formatCurrency(value as number)}</div>} />
                    <Bar dataKey="Principal" stackId="a" fill="var(--color-Principal)" />
                    <Bar dataKey="Interest" stackId="a" fill="var(--color-Interest)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <AmortizationTable data={amortizationSchedule} currency={currency} />
          </div>
        )}
      </CardContent>
      {result && (
        <CardFooter>
            <DownloadResults
                fileName="loan_analysis"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default LoanCalculator;

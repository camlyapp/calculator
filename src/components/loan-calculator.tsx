"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
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
import { ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';
import { Separator } from './ui/separator';

const LoanCalculator = () => {
  const [result, setResult] = useState<Partial<CalculationResult> | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

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

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Simple Loan Calculator</CardTitle>
        <CardDescription>
          Enter your loan details to see a payment breakdown and amortization schedule.
        </CardDescription>
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
                    <FormLabel>Loan Amount ($)</FormLabel>
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
                    <FormLabel>Extra Monthly Payment ($)</FormLabel>
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
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle>Monthly Payment</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center'>
                        <p className="text-4xl font-bold text-primary">
                            ${result.totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {form.getValues('extraPayment') > 0 && (
                             <p className="text-sm text-muted-foreground mt-2">
                                (${result.principalAndInterest?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} base + ${form.getValues('extraPayment').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} extra)
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
                        <span className="font-semibold text-lg">${form.getValues('loanAmount').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold text-lg">${result.totalInterest?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                            <p className="text-2xl font-bold text-accent">${result.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                <div className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="Principal" stackId="a" fill="hsl(var(--primary))" />
                        <Bar dataKey="Interest" stackId="a" fill="hsl(var(--accent))" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <AmortizationTable data={amortizationSchedule} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanCalculator;

    
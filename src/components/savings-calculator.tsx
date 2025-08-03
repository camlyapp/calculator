
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
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const savingsSchema = z.object({
  savingsGoal: z.coerce.number().min(1, "Savings goal must be greater than 0."),
  initialSavings: z.coerce.number().min(0),
  timeToSave: z.coerce.number().min(1, "Must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
});

type SavingsFormValues = z.infer<typeof savingsSchema>;

interface SavingsResult {
    requiredMonthlySavings: number;
    totalPrincipal: number;
    totalInterest: number;
    yearlyData: { year: number; balance: number; }[];
}

const SavingsCalculator = () => {
  const [result, setResult] = useState<SavingsResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const form = useForm<SavingsFormValues>({
    resolver: zodResolver(savingsSchema),
    defaultValues: {
      savingsGoal: 100000,
      initialSavings: 10000,
      timeToSave: 10,
      annualRate: 5,
    },
  });

  const onSubmit = (values: SavingsFormValues) => {
    const { savingsGoal, initialSavings, timeToSave, annualRate } = values;
    const monthlyRate = annualRate / 100 / 12;
    const months = timeToSave * 12;

    // Calculate future value of initial savings
    const fvInitial = initialSavings * Math.pow(1 + monthlyRate, months);

    // Calculate required monthly savings
    // FV = P * ((1+r)^n - 1) / r  => P = FV * r / ((1+r)^n - 1)
    const requiredFvFromContributions = savingsGoal - fvInitial;
    let requiredMonthlySavings = 0;
    if (requiredFvFromContributions > 0) {
       requiredMonthlySavings = monthlyRate > 0
        ? (requiredFvFromContributions * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
        : requiredFvFromContributions / months;
    }
    
    // Generate yearly data for chart
    let balance = initialSavings;
    const yearlyData: { year: number; balance: number; }[] = [{ year: 0, balance: initialSavings }];
    for (let i = 1; i <= months; i++) {
        balance += requiredMonthlySavings;
        balance *= (1 + monthlyRate);
        if (i % 12 === 0) {
            const year = i / 12;
            yearlyData.push({
                year: year,
                balance: parseFloat(balance.toFixed(2)),
            });
        }
    }
    
    const totalPrincipal = initialSavings + (requiredMonthlySavings * months);
    const totalInterest = savingsGoal - totalPrincipal;

    setResult({ 
        requiredMonthlySavings, 
        totalPrincipal, 
        totalInterest,
        yearlyData 
    });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Savings Goal Calculator</CardTitle>
        <CardDescription>
          Find out how much you need to save each month to reach your financial goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="savingsGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Savings Goal</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initialSavings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Savings</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeToSave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time to Save (Years)</FormLabel>
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
                    <FormLabel>Estimated Annual Return (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
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
                    <CardTitle>Your Savings Plan</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Required Monthly Savings</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(result.requiredMonthlySavings)}</p>
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
                <CardTitle>Path to Your Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={result.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" name="Year" unit="yr" />
                        <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" name="Projected Savings" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
      {result && (
        <CardFooter>
            <DownloadResults
                fileName="savings_plan"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default SavingsCalculator;

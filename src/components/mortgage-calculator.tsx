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
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';
import { Separator } from './ui/separator';
import DownloadResults from './download-results';

const chartConfig = {
  "Principal & Interest": {
    label: "Principal & Interest",
    color: "hsl(var(--primary))",
  },
  "Property Tax": {
    label: "Property Tax",
    color: "hsl(var(--chart-2))",
  },
  "Home Insurance": {
    label: "Home Insurance",
    color: "hsl(var(--chart-3))",
  },
  "HOA Dues": {
    label: "HOA Dues",
    color: "hsl(var(--chart-4))",
  },
  Principal: {
    label: 'Principal',
    color: 'hsl(var(--primary))',
  },
  Interest: {
    label: 'Interest',
    color: 'hsl(var(--accent))',
  },
};

const MortgageCalculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(LoanSchema),
    defaultValues: {
      loanAmount: 250000,
      interestRate: 6.5,
      loanTerm: 30,
      extraPayment: 0,
      propertyTax: 3000,
      homeInsurance: 1500,
      hoaDues: 0,
    },
  });

  const onSubmit = (values: LoanFormValues) => {
    const { loanAmount, interestRate, loanTerm, extraPayment = 0, propertyTax = 0, homeInsurance = 0, hoaDues = 0 } = values;

    const { schedule: calculatedSchedule, monthlyPayment: principalAndInterest } = generateAmortizationSchedule(loanAmount, interestRate, loanTerm, extraPayment);

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthlyPayment = principalAndInterest + monthlyTax + monthlyInsurance + hoaDues;

    const totalInterest = calculatedSchedule.reduce((acc, row) => acc + row.interest, 0);
    const totalPayment = loanAmount + totalInterest;
    
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + calculatedSchedule.length);

    const newResult: CalculationResult = {
        principalAndInterest,
        totalMonthlyPayment,
        propertyTax: monthlyTax,
        homeInsurance: monthlyInsurance,
        hoaDues,
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

  const pieChartData = result ? [
    { name: 'Principal & Interest', value: result.principalAndInterest, fill: 'var(--color-Principal & Interest)' },
    { name: 'Property Tax', value: result.propertyTax, fill: 'var(--color-Property Tax)' },
    { name: 'Home Insurance', value: result.homeInsurance, fill: 'var(--color-Home Insurance)' },
    { name: 'HOA Dues', value: result.hoaDues, fill: 'var(--color-HOA Dues)' },
  ].filter(item => item.value > 0) : [];

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Advanced Mortgage Calculator</CardTitle>
        <CardDescription>
          Enter your loan details including taxes and insurance for a complete monthly payment estimate.
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
                      <Input type="number" placeholder="e.g., 250000" {...field} />
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
                      <Input type="number" step="0.01" placeholder="e.g., 3.5" {...field} />
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
                      <Input type="number" placeholder="e.g., 30" {...field} />
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
               <FormField
                control={form.control}
                name="propertyTax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Property Tax ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeInsurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Home Insurance ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hoaDues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly HOA Dues ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 200" {...field} />
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-2 bg-secondary/50">
                <CardHeader>
                  <CardTitle>Total Monthly Payment</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center justify-center'>
                  <p className="text-4xl font-bold text-primary">
                    ${result.totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square h-[250px] w-full"
                    >
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieChartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill as string} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                 <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Principal & Interest</span>
                    <span className="font-semibold text-lg">${result.principalAndInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Property Tax</span>
                    <span className="font-semibold text-lg">${result.propertyTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Home Insurance</span>
                    <span className="font-semibold text-lg">${result.homeInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                   <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">HOA Dues</span>
                    <span className="font-semibold text-lg">${result.hoaDues.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                <CardDescription>This chart shows the breakdown of principal and interest payments over the life of the loan, excluding taxes, insurance, or HOA fees.</CardDescription>
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
                        tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                     />
                    <ChartTooltipContent indicator="dot" />
                    <Bar dataKey="Principal" stackId="a" fill="var(--color-Principal)" />
                    <Bar dataKey="Interest" stackId="a" fill="var(--color-Interest)" />
                    </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <AmortizationTable data={amortizationSchedule} />
          </div>
        )}
      </CardContent>
       {result && (
        <CardFooter>
            <DownloadResults
                fileName="mortgage_analysis"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default MortgageCalculator;

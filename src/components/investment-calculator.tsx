
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
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const investmentSchema = z.object({
  initialInvestment: z.coerce.number().min(0),
  monthlyContribution: z.coerce.number().min(0),
  investmentPeriod: z.coerce.number().min(1, "Must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

interface InvestmentResult {
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
    label: "Total Balance",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const InvestmentCalculator = () => {
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      initialInvestment: 10000,
      monthlyContribution: 500,
      investmentPeriod: 10,
      annualRate: 7,
    },
  });

  const onSubmit = (values: InvestmentFormValues) => {
    const { initialInvestment, monthlyContribution, investmentPeriod, annualRate } = values;
    const monthlyRate = annualRate / 100 / 12;
    const months = investmentPeriod * 12;
    let balance = initialInvestment;
    let totalPrincipal = initialInvestment;
    
    const yearlyData: { year: number; balance: number; principal: number; interest: number }[] = [];

    for (let i = 1; i <= months; i++) {
        balance += monthlyContribution;
        totalPrincipal += monthlyContribution;
        balance *= (1 + monthlyRate);

        if (i % 12 === 0 || i === months) {
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
    
    const finalBalance = balance;
    const totalInterest = finalBalance - totalPrincipal;

    setResult({ finalBalance, totalPrincipal, totalInterest, yearlyData });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Investment Growth Calculator</CardTitle>
        <CardDescription>
          Project the future value of your investments with this calculator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Investment</FormLabel>
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
                    <FormLabel>Expected Annual Return (%)</FormLabel>
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
                    <CardTitle>Investment Projection</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Final Balance</p>
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
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(value as number)}/>
                        <Legend />
                        <Line type="monotone" dataKey="principal" stroke="hsl(var(--primary))" name="Total Principal" />
                        <Line type="monotone" dataKey="balance" stroke="hsl(var(--accent))" name="Total Balance" />
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
                fileName="investment_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default InvestmentCalculator;

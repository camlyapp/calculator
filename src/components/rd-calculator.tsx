
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

const rdSchema = z.object({
  monthlyDeposit: z.coerce.number().min(1, "Monthly deposit must be greater than 0."),
  tenure: z.coerce.number().min(1, "Tenure must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
});

type RdFormValues = z.infer<typeof rdSchema>;

interface RdResult {
    maturityValue: number;
    totalInvested: number;
    totalInterest: number;
    yearlyData: { year: number; invested: number; balance: number; }[];
}

type Currency = 'USD' | 'INR';

interface RdCalculatorProps {
    currency: Currency;
}

const chartConfig = {
  invested: {
    label: "Total Invested",
    color: "hsl(var(--primary))",
  },
  balance: {
    label: "Total Value",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


const RdCalculator = ({ currency }: RdCalculatorProps) => {
  const [result, setResult] = useState<RdResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<RdFormValues>({
    resolver: zodResolver(rdSchema),
    defaultValues: {
      monthlyDeposit: 1000,
      tenure: 5,
      annualRate: 6.5,
    },
  });

  const onSubmit = (values: RdFormValues) => {
    const { monthlyDeposit, tenure, annualRate } = values;
    const quarterlyRate = annualRate / 100 / 4;
    const months = tenure * 12;
    
    let balance = 0;
    let totalInvested = 0;
    
    const yearlyData: { year: number; invested: number; balance: number; }[] = [{ year: 0, invested: 0, balance: 0 }];

    for (let i = 1; i <= months; i++) {
        balance += monthlyDeposit;
        totalInvested += monthlyDeposit;
        
        // Compound interest quarterly
        if (i % 3 === 0) {
            balance *= (1 + quarterlyRate);
        }
        
        if (i % 12 === 0) {
            const year = i / 12;
            yearlyData.push({
                year: year,
                invested: parseFloat(totalInvested.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
            });
        }
    }
    
    // Ensure the final month's data is captured if tenure is not a full year multiple for the loop
    if (months % 12 !== 0) {
        yearlyData.push({
            year: tenure,
            invested: parseFloat(totalInvested.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)),
        });
    }

    const maturityValue = balance;
    const totalInterest = maturityValue - totalInvested;

    setResult({ maturityValue, totalInvested, totalInterest, yearlyData });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Recurring Deposit (RD) Calculator</CardTitle>
        <CardDescription>
          Calculate the maturity value of your Recurring Deposit with quarterly compounding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="monthlyDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Deposit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenure (Years)</FormLabel>
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
                    <FormLabel>Interest Rate (% p.a.)</FormLabel>
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
                    <CardTitle>RD Projection</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Total Invested</p>
                        <p className="text-3xl font-bold">{formatCurrency(result.totalInvested)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Interest Earned</p>
                        <p className="text-3xl font-bold text-accent">{formatCurrency(result.totalInterest)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Maturity Value</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(result.maturityValue)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Growth Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={result.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" name="Year" unit="yr" />
                        <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line type="monotone" dataKey="invested" stroke="hsl(var(--primary))" name="Total Invested" />
                        <Line type="monotone" dataKey="balance" stroke="hsl(var(--accent))" name="Total Value" />
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
                      <TableHead>Amount Invested</TableHead>
                      <TableHead>Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyData.slice(1).map((data) => (
                      <TableRow key={data.year}>
                        <TableCell>{data.year}</TableCell>
                        <TableCell>{formatCurrency(data.invested)}</TableCell>
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
                fileName="rd_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default RdCalculator;

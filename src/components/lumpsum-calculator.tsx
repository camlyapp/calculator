
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

const lumpsumSchema = z.object({
  initialInvestment: z.coerce.number().min(1, "Initial investment must be greater than 0."),
  investmentPeriod: z.coerce.number().min(1, "Must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
});

type LumpsumFormValues = z.infer<typeof lumpsumSchema>;

interface LumpsumResult {
    finalBalance: number;
    totalInvested: number;
    totalInterest: number;
    yearlyData: { year: number; balance: number; }[];
}

const chartConfig = {
  invested: {
    label: "Invested",
    color: "hsl(var(--primary))",
  },
  balance: {
    label: "Total Value",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


const LumpsumCalculator = () => {
  const [result, setResult] = useState<LumpsumResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { currency, formatCurrency } = useCurrency();

  const form = useForm<LumpsumFormValues>({
    resolver: zodResolver(lumpsumSchema),
    defaultValues: {
      initialInvestment: 25000,
      investmentPeriod: 10,
      annualRate: 12,
    },
  });

  const onSubmit = (values: LumpsumFormValues) => {
    const { initialInvestment, investmentPeriod, annualRate } = values;
    const yearlyRate = annualRate / 100;
    
    let balance = initialInvestment;
    
    const yearlyData: { year: number; balance: number; }[] = [{ year: 0, balance: balance }];

    for (let i = 1; i <= investmentPeriod; i++) {
        balance *= (1 + yearlyRate);
        yearlyData.push({
            year: i,
            balance: parseFloat(balance.toFixed(2)),
        });
    }
    
    const finalBalance = balance;
    const totalInterest = finalBalance - initialInvestment;

    setResult({ 
        finalBalance, 
        totalInvested: initialInvestment, 
        totalInterest, 
        yearlyData 
    });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Lumpsum Investment Calculator</CardTitle>
        <CardDescription>
          Project the growth of your one-time investment over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lumpsum Amount</FormLabel>
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
                    <FormLabel>Expected Return Rate (%)</FormLabel>
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
                    <CardTitle>Lumpsum Projection</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Amount Invested</p>
                        <p className="text-3xl font-bold">{formatCurrency(result.totalInvested)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Wealth Gained</p>
                        <p className="text-3xl font-bold text-accent">{formatCurrency(result.totalInterest)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Future Value</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(result.finalBalance)}</p>
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
                      <TableHead>Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyData.slice(1).map((data) => (
                      <TableRow key={data.year}>
                        <TableCell>{data.year}</TableCell>
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
                fileName="lumpsum_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default LumpsumCalculator;

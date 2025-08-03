
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

const ppfSchema = z.object({
  yearlyInvestment: z.coerce.number().min(500, "Minimum investment is ₹500.").max(150000, "Maximum investment is ₹1,50,000."),
  annualRate: z.coerce.number().min(0),
});

type PpfFormValues = z.infer<typeof ppfSchema>;

interface PpfResult {
    maturityValue: number;
    totalInvested: number;
    totalInterest: number;
    yearlyData: { year: number; invested: number; interest: number; balance: number; }[];
}

type Currency = 'USD' | 'INR';

interface PpfCalculatorProps {
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


const PpfCalculator = ({ currency }: PpfCalculatorProps) => {
  const [result, setResult] = useState<PpfResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const tenure = 15; // PPF tenure is fixed at 15 years

  const form = useForm<PpfFormValues>({
    resolver: zodResolver(ppfSchema),
    defaultValues: {
      yearlyInvestment: 150000,
      annualRate: 7.1,
    },
  });

  const onSubmit = (values: PpfFormValues) => {
    const { yearlyInvestment, annualRate } = values;
    const rate = annualRate / 100;
    
    let balance = 0;
    let totalInvested = 0;
    
    const yearlyData: { year: number; invested: number; interest: number; balance: number; }[] = [];

    for (let i = 1; i <= tenure; i++) {
        balance += yearlyInvestment;
        totalInvested += yearlyInvestment;
        const interestForTheYear = balance * rate;
        balance += interestForTheYear;
        
        yearlyData.push({
            year: i,
            invested: parseFloat(totalInvested.toFixed(2)),
            interest: parseFloat(interestForTheYear.toFixed(2)),
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
        <CardTitle className="text-2xl">Public Provident Fund (PPF) Calculator</CardTitle>
        <CardDescription>
          Calculate the maturity value of your PPF investment over the 15-year tenure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="yearlyInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Investment</FormLabel>
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
               <FormItem>
                    <FormLabel>Tenure (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" value={tenure} disabled />
                    </FormControl>
                </FormItem>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate</Button>
          </form>
        </Form>

        {result && (
          <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>PPF Projection</CardTitle>
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
                      <TableHead>Interest Earned</TableHead>
                      <TableHead>Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyData.map((data) => (
                      <TableRow key={data.year}>
                        <TableCell>{data.year}</TableCell>
                        <TableCell>{formatCurrency(data.invested)}</TableCell>
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
                fileName="ppf_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default PpfCalculator;

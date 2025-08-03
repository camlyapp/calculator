
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCurrency } from '@/context/currency-context';

const compoundingFrequencies = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
};

const fdSchema = z.object({
  principalAmount: z.coerce.number().min(1, "Principal must be greater than 0."),
  tenure: z.coerce.number().min(1, "Tenure must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
  compoundingFrequency: z.enum(['annually', 'semiannually', 'quarterly', 'monthly']),
});

type FdFormValues = z.infer<typeof fdSchema>;

interface FdResult {
    maturityValue: number;
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


const FdCalculator = () => {
  const [result, setResult] = useState<FdResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { currency, formatCurrency } = useCurrency();

  const form = useForm<FdFormValues>({
    resolver: zodResolver(fdSchema),
    defaultValues: {
      principalAmount: 50000,
      tenure: 5,
      annualRate: 7.5,
      compoundingFrequency: 'quarterly',
    },
  });

  const onSubmit = (values: FdFormValues) => {
    const { principalAmount, tenure, annualRate, compoundingFrequency } = values;
    const rate = annualRate / 100;
    const n = compoundingFrequencies[compoundingFrequency];
    
    let balance = principalAmount;
    
    const yearlyData: { year: number; balance: number; }[] = [{ year: 0, balance: balance }];

    for (let i = 1; i <= tenure; i++) {
        balance = principalAmount * Math.pow(1 + rate / n, n * i);
        yearlyData.push({
            year: i,
            balance: parseFloat(balance.toFixed(2)),
        });
    }
    
    const maturityValue = balance;
    const totalInterest = maturityValue - principalAmount;

    setResult({ 
        maturityValue, 
        totalInvested: principalAmount, 
        totalInterest, 
        yearlyData 
    });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Fixed Deposit (FD) Calculator</CardTitle>
        <CardDescription>
          Calculate the maturity value of your Fixed Deposit investment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="principalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Amount</FormLabel>
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
                    <CardTitle>FD Projection</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Principal Amount</p>
                        <p className="text-3xl font-bold">{formatCurrency(result.totalInvested)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Total Interest</p>
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
                fileName="fd_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default FdCalculator;


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
import { ChartTooltipContent } from '@/components/ui/chart';
import DownloadResults from './download-results';

const sipSchema = z.object({
  monthlyInvestment: z.coerce.number().min(0),
  initialInvestment: z.coerce.number().min(0).optional().default(0),
  investmentPeriod: z.coerce.number().min(1, "Must be at least 1 year."),
  annualRate: z.coerce.number().min(0),
  annualStepUp: z.coerce.number().min(0).optional().default(0),
});

type SipFormValues = z.infer<typeof sipSchema>;

interface SipResult {
    finalBalance: number;
    totalInvested: number;
    totalInterest: number;
    yearlyData: { year: number; invested: number; balance: number; }[];
}

type Currency = 'USD' | 'INR';

interface SipCalculatorProps {
    currency: Currency;
}

const SipCalculator = ({ currency }: SipCalculatorProps) => {
  const [result, setResult] = useState<SipResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<SipFormValues>({
    resolver: zodResolver(sipSchema),
    defaultValues: {
      monthlyInvestment: 5000,
      initialInvestment: 0,
      investmentPeriod: 15,
      annualRate: 12,
      annualStepUp: 10,
    },
  });

  const onSubmit = (values: SipFormValues) => {
    const { monthlyInvestment, initialInvestment, investmentPeriod, annualRate, annualStepUp } = values;
    const monthlyRate = annualRate / 100 / 12;
    const months = investmentPeriod * 12;
    
    let balance = initialInvestment || 0;
    let totalInvested = initialInvestment || 0;
    let currentMonthlySip = monthlyInvestment;
    
    const yearlyData: { year: number; invested: number; balance: number; }[] = [{ year: 0, invested: totalInvested, balance: balance }];

    for (let i = 1; i <= months; i++) {
        balance += currentMonthlySip;
        totalInvested += currentMonthlySip;
        balance *= (1 + monthlyRate);

        if (i % 12 === 0) {
            const year = i / 12;
            yearlyData.push({
                year: year,
                invested: parseFloat(totalInvested.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
            });
            // Apply annual step-up
            if (annualStepUp > 0) {
                 currentMonthlySip *= (1 + (annualStepUp/100));
            }
        }
    }
    
    const finalBalance = balance;
    const totalInterest = finalBalance - totalInvested;

    setResult({ finalBalance, totalInvested, totalInterest, yearlyData });
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
        <CardTitle className="text-2xl">Advanced SIP Calculator</CardTitle>
        <CardDescription>
          Project your investment growth with a Systematic Investment Plan, including annual step-up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <FormField
                control={form.control}
                name="monthlyInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Investment</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Investment (Optional)</FormLabel>
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
               <FormField
                control={form.control}
                name="annualStepUp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Step-Up (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                    <CardTitle>SIP Projection</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Total Invested</p>
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
                <div className="h-[400px] w-full">
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
                </div>
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
                fileName="sip_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default SipCalculator;

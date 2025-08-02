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

const retirementSchema = z.object({
  currentAge: z.coerce.number().min(18, "Must be at least 18."),
  retirementAge: z.coerce.number().min(19, "Must be older than current age."),
  currentSavings: z.coerce.number().min(0),
  monthlyContribution: z.coerce.number().min(0),
  preRetirementAnnualRate: z.coerce.number().min(0),
  postRetirementAnnualRate: z.coerce.number().min(0),
  desiredMonthlyIncome: z.coerce.number().min(0),
  lifeExpectancy: z.coerce.number().min(1, "Must be older than retirement age."),
}).refine(data => data.retirementAge > data.currentAge, {
  message: "Retirement age must be greater than current age.",
  path: ["retirementAge"],
}).refine(data => data.lifeExpectancy > data.retirementAge, {
  message: "Life expectancy must be greater than retirement age.",
  path: ["lifeExpectancy"],
});

type RetirementFormValues = z.infer<typeof retirementSchema>;

interface RetirementResult {
  requiredNestEgg: number;
  projectedSavings: number;
  shortfallOrSurplus: number;
  yearlyData: { year: number; age: number; balance: number; }[];
}

const RetirementCalculator = () => {
  const [result, setResult] = useState<RetirementResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<RetirementFormValues>({
    resolver: zodResolver(retirementSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      monthlyContribution: 500,
      preRetirementAnnualRate: 7,
      postRetirementAnnualRate: 4,
      desiredMonthlyIncome: 4000,
      lifeExpectancy: 90,
    },
  });

  const onSubmit = (values: RetirementFormValues) => {
    const { 
        currentAge, 
        retirementAge, 
        currentSavings, 
        monthlyContribution, 
        preRetirementAnnualRate, 
        postRetirementAnnualRate, 
        desiredMonthlyIncome,
        lifeExpectancy
     } = values;

    // Calculate required nest egg
    const yearsInRetirement = lifeExpectancy - retirementAge;
    const monthsInRetirement = yearsInRetirement * 12;
    const monthlyPostRetirementRate = postRetirementAnnualRate / 100 / 12;
    // Using PV of annuity formula
    const requiredNestEgg = monthlyPostRetirementRate > 0 
        ? desiredMonthlyIncome * ((1 - Math.pow(1 + monthlyPostRetirementRate, -monthsInRetirement)) / monthlyPostRetirementRate)
        : desiredMonthlyIncome * monthsInRetirement;

    // Calculate projected savings at retirement
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyPreRetirementRate = preRetirementAnnualRate / 100 / 12;
    
    let projectedSavings = currentSavings;
    const yearlyData: { year: number; age: number; balance: number; }[] = [{ year: currentAge, age: currentAge, balance: currentSavings }];

    for (let i = 1; i <= monthsToRetirement; i++) {
        projectedSavings += monthlyContribution;
        projectedSavings *= (1 + monthlyPreRetirementRate);
        if (i % 12 === 0) {
            const age = currentAge + Math.ceil(i/12);
            yearlyData.push({
                year: age,
                age: age,
                balance: parseFloat(projectedSavings.toFixed(2))
            });
        }
    }

    setResult({
      requiredNestEgg,
      projectedSavings,
      shortfallOrSurplus: projectedSavings - requiredNestEgg,
      yearlyData,
    });
  };

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Retirement Savings Calculator</CardTitle>
        <CardDescription>
          Are you on track for retirement? Enter your details to find out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                    control={form.control}
                    name="currentAge"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Age</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="retirementAge"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Retirement Age</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currentSavings"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Savings ($)</FormLabel>
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
                        <FormLabel>Monthly Contribution ($)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="preRetirementAnnualRate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pre-Retirement Return (%)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="postRetirementAnnualRate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Post-Retirement Return (%)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="desiredMonthlyIncome"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Desired Monthly Income ($)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lifeExpectancy"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Life Expectancy (Age)</FormLabel>
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
                    <CardTitle>Retirement Projection</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Required Nest Egg</p>
                        <p className="text-3xl font-bold">{formatCurrency(result.requiredNestEgg)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Projected Savings</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(result.projectedSavings)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Shortfall / Surplus</p>
                        <p className={`text-3xl font-bold ${result.shortfallOrSurplus >= 0 ? 'text-accent' : 'text-destructive'}`}>
                            {formatCurrency(result.shortfallOrSurplus)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Growth to Retirement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={result.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" name="Age" />
                        <YAxis tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                        <Tooltip content={<ChartTooltipContent />} />
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
                fileName="retirement_projection"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default RetirementCalculator;

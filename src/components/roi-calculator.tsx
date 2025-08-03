
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
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const roiSchema = z.object({
  initialInvestment: z.coerce.number().min(0, "Initial investment must be a positive number."),
  finalValue: z.coerce.number().min(0, "Final value must be a positive number."),
}).refine(data => data.initialInvestment !== 0, {
    message: "Initial investment cannot be zero.",
    path: ["initialInvestment"],
});


type RoiFormValues = z.infer<typeof roiSchema>;

interface RoiResult {
    netReturn: number;
    roi: number;
    initialInvestment: number;
    finalValue: number;
}

const RoiCalculator = () => {
  const [result, setResult] = useState<RoiResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const form = useForm<RoiFormValues>({
    resolver: zodResolver(roiSchema),
    defaultValues: {
      initialInvestment: 10000,
      finalValue: 15000,
    },
  });

  const onSubmit = (values: RoiFormValues) => {
    const { initialInvestment, finalValue } = values;

    const netReturn = finalValue - initialInvestment;
    const roi = (netReturn / initialInvestment) * 100;

    setResult({ 
        netReturn,
        roi,
        initialInvestment,
        finalValue
    });
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Return on Investment (ROI) Calculator</CardTitle>
        <CardDescription>
          Calculate the profitability of an investment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                name="finalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Value of Investment</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate ROI</Button>
          </form>
        </Form>

        {result && (
          <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-center">ROI Calculation Result</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-muted-foreground">Net Return</p>
                        <p className={`text-3xl font-bold ${result.netReturn >= 0 ? 'text-accent' : 'text-destructive'}`}>
                            {formatCurrency(result.netReturn)}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Return on Investment (ROI)</p>
                        <p className={`text-3xl font-bold ${result.roi >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {result.roi.toFixed(2)}%
                        </p>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
       {result && (
        <CardFooter>
            <DownloadResults
                fileName="roi_calculation"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default RoiCalculator;

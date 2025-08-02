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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DownloadResults from './download-results';

const gstSchema = z.object({
  amount: z.coerce.number().min(0, "Amount must be a positive number."),
  gstRate: z.coerce.number(),
  amountType: z.enum(['exclusive', 'inclusive']),
});

type GstFormValues = z.infer<typeof gstSchema>;

interface GstResult {
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
}

const GstCalculator = () => {
  const [result, setResult] = useState<GstResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<GstFormValues>({
    resolver: zodResolver(gstSchema),
    defaultValues: {
      amount: 1000,
      gstRate: 18,
      amountType: 'exclusive',
    },
  });

  const onSubmit = (values: GstFormValues) => {
    const { amount, gstRate, amountType } = values;
    const rate = gstRate / 100;
    
    let baseAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (amountType === 'exclusive') {
        baseAmount = amount;
        gstAmount = amount * rate;
        totalAmount = baseAmount + gstAmount;
    } else { // Inclusive
        totalAmount = amount;
        baseAmount = amount / (1 + rate);
        gstAmount = totalAmount - baseAmount;
    }

    setResult({ baseAmount, gstAmount, totalAmount });
  };
  
  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const amountType = form.watch('amountType');

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">GST Calculator</CardTitle>
        <CardDescription>
          Quickly calculate Goods and Services Tax for any amount.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Rate (%)</FormLabel>
                     <Select onValueChange={(val) => field.onChange(parseFloat(val))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select GST Rate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                          <SelectItem value="28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="amountType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Amount Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="exclusive" />
                          </FormControl>
                          <FormLabel className="font-normal">
                           Exclusive
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="inclusive" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Inclusive
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate GST</Button>
          </form>
        </Form>

        {result && (
          <div ref={resultsRef} className="mt-8 pt-8 space-y-8">
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle>GST Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground">{amountType === 'exclusive' ? 'Base Amount' : 'Pre-GST Amount'}</p>
                  <p className="text-3xl font-bold">{formatCurrency(result.baseAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">GST Amount</p>
                  <p className="text-3xl font-bold text-accent">{formatCurrency(result.gstAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{amountType === 'exclusive' ? 'Total Amount' : 'Post-GST Amount'}</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(result.totalAmount)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
       {result && (
        <CardFooter>
            <DownloadResults
                fileName="gst_calculation"
                resultsRef={resultsRef}
            />
        </CardFooter>
      )}
    </Card>
  );
};

export default GstCalculator;

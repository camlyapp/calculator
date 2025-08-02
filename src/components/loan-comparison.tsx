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
import { CalculationResult, LoanFormValues, LoanSchema } from '@/lib/types';
import { generateAmortizationSchedule } from '@/lib/loan-utils';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import DownloadResults from './download-results';

interface LoanOptionProps {
  title: string;
  onCalculate: (result: Partial<CalculationResult>) => void;
}

const LoanOption = ({ title, onCalculate }: LoanOptionProps) => {
  const form = useForm<Pick<LoanFormValues, 'loanAmount' | 'interestRate' | 'loanTerm'>>({
    resolver: zodResolver(LoanSchema.pick({ loanAmount: true, interestRate: true, loanTerm: true})),
    defaultValues: {
      loanAmount: title === 'Loan A' ? 250000 : 250000,
      interestRate: title === 'Loan A' ? 6.5 : 6.0,
      loanTerm: title === 'Loan A' ? 30 : 15,
    },
  });

  const onSubmit = (values: Pick<LoanFormValues, 'loanAmount' | 'interestRate' | 'loanTerm'>) => {
    const { loanAmount, interestRate, loanTerm } = values;
    const { schedule, monthlyPayment } = generateAmortizationSchedule(loanAmount, interestRate, loanTerm, 0);
    const totalInterest = schedule.reduce((acc, row) => acc + row.interest, 0);
    const totalPayment = loanAmount + totalInterest;
    
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + schedule.length);

    onCalculate({
      principalAndInterest: monthlyPayment,
      totalInterest,
      totalPayment,
      payoffDate: format(payoffDate, 'PP'),
    });
  };

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Calculate {title}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const LoanComparison = () => {
  const [resultA, setResultA] = useState<Partial<CalculationResult> | null>(null);
  const [resultB, setResultB] = useState<Partial<CalculationResult> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="w-full mt-6 shadow-lg">
       <CardHeader>
        <CardTitle className="text-2xl">Loan Comparison</CardTitle>
        <CardDescription>
          Compare two different loan scenarios side-by-side to find the best option for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LoanOption title="Loan A" onCalculate={setResultA} />
            <LoanOption title="Loan B" onCalculate={setResultB} />
        </div>

        {(resultA || resultB) && (
            <div ref={resultsRef} className="mt-8 pt-8">
                <h3 className="text-xl font-bold mb-4 text-center">Comparison Results</h3>
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-3 items-center text-center">
                            <p className="font-semibold text-lg">{resultA?.principalAndInterest ? formatCurrency(resultA.principalAndInterest) : '-'}</p>
                            <p className="text-muted-foreground">Monthly Payment</p>
                            <p className="font-semibold text-lg">{resultB?.principalAndInterest ? formatCurrency(resultB.principalAndInterest) : '-'}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 items-center text-center">
                            <p className="font-semibold text-lg">{resultA?.totalInterest ? formatCurrency(resultA.totalInterest) : '-'}</p>
                            <p className="text-muted-foreground">Total Interest</p>
                            <p className="font-semibold text-lg">{resultB?.totalInterest ? formatCurrency(resultB.totalInterest) : '-'}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 items-center text-center">
                            <p className="font-semibold text-lg">{resultA?.totalPayment ? formatCurrency(resultA.totalPayment) : '-'}</p>
                            <p className="text-muted-foreground">Total Paid</p>
                            <p className="font-semibold text-lg">{resultB?.totalPayment ? formatCurrency(resultB.totalPayment) : '-'}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 items-center text-center">
                            <p className="font-semibold text-lg">{resultA ? resultA.payoffDate : '-'}</p>
                            <p className="text-muted-foreground">Payoff Date</p>
                            <p className="font-semibold text-lg">{resultB ? resultB.payoffDate : '-'}</p>
                        </div>
                         {resultA?.principalAndInterest && resultB?.principalAndInterest && (
                            <>
                            <Separator />
                            <div className="grid grid-cols-3 items-center text-center font-bold">
                                {resultA.principalAndInterest < resultB.principalAndInterest ? (
                                    <p className="text-accent">${(resultB.principalAndInterest - resultA.principalAndInterest).toFixed(2)}/mo less</p>
                                ) : (
                                    <p className="text-destructive">${(resultA.principalAndInterest - resultB.principalAndInterest).toFixed(2)}/mo more</p>
                                )}
                                <p className="text-muted-foreground">Difference</p>
                                {resultB.principalAndInterest < resultA.principalAndInterest ? (
                                     <p className="text-accent">${(resultA.principalAndInterest - resultB.principalAndInterest).toFixed(2)}/mo less</p>
                                ) : (
                                    <p className="text-destructive">${(resultB.principalAndInterest - resultA.principalAndInterest).toFixed(2)}/mo more</p>
                                )}
                            </div>
                            </>
                         )}
                    </CardContent>
                </Card>
            </div>
        )}
      </CardContent>
      {(resultA || resultB) && (
        <CardFooter>
          <DownloadResults fileName="loan_comparison" resultsRef={resultsRef} />
        </CardFooter>
      )}
    </Card>
  );
};

export default LoanComparison;

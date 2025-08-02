"use client";

import { useState } from 'react';
import BudgetCalculator from '@/components/budget-calculator';
import CompoundInterestCalculator from '@/components/compound-interest-calculator';
import CurrencyConverter from '@/components/currency-converter';
import GstCalculator from '@/components/gst-calculator';
import Header from '@/components/header';
import IndianTaxCalculator from '@/components/indian-tax-calculator';
import InvestmentCalculator from '@/components/investment-calculator';
import LoanCalculator from '@/components/loan-calculator';
import LoanComparison from '@/components/loan-comparison';
import MortgageCalculator from '@/components/mortgage-calculator';
import RefinanceAnalysis from '@/components/refinance-analysis';
import RetirementCalculator from '@/components/retirement-calculator';
import SavingsCalculator from '@/components/savings-calculator';
import SmartSuggestions from '@/components/smart-suggestions';
import TaxCalculator from '@/components/tax-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Currency = 'USD' | 'INR';

export default function Home() {
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="calculator" className="w-full max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <div className='w-[180px] space-y-2'>
              <Label htmlFor="global-currency-select">Global Currency</Label>
              <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                  <SelectTrigger id="global-currency-select">
                      <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 mx-auto max-w-6xl h-auto">
            <TabsTrigger value="calculator">EMI Calculator</TabsTrigger>
            <TabsTrigger value="mortgage-calculator">Mortgage</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="refinance">Refinancing</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="compound-interest">Compound Interest</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="tax">US Tax</TabsTrigger>
            <TabsTrigger value="indian-tax">Indian Tax</TabsTrigger>
            <TabsTrigger value="gst">GST</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <LoanCalculator currency={currency} />
          </TabsContent>
          <TabsContent value="mortgage-calculator">
            <MortgageCalculator currency={currency} />
          </TabsContent>
          <TabsContent value="comparison">
            <LoanComparison />
          </TabsContent>
          <TabsContent value="suggestions">
            <SmartSuggestions />
          </TabsContent>
          <TabsContent value="refinance">
            <RefinanceAnalysis />
          </TabsContent>
           <TabsContent value="investment">
            <InvestmentCalculator />
          </TabsContent>
           <TabsContent value="retirement">
            <RetirementCalculator />
          </TabsContent>
           <TabsContent value="compound-interest">
            <CompoundInterestCalculator />
          </TabsContent>
           <TabsContent value="savings">
            <SavingsCalculator />
          </TabsContent>
           <TabsContent value="tax">
            <TaxCalculator />
          </TabsContent>
          <TabsContent value="indian-tax">
            <IndianTaxCalculator />
           </TabsContent>
           <TabsContent value="gst">
            <GstCalculator />
           </TabsContent>
           <TabsContent value="currency">
            <CurrencyConverter />
          </TabsContent>
           <TabsContent value="budget">
            <BudgetCalculator currency={currency} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

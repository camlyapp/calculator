
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
import AllCalculators from '@/components/all-calculators';
import SipCalculator from '@/components/sip-calculator';
import LumpsumCalculator from '@/components/lumpsum-calculator';
import RdCalculator from '@/components/rd-calculator';
import FdCalculator from '@/components/fd-calculator';

type Currency = 'USD' | 'INR';

const calculatorTabs = [
    { value: 'calculator', label: 'EMI Calculator' },
    { value: 'mortgage-calculator', label: 'Mortgage' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'suggestions', label: 'AI Suggestions' },
    { value: 'refinance', label: 'Refinancing' },
    { value: 'investment', label: 'Investment' },
    { value: 'sip-calculator', label: 'SIP Calculator' },
    { value: 'lumpsum-calculator', label: 'Lumpsum' },
    { value: 'fd-calculator', label: 'FD Calculator' },
    { value: 'rd-calculator', label: 'RD Calculator' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'compound-interest', label: 'Compound Interest' },
    { value: 'savings', label: 'Savings' },
    { value: 'tax', label: 'US Tax' },
    { value: 'indian-tax', label: 'Indian Tax' },
    { value: 'gst', label: 'GST' },
    { value: 'budget', label: 'Budget' },
];

export default function Home() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <div className="flex justify-end">
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
          
          <AllCalculators />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
             <div className="sm:hidden mb-4">
                <Label htmlFor="calculator-select">Select a Calculator</Label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger id="calculator-select">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {calculatorTabs.map(tab => (
                            <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <TabsList className="hidden sm:grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 mx-auto max-w-7xl h-auto">
              {calculatorTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
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
             <TabsContent value="sip-calculator">
              <SipCalculator currency={currency} />
            </TabsContent>
            <TabsContent value="lumpsum-calculator">
                <LumpsumCalculator currency={currency} />
            </TabsContent>
            <TabsContent value="fd-calculator">
                <FdCalculator currency={currency} />
            </TabsContent>
            <TabsContent value="rd-calculator">
                <RdCalculator currency={currency} />
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
            <TabsContent value="budget">
              <BudgetCalculator currency={currency} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

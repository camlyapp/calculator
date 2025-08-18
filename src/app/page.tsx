
"use client";

import { useState } from 'react';
import BudgetCalculator from '@/components/budget-calculator';
import CompoundInterestCalculator from '@/components/compound-interest-calculator';
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
import PpfCalculator from '@/components/ppf-calculator';
import GratuityCalculator from '@/components/gratuity-calculator';
import RoiCalculator from '@/components/roi-calculator';
import GlobalCurrencySwitcher from '@/components/global-currency-switcher';
import Hero from '@/components/hero';

const calculatorTabs = [
    { value: 'suggestions', label: 'AI Suggestions' },
    { value: 'budget', label: 'Budget' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'compound-interest', label: 'Compound Interest' },
    { value: 'calculator', label: 'EMI Calculator' },
    { value: 'fd-calculator', label: 'FD Calculator' },
    { value: 'gratuity', label: 'Gratuity' },
    { value: 'gst', label: 'GST' },
    { value: 'indian-tax', label: 'Indian Tax' },
    { value: 'investment', label: 'Investment' },
    { value: 'lumpsum-calculator', label: 'Lumpsum' },
    { value: 'mortgage-calculator', label: 'Mortgage' },
    { value: 'ppf-calculator', label: 'PPF Calculator' },
    { value: 'rd-calculator', label: 'RD Calculator' },
    { value: 'refinance', label: 'Refinancing' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'roi', label: 'ROI' },
    { value: 'savings', label: 'Savings' },
    { value: 'sip-calculator', label: 'SIP Calculator' },
    { value: 'tax', label: 'US Tax' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <>
      <Header />
      <Hero />
      <main id="calculators" className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <GlobalCurrencySwitcher />
          
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
            <TabsList className="hidden sm:grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 mx-auto max-w-7xl h-auto">
              {calculatorTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="calculator">
              <LoanCalculator />
            </TabsContent>
            <TabsContent value="mortgage-calculator">
              <MortgageCalculator />
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
            <TabsContent value="roi">
              <RoiCalculator />
            </TabsContent>
             <TabsContent value="sip-calculator">
              <SipCalculator />
            </TabsContent>
            <TabsContent value="lumpsum-calculator">
                <LumpsumCalculator />
            </TabsContent>
             <TabsContent value="ppf-calculator">
                <PpfCalculator />
            </TabsContent>
            <TabsContent value="fd-calculator">
                <FdCalculator />
            </TabsContent>
            <TabsContent value="rd-calculator">
                <RdCalculator />
            </TabsContent>
            <TabsContent value="retirement">
              <RetirementCalculator />
            </TabsContent>
            <TabsContent value="gratuity">
              <GratuityCalculator />
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
              <BudgetCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

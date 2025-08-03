"use client";

import { useState } from 'react';
import BodySurfaceAreaCalculator from '@/components/body-surface-area-calculator';
import CarbonFootprintCalculator from '@/components/carbon-footprint-calculator';
import CookingConverter from '@/components/cooking-converter';
import FuelEfficiencyCalculator from '@/components/fuel-efficiency-calculator';
import GpaCalculator from '@/components/gpa-calculator';
import Header from '@/components/header';
import LoanEligibilityCalculator from '@/components/loan-eligibility-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const calculatorTabs = [
    { value: 'fuel-efficiency', label: 'Fuel Efficiency' },
    { value: 'gpa', label: 'GPA' },
    { value: 'loan-eligibility', label: 'Loan Eligibility' },
    { value: 'carbon-footprint', label: 'Carbon Footprint' },
    { value: 'bsa', label: 'Body Surface Area' },
    { value: 'cooking-converter', label: 'Cooking Converter' },
];


export default function OtherSpecializedCalculators() {
  const [activeTab, setActiveTab] = useState('fuel-efficiency');
  
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl mx-auto">
            <div className="sm:hidden mb-4">
              <Label htmlFor="calculator-select-os">Select a Calculator</Label>
              <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger id="calculator-select-os">
                      <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      {calculatorTabs.map(tab => (
                          <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
            <TabsList className="hidden sm:grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
                 {calculatorTabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="fuel-efficiency">
                <FuelEfficiencyCalculator />
            </TabsContent>
            <TabsContent value="gpa">
                <GpaCalculator />
            </TabsContent>
            <TabsContent value="loan-eligibility">
                <LoanEligibilityCalculator />
            </TabsContent>
            <TabsContent value="carbon-footprint">
                <CarbonFootprintCalculator />
            </TabsContent>
            <TabsContent value="bsa">
                <BodySurfaceAreaCalculator />
            </TabsContent>
            <TabsContent value="cooking-converter">
                <CookingConverter />
            </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

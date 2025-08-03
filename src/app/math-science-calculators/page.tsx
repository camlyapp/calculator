
"use client";

import { useState } from 'react';
import Header from '@/components/header';
import BasicCalculator from '@/components/basic-calculator';
import ScientificCalculator from '@/components/scientific-calculator';
import GraphingCalculator from '@/components/graphing-calculator';
import FractionCalculator from '@/components/fraction-calculator';
import PercentageCalculator from '@/components/percentage-calculator';
import AlgebraCalculator from '@/components/algebra-calculator';
import GeometryCalculator from '@/components/geometry-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitConverter from '@/components/unit-converter';
import PhysicsCalculator from '@/components/physics-calculator';
import ChemistryCalculator from '@/components/chemistry-calculator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AllCalculators from '@/components/all-calculators';
import DiscountCalculator from '@/components/discount-calculator';
import MarkupMarginCalculator from '@/components/markup-margin-calculator';
import BreakEvenCalculator from '@/components/break-even-calculator';
import GlobalCurrencySwitcher from '@/components/global-currency-switcher';

const calculatorTabs = [
    { value: 'basic', label: 'Basic' },
    { value: 'scientific', label: 'Scientific' },
    { value: 'graphing', label: 'Graphing' },
    { value: 'fraction', label: 'Fraction' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'discount', label: 'Discount' },
    { value: 'markup-margin', label: 'Markup & Margin' },
    { value: 'break-even', label: 'Break-Even' },
    { value: 'algebra', label: 'Algebra' },
    { value: 'geometry', label: 'Geometry' },
    { value: 'unit', label: 'Unit Converter' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
];

export default function MathScienceCalculators() {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <GlobalCurrencySwitcher />
          <AllCalculators />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
            <div className="sm:hidden mb-4">
                <Label htmlFor="calculator-select-ms">Select a Calculator</Label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger id="calculator-select-ms">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {calculatorTabs.map(tab => (
                            <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="hidden sm:flex justify-center">
              <TabsList className="flex flex-wrap justify-center h-auto">
                  {calculatorTabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                  ))}
              </TabsList>
            </div>
            <TabsContent value="basic">
              <div className="flex justify-center">
                <BasicCalculator />
              </div>
            </TabsContent>
            <TabsContent value="scientific">
               <div className="flex justify-center">
                <ScientificCalculator />
              </div>
            </TabsContent>
            <TabsContent value="graphing">
              <GraphingCalculator />
            </TabsContent>
            <TabsContent value="fraction">
              <div className="flex justify-center">
                <FractionCalculator />
              </div>
            </TabsContent>
             <TabsContent value="percentage">
              <div className="flex justify-center">
                <PercentageCalculator />
              </div>
            </TabsContent>
            <TabsContent value="discount">
              <div className="flex justify-center">
                <DiscountCalculator />
              </div>
            </TabsContent>
            <TabsContent value="markup-margin">
              <div className="flex justify-center">
                <MarkupMarginCalculator />
              </div>
            </TabsContent>
            <TabsContent value="break-even">
              <div className="flex justify-center">
                <BreakEvenCalculator />
              </div>
            </TabsContent>
            <TabsContent value="algebra">
              <div className="flex justify-center">
                <AlgebraCalculator />
              </div>
            </TabsContent>
            <TabsContent value="geometry">
              <div className="flex justify-center">
                <GeometryCalculator />
              </div>
            </TabsContent>
             <TabsContent value="unit">
              <div className="flex justify-center">
                <UnitConverter />
              </div>
            </TabsContent>
            <TabsContent value="physics">
              <div className="flex justify-center">
                <PhysicsCalculator />
              </div>
            </TabsContent>
             <TabsContent value="chemistry">
              <div className="flex justify-center">
                <ChemistryCalculator />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

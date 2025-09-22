
"use client";

import { useState, useEffect } from 'react';
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
import { useSearchParams } from 'next/navigation';
import SeoContent from '@/components/seo-content';
import ChemistrySolver from '@/components/chemistry-solver';

const calculatorTabs = [
    // General Math
    { value: 'basic', label: 'Basic' },
    { value: 'scientific', label: 'Scientific' },
    { value: 'graphing', label: 'Graphing' },
    
    // Specific Math
    { value: 'algebra', label: 'Algebra' },
    { value: 'geometry', label: 'Geometry' },
    { value: 'fraction', label: 'Fraction' },
    { value: 'percentage', label: 'Percentage' },
    
    // Business & Finance Math
    { value: 'discount', label: 'Discount' },
    { value: 'markup-margin', label: 'Markup & Margin' },
    { value: 'break-even', label: 'Break-Even' },

    // Science
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'chemistry-solver', label: 'Chemistry AI Solver' },
    { value: 'unit', label: 'Unit Converter' },
];

export default function MathScienceCalculators() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || 'basic');

  useEffect(() => {
    if (tab && calculatorTabs.some(t => t.value === tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          
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
              <BasicCalculator />
            </TabsContent>
            <TabsContent value="scientific">
              <ScientificCalculator />
            </TabsContent>
            <TabsContent value="graphing">
              <GraphingCalculator />
            </TabsContent>
            <TabsContent value="fraction">
              <FractionCalculator />
            </TabsContent>
             <TabsContent value="percentage">
              <PercentageCalculator />
            </TabsContent>
            <TabsContent value="discount">
              <DiscountCalculator />
            </TabsContent>
            <TabsContent value="markup-margin">
              <MarkupMarginCalculator />
            </TabsContent>
            <TabsContent value="break-even">
              <BreakEvenCalculator />
            </TabsContent>
            <TabsContent value="algebra">
              <AlgebraCalculator />
            </TabsContent>
            <TabsContent value="geometry">
              <GeometryCalculator />
            </TabsContent>
             <TabsContent value="unit">
              <UnitConverter />
            </TabsContent>
            <TabsContent value="physics">
              <PhysicsCalculator />
            </TabsContent>
             <TabsContent value="chemistry">
              <ChemistryCalculator />
            </TabsContent>
            <TabsContent value="chemistry-solver">
              <ChemistrySolver />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SeoContent activeCalculator={activeTab} />
    </>
  );
}


"use client";

import { useState } from 'react';
import AgeCalculator from '@/components/age-calculator';
import BMICalculator from '@/components/bmi-calculator';
import BmrCalculator from '@/components/bmr-calculator';
import CalorieCalculator from '@/components/calorie-calculator';
import DueDateCalculator from '@/components/due-date-calculator';
import Header from '@/components/header';
import HeartRateCalculator from '@/components/heart-rate-calculator';
import IdealWeightCalculator from '@/components/ideal-weight-calculator';
import OvulationCalculator from '@/components/ovulation-calculator';
import BodyFatCalculator from '@/components/body-fat-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AllCalculators from '@/components/all-calculators';

const calculatorTabs = [
    { value: 'age', label: 'Age' },
    { value: 'due-date', label: 'Due Date' },
    { value: 'ovulation', label: 'Ovulation' },
    { value: 'bmi', label: 'BMI' },
    { value: 'bmr', label: 'BMR' },
    { value: 'body-fat', label: 'Body Fat' },
    { value: 'calorie', label: 'Calorie' },
    { value: 'heart-rate', label: 'Heart Rate' },
    { value: 'ideal-weight', label: 'Ideal Weight' },
];

export default function PersonalHealthCalculators() {
  const [activeTab, setActiveTab] = useState('due-date');

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto">
          <AllCalculators />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
               <div className="sm:hidden mb-4">
                <Label htmlFor="calculator-select-ph">Select a Calculator</Label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger id="calculator-select-ph">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {calculatorTabs.map(tab => (
                            <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
              <TabsList className="hidden sm:grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 h-auto">
                  {calculatorTabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                  ))}
              </TabsList>
              <TabsContent value="age">
                  <AgeCalculator />
              </TabsContent>
              <TabsContent value="due-date">
                  <DueDateCalculator />
              </TabsContent>
              <TabsContent value="ovulation">
                  <OvulationCalculator />
              </TabsContent>
              <TabsContent value="bmi">
                  <BMICalculator />
              </TabsContent>
              <TabsContent value="bmr">
                  <BmrCalculator />
              </TabsContent>
              <TabsContent value="body-fat">
                  <BodyFatCalculator />
              </TabsContent>
              <TabsContent value="calorie">
                  <CalorieCalculator />
              </TabsContent>
              <TabsContent value="heart-rate">
                  <HeartRateCalculator />
              </TabsContent>
              <TabsContent value="ideal-weight">
                  <IdealWeightCalculator />
              </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

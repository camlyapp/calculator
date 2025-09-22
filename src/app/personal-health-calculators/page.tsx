
"use client";

import { useState, useEffect } from 'react';
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
import CreatinineClearanceCalculator from '@/components/creatinine-clearance-calculator';
import EgfrCalculator from '@/components/egfr-calculator';
import { useSearchParams } from 'next/navigation';
import SeoContent from '@/components/seo-content';

const calculatorTabs = [
    { value: 'age', label: 'Age' },
    { value: 'bmi', label: 'BMI' },
    { value: 'bmr', label: 'BMR' },
    { value: 'body-fat', label: 'Body Fat' },
    { value: 'calorie', label: 'Calorie' },
    { value: 'creatinine-clearance', label: 'Creatinine Clearance' },
    { value: 'due-date', label: 'Due Date' },
    { value: 'egfr', label: 'eGFR' },
    { value: 'heart-rate', label: 'Heart Rate' },
    { value: 'ideal-weight', label: 'Ideal Weight' },
    { value: 'ovulation', label: 'Ovulation' },
];

export default function PersonalHealthCalculators() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || 'due-date');

  useEffect(() => {
    if (tab && calculatorTabs.some(t => t.value === tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          
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
              <TabsList className="hidden sm:grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 h-auto">
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
               <TabsContent value="creatinine-clearance">
                  <CreatinineClearanceCalculator />
              </TabsContent>
               <TabsContent value="egfr">
                  <EgfrCalculator />
              </TabsContent>
          </Tabs>
        </div>
      </main>
      <SeoContent activeCalculator={activeTab} />
    </>
  );
}

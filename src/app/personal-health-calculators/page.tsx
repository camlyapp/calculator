
"use client";

import AgeCalculator from '@/components/age-calculator';
import BMICalculator from '@/components/bmi-calculator';
import BmrCalculator from '@/components/bmr-calculator';
import CalorieCalculator from '@/components/calorie-calculator';
import DueDateCalculator from '@/components/due-date-calculator';
import Header from '@/components/header';
import HeartRateCalculator from '@/components/heart-rate-calculator';
import OvulationCalculator from '@/components/ovulation-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PersonalHealthCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="age" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto">
                <TabsTrigger value="age">Age</TabsTrigger>
                <TabsTrigger value="due-date">Due Date</TabsTrigger>
                <TabsTrigger value="ovulation">Ovulation</TabsTrigger>
                <TabsTrigger value="bmi">BMI</TabsTrigger>
                <TabsTrigger value="bmr">BMR</TabsTrigger>
                <TabsTrigger value="calorie">Calorie</TabsTrigger>
                <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
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
            <TabsContent value="calorie">
                <CalorieCalculator />
            </TabsContent>
            <TabsContent value="heart-rate">
                <HeartRateCalculator />
            </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

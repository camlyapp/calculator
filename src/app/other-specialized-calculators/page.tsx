
"use client";

import BodySurfaceAreaCalculator from '@/components/body-surface-area-calculator';
import CarbonFootprintCalculator from '@/components/carbon-footprint-calculator';
import CookingConverter from '@/components/cooking-converter';
import FuelEfficiencyCalculator from '@/components/fuel-efficiency-calculator';
import GpaCalculator from '@/components/gpa-calculator';
import Header from '@/components/header';
import LoanEligibilityCalculator from '@/components/loan-eligibility-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OtherSpecializedCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="gpa" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="gpa">GPA</TabsTrigger>
                <TabsTrigger value="loan-eligibility">Loan Eligibility</TabsTrigger>
                <TabsTrigger value="fuel-efficiency">Fuel Efficiency</TabsTrigger>
                <TabsTrigger value="carbon-footprint">Carbon Footprint</TabsTrigger>
                <TabsTrigger value="bsa">Body Surface Area</TabsTrigger>
                <TabsTrigger value="cooking-converter">Cooking Converter</TabsTrigger>
            </TabsList>
            <TabsContent value="gpa">
                <GpaCalculator />
            </TabsContent>
            <TabsContent value="loan-eligibility">
                <LoanEligibilityCalculator />
            </TabsContent>
            <TabsContent value="fuel-efficiency">
                <FuelEfficiencyCalculator />
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

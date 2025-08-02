
"use client";

import FuelEfficiencyCalculator from '@/components/fuel-efficiency-calculator';
import Header from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OtherSpecializedCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="fuel-efficiency" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 h-auto">
                <TabsTrigger value="fuel-efficiency">Fuel Efficiency</TabsTrigger>
            </TabsList>
            <TabsContent value="fuel-efficiency">
                <FuelEfficiencyCalculator />
            </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

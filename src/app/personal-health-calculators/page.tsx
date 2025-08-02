
"use client";

import AgeCalculator from '@/components/age-calculator';
import Header from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PersonalHealthCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="age" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 h-auto">
                <TabsTrigger value="age">Age</TabsTrigger>
            </TabsList>
            <TabsContent value="age">
                <AgeCalculator />
            </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

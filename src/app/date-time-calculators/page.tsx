
"use client";

import Header from '@/components/header';
import DateCalculator from '@/components/date-calculator';
import TimeCalculator from '@/components/time-calculator';
import WorkdaysCalculator from '@/components/workdays-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountdownCalculator from '@/components/countdown-calculator';
import DateManipulationTab from '@/components/date-manipulation-tab';

export default function DateTimeCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="date-difference" className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center">
            <TabsList className="flex flex-wrap justify-center h-auto">
              <TabsTrigger value="date-difference">Date Difference</TabsTrigger>
              <TabsTrigger value="add-subtract-days">Add/Subtract Days</TabsTrigger>
              <TabsTrigger value="time-calculator">Add/Subtract Time</TabsTrigger>
              <TabsTrigger value="workdays">Workdays</TabsTrigger>
              <TabsTrigger value="countdown">Countdown</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="date-difference">
            <DateCalculator />
          </TabsContent>
           <TabsContent value="add-subtract-days">
            <DateManipulationTab mode="date" />
          </TabsContent>
          <TabsContent value="time-calculator">
            <TimeCalculator />
          </TabsContent>
          <TabsContent value="workdays">
            <WorkdaysCalculator />
          </TabsContent>
          <TabsContent value="countdown">
            <CountdownCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

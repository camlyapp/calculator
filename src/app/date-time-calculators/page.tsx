
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import DateCalculator from '@/components/date-calculator';
import TimeCalculator from '@/components/time-calculator';
import WorkdaysCalculator from '@/components/workdays-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountdownCalculator from '@/components/countdown-calculator';
import DateManipulationTab from '@/components/date-manipulation-tab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AllCalculators from '@/components/all-calculators';
import GlobalCurrencySwitcher from '@/components/global-currency-switcher';
import { useSearchParams } from 'next/navigation';
import SeoContent from '@/components/seo-content';
import TimeZoneConverter from '@/components/time-zone-converter';

const calculatorTabs = [
    { value: 'add-subtract-days', label: 'Add/Subtract Days' },
    { value: 'time-calculator', label: 'Add/Subtract Time' },
    { value: 'countdown', label: 'Countdown' },
    { value: 'date-difference', label: 'Date Difference' },
    { value: 'workdays', label: 'Workdays' },
    { value: 'time-zone', label: 'Time Zone' },
];

export default function DateTimeCalculators() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || 'add-subtract-days');

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
          <GlobalCurrencySwitcher />
          <AllCalculators />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
            <div className="sm:hidden mb-4">
                <Label htmlFor="calculator-select-dt">Select a Calculator</Label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger id="calculator-select-dt">
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
            <TabsContent value="time-zone">
              <TimeZoneConverter />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SeoContent activeCalculator={activeTab} />
    </>
  );
}

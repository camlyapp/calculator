
import Header from '@/components/header';
import DateCalculator from '@/components/date-calculator';
import TimeCalculator from '@/components/time-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DateTimeCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="date-difference" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="date-difference">Date Difference</TabsTrigger>
            <TabsTrigger value="time-calculator">Add/Subtract Time</TabsTrigger>
          </TabsList>
          <TabsContent value="date-difference">
            <DateCalculator />
          </TabsContent>
          <TabsContent value="time-calculator">
            <TimeCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

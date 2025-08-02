
import Header from '@/components/header';
import BasicCalculator from '@/components/basic-calculator';
import ScientificCalculator from '@/components/scientific-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MathScienceCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="basic" className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="scientific">Scientific</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <BasicCalculator />
          </TabsContent>
          <TabsContent value="scientific">
            <ScientificCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

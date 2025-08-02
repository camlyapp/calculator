
import Header from '@/components/header';
import BasicCalculator from '@/components/basic-calculator';
import ScientificCalculator from '@/components/scientific-calculator';
import GraphingCalculator from '@/components/graphing-calculator';
import FractionCalculator from '@/components/fraction-calculator';
import PercentageCalculator from '@/components/percentage-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MathScienceCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <Tabs defaultValue="basic" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="scientific">Scientific</TabsTrigger>
            <TabsTrigger value="graphing">Graphing</TabsTrigger>
            <TabsTrigger value="fraction">Fraction</TabsTrigger>
            <TabsTrigger value="percentage">Percentage</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <div className="flex justify-center">
              <BasicCalculator />
            </div>
          </TabsContent>
          <TabsContent value="scientific">
             <div className="flex justify-center">
              <ScientificCalculator />
            </div>
          </TabsContent>
          <TabsContent value="graphing">
            <GraphingCalculator />
          </TabsContent>
          <TabsContent value="fraction">
            <div className="flex justify-center">
              <FractionCalculator />
            </div>
          </TabsContent>
           <TabsContent value="percentage">
            <div className="flex justify-center">
              <PercentageCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

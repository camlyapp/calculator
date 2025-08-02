import Header from '@/components/header';
import LoanCalculator from '@/components/loan-calculator';
import LoanComparison from '@/components/loan-comparison';
import SmartSuggestions from '@/components/smart-suggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="calculator" className="w-full max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mx-auto max-w-2xl">
            <TabsTrigger value="calculator">Loan Calculator</TabsTrigger>
            <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <LoanCalculator />
          </TabsContent>
          <TabsContent value="comparison">
            <LoanComparison />
          </TabsContent>
          <TabsContent value="suggestions">
            <SmartSuggestions />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}

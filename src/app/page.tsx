import BudgetCalculator from '@/components/budget-calculator';
import CompoundInterestCalculator from '@/components/compound-interest-calculator';
import CurrencyConverter from '@/components/currency-converter';
import Header from '@/components/header';
import IndianTaxCalculator from '@/components/indian-tax-calculator';
import InvestmentCalculator from '@/components/investment-calculator';
import LoanCalculator from '@/components/loan-calculator';
import LoanComparison from '@/components/loan-comparison';
import MortgageCalculator from '@/components/mortgage-calculator';
import RefinanceAnalysis from '@/components/refinance-analysis';
import RetirementCalculator from '@/components/retirement-calculator';
import SavingsCalculator from '@/components/savings-calculator';
import SmartSuggestions from '@/components/smart-suggestions';
import TaxCalculator from '@/components/tax-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="calculator" className="w-full max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 mx-auto max-w-6xl h-auto">
            <TabsTrigger value="calculator">Advanced EMI Calculator</TabsTrigger>
            <TabsTrigger value="mortgage-calculator">Mortgage</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="refinance">Refinancing</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="compound-interest">Compound Interest</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="tax">US Tax</TabsTrigger>
            <TabsTrigger value="indian-tax">Indian Tax</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <LoanCalculator />
          </TabsContent>
          <TabsContent value="mortgage-calculator">
            <MortgageCalculator />
          </TabsContent>
          <TabsContent value="comparison">
            <LoanComparison />
          </TabsContent>
          <TabsContent value="suggestions">
            <SmartSuggestions />
          </TabsContent>
          <TabsContent value="refinance">
            <RefinanceAnalysis />
          </TabsContent>
           <TabsContent value="investment">
            <InvestmentCalculator />
          </TabsContent>
           <TabsContent value="retirement">
            <RetirementCalculator />
          </TabsContent>
           <TabsContent value="compound-interest">
            <CompoundInterestCalculator />
          </TabsContent>
           <TabsContent value="savings">
            <SavingsCalculator />
          </TabsContent>
           <TabsContent value="tax">
            <TaxCalculator />
          </TabsContent>
          <TabsContent value="indian-tax">
            <IndianTaxCalculator />
           </TabsContent>
           <TabsContent value="currency">
            <CurrencyConverter />
          </TabsContent>
           <TabsContent value="budget">
            <BudgetCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

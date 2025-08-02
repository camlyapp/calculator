
"use client";

import FuelEfficiencyCalculator from '@/components/fuel-efficiency-calculator';
import GpaCalculator from '@/components/gpa-calculator';
import Header from '@/components/header';
import LoanEligibilityCalculator from '@/components/loan-eligibility-calculator';

export default function OtherSpecializedCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto space-y-8">
           <GpaCalculator />
           <LoanEligibilityCalculator />
           <FuelEfficiencyCalculator />
        </div>
      </main>
    </>
  );
}

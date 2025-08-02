
"use client";

import GpaCalculator from '@/components/gpa-calculator';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OtherSpecializedCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
           <GpaCalculator />
        </div>
      </main>
    </>
  );
}

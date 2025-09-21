
"use client";

import { useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { allCalculators } from '@/lib/calculator-data';

interface SeoContentProps {
    activeCalculator?: string;
}

const SeoContent = ({ activeCalculator }: SeoContentProps) => {
  const calculatorInfo = useMemo(() => {
    if (!activeCalculator) return null;
    return allCalculators.find(calc => calc.value === activeCalculator);
  }, [activeCalculator]);

  if (!calculatorInfo || !calculatorInfo.description) {
    return null;
  }

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Card className="bg-card/50">
            <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    About the {calculatorInfo.label}
                </h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert text-muted-foreground max-w-none">
                    <p>{calculatorInfo.description}</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SeoContent;

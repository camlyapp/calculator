"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const TaxCalculator = () => {
  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Tax Calculator</CardTitle>
        <CardDescription>
          Coming Soon! Estimate your income tax liability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">This feature is under construction.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SavingsCalculator = () => {
  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Savings Calculator</CardTitle>
        <CardDescription>
          Coming Soon! Set savings goals and see how to reach them.
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

export default SavingsCalculator;

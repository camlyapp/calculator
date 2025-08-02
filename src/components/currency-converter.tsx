"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CurrencyConverter = () => {
  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Currency Converter</CardTitle>
        <CardDescription>
          Coming Soon! Convert currencies with live exchange rates.
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

export default CurrencyConverter;


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const PercentageCalculator = () => {
  // State for "X% of Y"
  const [p1, setP1] = useState('15');
  const [val1, setVal1] = useState('200');
  const [res1, setRes1] = useState('');

  // State for "X is what % of Y"
  const [val2x, setVal2x] = useState('30');
  const [val2y, setVal2y] = useState('200');
  const [res2, setRes2] = useState('');

  // State for "Percentage change from X to Y"
  const [val3x, setVal3x] = useState('100');
  const [val3y, setVal3y] = useState('125');
  const [res3, setRes3] = useState('');

  const calc1 = () => {
    const perc = parseFloat(p1);
    const val = parseFloat(val1);
    if (isNaN(perc) || isNaN(val)) {
        setRes1('Invalid input');
        return;
    };
    setRes1(((perc / 100) * val).toLocaleString());
  };

  const calc2 = () => {
    const x = parseFloat(val2x);
    const y = parseFloat(val2y);
    if (isNaN(x) || isNaN(y)) {
        setRes2('Invalid input');
        return;
    }
    if (y === 0) {
        setRes2('Cannot divide by zero');
        return;
    }
    setRes2(((x / y) * 100).toLocaleString());
  };

  const calc3 = () => {
    const x = parseFloat(val3x);
    const y = parseFloat(val3y);
    if (isNaN(x) || isNaN(y)) {
        setRes3('Invalid input');
        return;
    }
    if (x === 0) {
        setRes3('Initial value cannot be zero');
        return;
    }
    const change = ((y - x) / x) * 100;
    setRes3(change.toFixed(2));
  };
  
  useEffect(() => {
    calc1();
    calc2();
    calc3();
  }, []);


  return (
    <Card className="w-full max-w-lg shadow-2xl mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">Percentage Calculator</CardTitle>
        <CardDescription>Solve various percentage problems.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="percentOf" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="percentOf" className="whitespace-normal">What is X% of Y?</TabsTrigger>
            <TabsTrigger value="whatPercent" className="whitespace-normal">X is what % of Y?</TabsTrigger>
            <TabsTrigger value="change" className="whitespace-normal">% Increase/Decrease</TabsTrigger>
          </TabsList>

          <TabsContent value="percentOf">
            <div className="space-y-4 pt-4">
              <div className="flex gap-4 items-center">
                <div className="w-full space-y-2">
                  <Label>Percentage (%)</Label>
                  <Input value={p1} onChange={(e) => setP1(e.target.value)} type="number" placeholder="e.g., 15" />
                </div>
                <span className="pt-8">of</span>
                <div className="w-full space-y-2">
                  <Label>Value</Label>
                  <Input value={val1} onChange={(e) => setVal1(e.target.value)} type="number" placeholder="e.g., 200" />
                </div>
              </div>
              <Button onClick={calc1} className="w-full">Calculate</Button>
              {res1 && (
                <div className="text-center pt-4">
                  <Label>Result</Label>
                  <p className="text-2xl font-bold">{res1}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="whatPercent">
             <div className="space-y-4 pt-4">
              <div className="flex gap-4 items-center">
                <div className="w-full space-y-2">
                  <Label>Value X</Label>
                  <Input value={val2x} onChange={(e) => setVal2x(e.target.value)} type="number" placeholder="e.g., 30" />
                </div>
                <span className="pt-8">is what percent of</span>
                <div className="w-full space-y-2">
                  <Label>Value Y</Label>
                  <Input value={val2y} onChange={(e) => setVal2y(e.target.value)} type="number" placeholder="e.g., 200" />
                </div>
              </div>
              <Button onClick={calc2} className="w-full">Calculate</Button>
              {res2 && (
                <div className="text-center pt-4">
                  <Label>Result (%)</Label>
                  <p className="text-2xl font-bold">{res2}%</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="change">
             <div className="space-y-4 pt-4">
              <div className="flex gap-4 items-center">
                <div className="w-full space-y-2">
                  <Label>Initial Value</Label>
                  <Input value={val3x} onChange={(e) => setVal3x(e.target.value)} type="number" placeholder="e.g., 100" />
                </div>
                <span className="pt-8">to</span>
                <div className="w-full space-y-2">
                  <Label>Final Value</Label>
                  <Input value={val3y} onChange={(e) => setVal3y(e.target.value)} type="number" placeholder="e.g., 125" />
                </div>
              </div>
              <Button onClick={calc3} className="w-full">Calculate</Button>
              {res3 && (
                <div className="text-center pt-4">
                  <Label>Percentage Change</Label>
                  <p className={`text-2xl font-bold ${parseFloat(res3) >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {parseFloat(res3) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(res3))}%
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PercentageCalculator;

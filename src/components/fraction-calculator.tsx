
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Helper function to find the greatest common divisor
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const FractionCalculator = () => {
    const [num1, setNum1] = useState('');
    const [den1, setDen1] = useState('');
    const [num2, setNum2] = useState('');
    const [den2, setDen2] = useState('');
    const [result, setResult] = useState<{ num: number; den: number } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = (operation: 'add' | 'subtract' | 'multiply' | 'divide') => {
        const n1 = parseInt(num1);
        const d1 = parseInt(den1);
        const n2 = parseInt(num2);
        const d2 = parseInt(den2);

        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
            setError('Please fill in all fields with valid numbers.');
            setResult(null);
            return;
        }

        if (d1 === 0 || d2 === 0) {
            setError('Denominators cannot be zero.');
            setResult(null);
            return;
        }

        setError('');
        let resNum, resDen;

        switch (operation) {
            case 'add':
                resNum = n1 * d2 + n2 * d1;
                resDen = d1 * d2;
                break;
            case 'subtract':
                resNum = n1 * d2 - n2 * d1;
                resDen = d1 * d2;
                break;
            case 'multiply':
                resNum = n1 * n2;
                resDen = d1 * d2;
                break;
            case 'divide':
                if (n2 === 0) {
                     setError('Cannot divide by zero fraction.');
                     setResult(null);
                     return;
                }
                resNum = n1 * d2;
                resDen = d1 * n2;
                break;
        }
        
        if (resDen === 0) {
             setError('Result has a zero denominator.');
             setResult(null);
             return;
        }

        // Simplify the result
        const commonDivisor = gcd(Math.abs(resNum), Math.abs(resDen));
        const simplifiedNum = resNum / commonDivisor;
        const simplifiedDen = resDen / commonDivisor;
        
        // Ensure denominator is positive
        if (simplifiedDen < 0) {
            setResult({ num: -simplifiedNum, den: -simplifiedDen });
        } else {
            setResult({ num: simplifiedNum, den: simplifiedDen });
        }
    };

    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Fraction Calculator</CardTitle>
                <CardDescription>Perform arithmetic on two fractions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-8 items-center">
                    <div className="space-y-2 text-center">
                         <Label htmlFor="num1">Fraction 1</Label>
                        <Input id="num1" type="number" placeholder="Numerator" value={num1} onChange={(e) => setNum1(e.target.value)} className="text-center" />
                        <div className="h-px bg-border w-full" />
                        <Input id="den1" type="number" placeholder="Denominator" value={den1} onChange={(e) => setDen1(e.target.value)} className="text-center" />
                    </div>
                    <div className="space-y-2 text-center">
                        <Label htmlFor="num2">Fraction 2</Label>
                        <Input id="num2" type="number" placeholder="Numerator" value={num2} onChange={(e) => setNum2(e.target.value)} className="text-center" />
                        <div className="h-px bg-border w-full" />
                        <Input id="den2" type="number" placeholder="Denominator" value={den2} onChange={(e) => setDen2(e.target.value)} className="text-center" />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-6">
                    <Button onClick={() => handleCalculate('add')}>+</Button>
                    <Button onClick={() => handleCalculate('subtract')}>-</Button>
                    <Button onClick={() => handleCalculate('multiply')}>×</Button>
                    <Button onClick={() => handleCalculate('divide')}>÷</Button>
                </div>

                {error && <p className="text-destructive text-center mt-4">{error}</p>}
                
                {result && (
                    <div className="mt-6 text-center">
                        <Label>Result</Label>
                        <div className="flex items-center justify-center text-3xl font-bold">
                            {result.den === 1 ? (
                                <span>{result.num}</span>
                            ) : (
                                <div className="inline-flex flex-col items-center">
                                    <span>{result.num}</span>
                                    <span className="h-px bg-foreground w-16" />
                                    <span>{result.den}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FractionCalculator;

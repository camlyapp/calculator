
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const LinearEquationSolver = () => {
    const [a, setA] = useState('2');
    const [b, setB] = useState('10');
    const [c, setC] = useState('20');
    const [result, setResult] = useState('');

    const solve = () => {
        const valA = parseFloat(a);
        const valB = parseFloat(b);
        const valC = parseFloat(c);

        if (isNaN(valA) || isNaN(valB) || isNaN(valC)) {
            setResult('Please enter valid numbers for a, b, and c.');
            return;
        }
        if (valA === 0) {
            setResult(valB === valC ? 'Infinite solutions' : 'No solution (a cannot be zero)');
            return;
        }
        const x = (valC - valB) / valA;
        setResult(`x = ${x}`);
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="text-center text-lg font-medium">Solve for x in: <span className="font-mono">ax + b = c</span></div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Input aria-label="Value for a" value={a} onChange={(e) => setA(e.target.value)} type="number" placeholder="a" className="text-center" />
                <span className="font-mono text-xl">x +</span>
                <Input aria-label="Value for b" value={b} onChange={(e) => setB(e.target.value)} type="number" placeholder="b" className="text-center" />
                <span className="font-mono text-xl">=</span>
                <Input aria-label="Value for c" value={c} onChange={(e) => setC(e.target.value)} type="number" placeholder="c" className="text-center" />
            </div>
            <Button onClick={solve} className="w-full">Solve</Button>
            {result && (
                <div className="text-center pt-4">
                    <Label>Result</Label>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

const QuadraticEquationSolver = () => {
    const [a, setA] = useState('1');
    const [b, setB] = useState('-3');
    const [c, setC] = useState('2');
    const [result, setResult] = useState('');

    const solve = () => {
        const valA = parseFloat(a);
        const valB = parseFloat(b);
        const valC = parseFloat(c);

        if (isNaN(valA) || isNaN(valB) || isNaN(valC)) {
            setResult('Please enter valid numbers for a, b, and c.');
            return;
        }
        if (valA === 0) {
            setResult('Coefficient "a" cannot be zero for a quadratic equation.');
            return;
        }

        const discriminant = valB * valB - 4 * valA * valC;

        if (discriminant > 0) {
            const x1 = (-valB + Math.sqrt(discriminant)) / (2 * valA);
            const x2 = (-valB - Math.sqrt(discriminant)) / (2 * valA);
            setResult(`Two distinct real roots: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
        } else if (discriminant === 0) {
            const x = -valB / (2 * valA);
            setResult(`One real root: x = ${x.toFixed(4)}`);
        } else {
            const realPart = (-valB / (2 * valA)).toFixed(4);
            const imaginaryPart = (Math.sqrt(-discriminant) / (2 * valA)).toFixed(4);
            setResult(`Complex roots: x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`);
        }
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="text-center text-lg font-medium">Solve for x in: <span className="font-mono">ax² + bx + c = 0</span></div>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                 <Input aria-label="Value for a" value={a} onChange={(e) => setA(e.target.value)} type="number" placeholder="a" className="text-center" />
                <span className="font-mono text-xl">x² +</span>
                <Input aria-label="Value for b" value={b} onChange={(e) => setB(e.target.value)} type="number" placeholder="b" className="text-center" />
                <span className="font-mono text-xl">x +</span>
                <Input aria-label="Value for c" value={c} onChange={(e) => setC(e.target.value)} type="number" placeholder="c" className="text-center" />
                <span className="font-mono text-xl">= 0</span>
            </div>
            <Button onClick={solve} className="w-full">Solve</Button>
            {result && (
                <div className="text-center pt-4">
                    <Label>Result</Label>
                    <p className="text-xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

const AlgebraCalculator = () => {
    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Algebra Calculator</CardTitle>
                <CardDescription>Solve common algebraic equations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="linear" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="linear">Linear Equation</TabsTrigger>
                        <TabsTrigger value="quadratic">Quadratic Equation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="linear">
                        <LinearEquationSolver />
                    </TabsContent>
                    <TabsContent value="quadratic">
                        <QuadraticEquationSolver />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default AlgebraCalculator;

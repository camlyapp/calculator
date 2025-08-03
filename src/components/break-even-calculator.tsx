
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/currency-context';

interface Result {
    breakEvenUnits: string;
    breakEvenRevenue: string;
}

const BreakEvenCalculator = () => {
    const [fixedCosts, setFixedCosts] = useState('5000');
    const [variableCost, setVariableCost] = useState('20');
    const [sellingPrice, setSellingPrice] = useState('50');
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState('');
    const { formatCurrency } = useCurrency();

    const calculate = () => {
        const fc = parseFloat(fixedCosts);
        const vc = parseFloat(variableCost);
        const sp = parseFloat(sellingPrice);

        if (isNaN(fc) || isNaN(vc) || isNaN(sp) || fc < 0 || vc < 0 || sp < 0) {
            setError('Please enter valid, positive numbers for all fields.');
            setResult(null);
            return;
        }

        if (sp <= vc) {
            setError('Selling price must be greater than the variable cost per unit.');
            setResult(null);
            return;
        }

        setError('');

        const contributionMargin = sp - vc;
        const breakEvenUnits = fc / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * sp;

        setResult({
            breakEvenUnits: breakEvenUnits.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            breakEvenRevenue: formatCurrency(breakEvenRevenue),
        });
    };

    useEffect(() => {
        calculate();
    }, [fixedCosts, variableCost, sellingPrice, formatCurrency]);

    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Break-Even Point Calculator</CardTitle>
                <CardDescription>Determine the number of units to sell to cover your costs.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fixed-costs">Total Fixed Costs</Label>
                            <Input
                                id="fixed-costs"
                                value={fixedCosts}
                                onChange={(e) => setFixedCosts(e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="variable-cost">Variable Cost / Unit</Label>
                            <Input
                                id="variable-cost"
                                value={variableCost}
                                onChange={(e) => setVariableCost(e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="selling-price">Selling Price / Unit</Label>
                            <Input
                                id="selling-price"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                type="number"
                            />
                        </div>
                    </div>
                    <Button onClick={calculate} className="w-full">Calculate</Button>
                    
                    {error && <p className="text-destructive text-center mt-4">{error}</p>}
                    
                    {result && !error && (
                        <div className="text-center pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Break-Even Point (Units)</Label>
                                <p className="text-2xl font-bold text-primary">{result.breakEvenUnits} Units</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Break-Even Point (Revenue)</Label>
                                <p className="text-2xl font-bold text-accent">{result.breakEvenRevenue}</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BreakEvenCalculator;

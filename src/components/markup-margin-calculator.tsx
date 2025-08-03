
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/currency-context';

interface Result {
    profit: string;
    margin: string;
    markup: string;
}

const MarkupMarginCalculator = () => {
    const [cost, setCost] = useState('100');
    const [revenue, setRevenue] = useState('150');
    const [result, setResult] = useState<Result | null>(null);
    const { formatCurrency } = useCurrency();

    const calculate = () => {
        const costValue = parseFloat(cost);
        const revenueValue = parseFloat(revenue);

        if (isNaN(costValue) || isNaN(revenueValue) || costValue < 0 || revenueValue < 0) {
            setResult(null);
            return;
        }

        const profit = revenueValue - costValue;
        
        const margin = revenueValue > 0 ? (profit / revenueValue) * 100 : 0;
        const markup = costValue > 0 ? (profit / costValue) * 100 : 0;

        setResult({
            profit: formatCurrency(profit),
            margin: `${margin.toFixed(2)}%`,
            markup: `${markup.toFixed(2)}%`,
        });
    };

    useEffect(() => {
        calculate();
    }, [cost, revenue, formatCurrency]);

    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Markup & Margin Calculator</CardTitle>
                <CardDescription>Calculate profit, markup, and gross margin from cost and revenue.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cost-price">Cost</Label>
                            <Input
                                id="cost-price"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                type="number"
                                placeholder="e.g., 100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="revenue-price">Revenue</Label>
                            <Input
                                id="revenue-price"
                                value={revenue}
                                onChange={(e) => setRevenue(e.target.value)}
                                type="number"
                                placeholder="e.g., 150"
                            />
                        </div>
                    </div>
                    <Button onClick={calculate} className="w-full">Calculate</Button>
                    {result && (
                        <div className="text-center pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Profit</Label>
                                <p className="text-2xl font-bold text-primary">{result.profit}</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Gross Margin</Label>
                                <p className="text-2xl font-bold text-accent">{result.margin}</p>
                            </div>
                             <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Markup</Label>
                                <p className="text-2xl font-bold">{result.markup}</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MarkupMarginCalculator;

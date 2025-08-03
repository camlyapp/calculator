
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/currency-context';

const DiscountCalculator = () => {
    const [originalPrice, setOriginalPrice] = useState('100');
    const [discount, setDiscount] = useState('25');
    const [result, setResult] = useState<{ finalPrice: string, amountSaved: string } | null>(null);
    const { formatCurrency } = useCurrency();

    const calculate = () => {
        const price = parseFloat(originalPrice);
        const disc = parseFloat(discount);

        if (isNaN(price) || isNaN(disc) || price < 0 || disc < 0) {
            setResult(null);
            return;
        }

        const amountSaved = price * (disc / 100);
        const finalPrice = price - amountSaved;

        setResult({
            finalPrice: formatCurrency(finalPrice),
            amountSaved: formatCurrency(amountSaved),
        });
    };

    useEffect(() => {
        calculate();
    }, [originalPrice, discount, formatCurrency]);

    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Discount Calculator</CardTitle>
                <CardDescription>Calculate the final price after a discount and see how much you've saved.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="original-price">Original Price</Label>
                            <Input
                                id="original-price"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                                type="number"
                                placeholder="e.g., 100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount-percent">Discount (%)</Label>
                            <Input
                                id="discount-percent"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                type="number"
                                placeholder="e.g., 25"
                            />
                        </div>
                    </div>
                    <Button onClick={calculate} className="w-full">Calculate</Button>
                    {result && (
                        <div className="text-center pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Amount Saved</Label>
                                <p className="text-2xl font-bold text-accent">{result.amountSaved}</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <Label className="text-muted-foreground">Final Price</Label>
                                <p className="text-2xl font-bold text-primary">{result.finalPrice}</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DiscountCalculator;

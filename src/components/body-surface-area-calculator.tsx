
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from './ui/separator';

// Du Bois formula: BSA (m²) = 0.007184 × W(kg)^0.425 × H(cm)^0.725
const duBoisFormula = (weightKg: number, heightCm: number): number => {
    if (weightKg <= 0 || heightCm <= 0) return 0;
    return 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
};

const BodySurfaceAreaCalculator = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [height, setHeight] = useState('175'); // cm or inches
    const [weight, setWeight] = useState('70');  // kg or lbs
    const [bsa, setBsa] = useState<number | null>(null);

    const calculateBsa = () => {
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            setBsa(null);
            return;
        }

        const heightInCm = units === 'metric' ? h : h * 2.54;
        const weightInKg = units === 'metric' ? w : w * 0.453592;

        const result = duBoisFormula(weightInKg, heightInCm);
        setBsa(result);
    };

    const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
        setUnits(newUnit);
        // Reset inputs when switching units to avoid confusion
        setHeight(newUnit === 'metric' ? '175' : '69');
        setWeight(newUnit === 'metric' ? '70' : '154');
        setBsa(null);
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Body Surface Area (BSA) Calculator</CardTitle>
                <CardDescription>
                    Calculate Body Surface Area using the Du Bois formula, a common method in clinical practice.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <Label>Units</Label>
                        <RadioGroup
                            value={units}
                            onValueChange={(val) => handleUnitChange(val as 'metric' | 'imperial')}
                            className="flex space-x-4 pt-2"
                        >
                            <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="metric" id="metric-units" />
                                <Label htmlFor="metric-units" className="font-normal">Metric (cm, kg)</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="imperial" id="imperial-units" />
                                <Label htmlFor="imperial-units" className="font-normal">Imperial (in, lbs)</Label>
                            </FormItem>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="height">Height ({units === 'metric' ? 'cm' : 'inches'})</Label>
                            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight ({units === 'metric' ? 'kg' : 'lbs'})</Label>
                            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                    </div>

                    <Button onClick={calculateBsa} className="w-full" size="lg">Calculate BSA</Button>
                </div>

                {bsa !== null && (
                    <div className="mt-8 pt-8">
                        <Separator />
                        <div className="mt-8 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Calculated Body Surface Area</Label>
                            <p className="text-5xl font-bold text-primary">{bsa.toFixed(3)} m²</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BodySurfaceAreaCalculator;


"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from './ui/separator';
import { FormItem } from './ui/form';

// BMI calculation logic
const calculateBmi = (weightKg: number, heightM: number): number => {
    if (weightKg <= 0 || heightM <= 0) return 0;
    return weightKg / (heightM * heightM);
};

// Get BMI category based on WHO standards
const getBmiCategory = (bmi: number): { category: string, colorClass: string } => {
    if (bmi < 18.5) return { category: 'Underweight', colorClass: 'text-blue-500' };
    if (bmi >= 18.5 && bmi < 25) return { category: 'Normal weight', colorClass: 'text-green-500' };
    if (bmi >= 25 && bmi < 30) return { category: 'Overweight', colorClass: 'text-yellow-500' };
    return { category: 'Obesity', colorClass: 'text-red-500' };
};

const BMICalculator = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [heightCm, setHeightCm] = useState('175');
    const [weightKg, setWeightKg] = useState('70');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('9');
    const [weightLbs, setWeightLbs] = useState('154');
    const [result, setResult] = useState<{ bmi: number; category: string; colorClass: string; } | null>(null);

    const calculate = () => {
        let weightInKg: number;
        let heightInM: number;

        if (units === 'metric') {
            weightInKg = parseFloat(weightKg);
            heightInM = parseFloat(heightCm) / 100;
        } else {
            const ft = parseFloat(heightFt);
            const inch = parseFloat(heightIn);
            const totalInches = (ft * 12) + inch;
            heightInM = totalInches * 0.0254;
            weightInKg = parseFloat(weightLbs) * 0.453592;
        }
        
        if (isNaN(weightInKg) || isNaN(heightInM) || weightInKg <= 0 || heightInM <= 0) {
            setResult(null);
            return;
        }

        const bmi = calculateBmi(weightInKg, heightInM);
        const bmiCategory = getBmiCategory(bmi);
        setResult({
            bmi: parseFloat(bmi.toFixed(2)),
            category: bmiCategory.category,
            colorClass: bmiCategory.colorClass,
        });
    };
    
    const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
        setUnits(newUnit);
        setResult(null);
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Body Mass Index (BMI) Calculator</CardTitle>
                <CardDescription>
                    Calculate your BMI and see where you fall on the WHO weight status categories.
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
                                <RadioGroupItem value="metric" id="metric-units-bmi" />
                                <Label htmlFor="metric-units-bmi" className="font-normal">Metric (cm, kg)</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="imperial" id="imperial-units-bmi" />
                                <Label htmlFor="imperial-units-bmi" className="font-normal">Imperial (ft, in, lbs)</Label>
                            </FormItem>
                        </RadioGroup>
                    </div>

                    {units === 'metric' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="height-cm">Height (cm)</Label>
                                <Input id="height-cm" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight-kg">Weight (kg)</Label>
                                <Input id="weight-kg" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Height</Label>
                                <div className="flex gap-2">
                                    <Input aria-label="Height in feet" type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="ft"/>
                                    <Input aria-label="Height in inches" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="in"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                                <Input id="weight-lbs" type="number" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
                            </div>
                        </div>
                    )}
                    

                    <Button onClick={calculate} className="w-full" size="lg">Calculate BMI</Button>
                </div>

                {result !== null && (
                    <div className="mt-8 pt-8">
                        <Separator />
                        <div className="mt-8 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Your Body Mass Index (BMI)</Label>
                            <p className="text-5xl font-bold text-primary">{result.bmi}</p>
                            <p className={`text-xl font-semibold mt-2 ${result.colorClass}`}>{result.category}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BMICalculator;


"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem } from './ui/form';
import { Separator } from './ui/separator';

// U.S. Navy Method
const calculateBodyFat = (
    gender: 'male' | 'female', 
    heightCm: number, 
    neckCm: number, 
    waistCm: number, 
    hipCm: number | null
): number => {
    if (gender === 'male') {
        return 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
    } else {
        if (!hipCm) return 0;
        return 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
    }
};

const getBodyFatCategory = (bfp: number, gender: 'male' | 'female'): string => {
    if (gender === 'male') {
        if (bfp < 6) return 'Essential Fat';
        if (bfp <= 13) return 'Athletes';
        if (bfp <= 17) return 'Fitness';
        if (bfp <= 24) return 'Acceptable';
        return 'Obesity';
    } else { // female
        if (bfp < 14) return 'Essential Fat';
        if (bfp <= 20) return 'Athletes';
        if (bfp <= 24) return 'Fitness';
        if (bfp <= 31) return 'Acceptable';
        return 'Obesity';
    }
};

const IN_TO_CM = 2.54;

const BodyFatCalculator = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [height, setHeight] = useState('175');
    const [weight, setWeight] = useState('70');
    const [neck, setNeck] = useState('38');
    const [waist, setWaist] = useState('85');
    const [hip, setHip] = useState('90');
    const [result, setResult] = useState<{
        bodyFatPercentage: number;
        category: string;
        fatMass: number;
        leanMass: number;
    } | null>(null);

    const calculate = () => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        const n = parseFloat(neck);
        const wa = parseFloat(waist);
        const hi = gender === 'female' ? parseFloat(hip) : null;
        
        if (isNaN(h) || isNaN(w) || isNaN(n) || isNaN(wa) || (gender === 'female' && isNaN(hi!))) {
             setResult(null);
             return;
        }

        const heightCm = units === 'metric' ? h : h * IN_TO_CM;
        const neckCm = units === 'metric' ? n : n * IN_TO_CM;
        const waistCm = units === 'metric' ? wa : wa * IN_TO_CM;
        const hipCm = gender === 'female' && hi ? (units === 'metric' ? hi : hi * IN_TO_CM) : null;
        const weightKg = units === 'metric' ? w : w / 2.20462;

        const bodyFatPercentage = calculateBodyFat(gender, heightCm, neckCm, waistCm, hipCm);

        if (bodyFatPercentage > 0 && bodyFatPercentage < 100) {
            const fatMass = weightKg * (bodyFatPercentage / 100);
            const leanMass = weightKg - fatMass;
            
            setResult({
                bodyFatPercentage,
                category: getBodyFatCategory(bodyFatPercentage, gender),
                fatMass,
                leanMass,
            });
        } else {
             setResult(null);
        }
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Body Fat Calculator (U.S. Navy Method)</CardTitle>
                <CardDescription>
                    Estimate your body fat percentage using body measurements.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                             <Label>Gender</Label>
                             <RadioGroup value={gender} onValueChange={(val) => setGender(val as 'male' | 'female')} className="flex pt-2">
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male-bf"/>
                                    <Label htmlFor="male-bf" className="font-normal">Male</Label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female-bf"/>
                                    <Label htmlFor="female-bf" className="font-normal">Female</Label>
                                </FormItem>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                             <Label>Units</Label>
                             <RadioGroup value={units} onValueChange={(val) => setUnits(val as 'metric' | 'imperial')} className="flex pt-2">
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="metric" id="metric-bf" />
                                    <Label htmlFor="metric-bf" className="font-normal">Metric (cm, kg)</Label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="imperial" id="imperial-bf" />
                                    <Label htmlFor="imperial-bf" className="font-normal">Imperial (in, lbs)</Label>
                                </FormItem>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="bf-height">Height ({units === 'metric' ? 'cm' : 'in'})</Label>
                            <Input id="bf-height" type="number" value={height} onChange={e => setHeight(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bf-weight">Weight ({units === 'metric' ? 'kg' : 'lbs'})</Label>
                            <Input id="bf-weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bf-neck">Neck ({units === 'metric' ? 'cm' : 'in'})</Label>
                            <Input id="bf-neck" type="number" value={neck} onChange={e => setNeck(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bf-waist">Waist ({units === 'metric' ? 'cm' : 'in'})</Label>
                            <Input id="bf-waist" type="number" value={waist} onChange={e => setWaist(e.target.value)} />
                        </div>
                        {gender === 'female' && (
                             <div className="space-y-2">
                                <Label htmlFor="bf-hip">Hip ({units === 'metric' ? 'cm' : 'in'})</Label>
                                <Input id="bf-hip" type="number" value={hip} onChange={e => setHip(e.target.value)} />
                            </div>
                        )}
                    </div>

                    <Button onClick={calculate} className="w-full" size="lg">Calculate Body Fat</Button>
                </div>

                {result && (
                    <div className="mt-8 pt-8 space-y-6">
                        <Separator />
                        <Card className="bg-secondary/50">
                             <CardHeader>
                                <CardTitle className="text-center">Your Body Composition</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Body Fat Percentage</Label>
                                    <p className="text-4xl font-bold text-primary">{result.bodyFatPercentage.toFixed(1)}%</p>
                                    <p className="font-semibold text-lg text-accent">{result.category}</p>
                                </div>
                                 <div className="space-y-2">
                                     <Label className="text-muted-foreground">Body Mass Breakdown</Label>
                                     <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-background rounded-lg">
                                            <p className="font-bold text-xl">{result.fatMass.toFixed(1)} {units === 'metric' ? 'kg' : 'lbs'}</p>
                                            <p className="text-sm">Fat Mass</p>
                                        </div>
                                         <div className="p-2 bg-background rounded-lg">
                                            <p className="font-bold text-xl">{result.leanMass.toFixed(1)} {units === 'metric' ? 'kg' : 'lbs'}</p>
                                            <p className="text-sm">Lean Mass</p>
                                        </div>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BodyFatCalculator;

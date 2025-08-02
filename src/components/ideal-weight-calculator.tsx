
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem } from './ui/form';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

// Formulas return weight in kg
// Robinson formula (1983)
const robinson = (heightInches: number, gender: 'male' | 'female') => {
    if (gender === 'male') {
        return 52 + 1.9 * (heightInches - 60);
    } else {
        return 49 + 1.7 * (heightInches - 60);
    }
};

// Miller formula (1983)
const miller = (heightInches: number, gender: 'male' | 'female') => {
    if (gender === 'male') {
        return 56.2 + 1.41 * (heightInches - 60);
    } else {
        return 53.1 + 1.36 * (heightInches - 60);
    }
};

// Devine formula (1974)
const devine = (heightInches: number, gender: 'male' | 'female') => {
    if (gender === 'male') {
        return 50 + 2.3 * (heightInches - 60);
    } else {
        return 45.5 + 2.3 * (heightInches - 60);
    }
};

// Hamwi formula (1964)
const hamwi = (heightInches: number, gender: 'male' | 'female') => {
     if (gender === 'male') {
        return 48 + 2.7 * (heightInches - 60);
    } else {
        return 45.5 + 2.2 * (heightInches - 60);
    }
};

const formulas = {
    Robinson: robinson,
    Miller: miller,
    Devine: devine,
    Hamwi: hamwi,
};

const KG_TO_LBS = 2.20462;

const IdealWeightCalculator = () => {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('10');
    const [result, setResult] = useState<{
        formulaResults: { name: string; weightKg: number; weightLbs: number }[];
        healthyRangeLbs: string;
        healthyRangeKg: string;
    } | null>(null);

    const calculate = () => {
        const ft = parseInt(heightFt);
        const inch = parseInt(heightIn);

        if (isNaN(ft) || isNaN(inch) || ft <= 0) {
            setResult(null);
            return;
        }

        const totalInches = (ft * 12) + inch;
        if (totalInches <= 0) {
            setResult(null);
            return;
        }

        const formulaResults = Object.entries(formulas).map(([name, func]) => {
            const weightKg = func(totalInches, gender);
            return {
                name,
                weightKg,
                weightLbs: weightKg * KG_TO_LBS,
            };
        });

        const avgWeightLbs = formulaResults.reduce((sum, res) => sum + res.weightLbs, 0) / formulaResults.length;
        const avgWeightKg = formulaResults.reduce((sum, res) => sum + res.weightKg, 0) / formulaResults.length;
        
        setResult({
            formulaResults,
            healthyRangeLbs: `${(avgWeightLbs - 5).toFixed(1)} - ${(avgWeightLbs + 5).toFixed(1)} lbs`,
            healthyRangeKg: `${(avgWeightKg - 2.2).toFixed(1)} - ${(avgWeightKg + 2.2).toFixed(1)} kg`,
        });
    };
    
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Ideal Weight Calculator</CardTitle>
                <CardDescription>
                    Estimate your ideal body weight based on height and gender using several popular formulas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup value={gender} onValueChange={(val) => setGender(val as 'male' | 'female')} className="flex pt-2">
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male-iwc" />
                                    <Label htmlFor="male-iwc" className="font-normal">Male</Label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female-iwc" />
                                    <Label htmlFor="female-iwc" className="font-normal">Female</Label>
                                </FormItem>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Height</Label>
                            <div className="flex gap-2">
                                <Input aria-label="Height in feet" type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="ft" />
                                <Input aria-label="Height in inches" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="in" />
                            </div>
                        </div>
                    </div>
                    
                    <Button onClick={calculate} className="w-full" size="lg">Calculate Ideal Weight</Button>
                </div>

                {result && (
                    <div className="mt-8 pt-8 space-y-6">
                        <Separator />
                        <div className="text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Healthy Weight Range</Label>
                            <p className="text-3xl font-bold text-primary">{result.healthyRangeLbs}</p>
                            <p className="text-xl text-muted-foreground">({result.healthyRangeKg})</p>
                        </div>
                         <Card>
                            <CardHeader>
                                <CardTitle>Results by Formula</CardTitle>
                                <CardDescription>Different formulas provide slightly different estimates.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Formula</TableHead>
                                            <TableHead className="text-right">Ideal Weight (lbs)</TableHead>
                                            <TableHead className="text-right">Ideal Weight (kg)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result.formulaResults.map(res => (
                                            <TableRow key={res.name}>
                                                <TableCell className="font-medium">{res.name}</TableCell>
                                                <TableCell className="text-right font-semibold">{res.weightLbs.toFixed(1)}</TableCell>
                                                <TableCell className="text-right font-semibold">{res.weightKg.toFixed(1)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IdealWeightCalculator;

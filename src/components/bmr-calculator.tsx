
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem } from './ui/form';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

// Mifflin-St Jeor Equation
const calculateBmr = (weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number => {
    if (gender === 'male') {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
};

const activityLevels = [
    { label: 'Sedentary (little or no exercise)', value: 1.2 },
    { label: 'Lightly active (light exercise/sports 1-3 days/week)', value: 1.375 },
    { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', value: 1.55 },
    { label: 'Very active (hard exercise/sports 6-7 days a week)', value: 1.725 },
    { label: 'Super active (very hard exercise/sports & physical job)', value: 1.9 },
];

const BmrCalculator = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState('30');
    const [heightCm, setHeightCm] = useState('175');
    const [weightKg, setWeightKg] = useState('70');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('9');
    const [weightLbs, setWeightLbs] = useState('154');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const ageVal = parseInt(age);
        if (isNaN(ageVal) || ageVal <= 0) {
            setResult(null);
            return;
        }

        let weightInKg: number;
        let heightInCm: number;

        if (units === 'metric') {
            weightInKg = parseFloat(weightKg);
            heightInCm = parseFloat(heightCm);
        } else {
            const ft = parseFloat(heightFt);
            const inch = parseFloat(heightIn);
            const totalInches = (ft * 12) + inch;
            heightInCm = totalInches * 2.54;
            weightInKg = parseFloat(weightLbs) * 0.453592;
        }
        
        if (isNaN(weightInKg) || isNaN(heightInCm) || weightInKg <= 0 || heightInCm <= 0) {
            setResult(null);
            return;
        }

        const bmr = calculateBmr(weightInKg, heightInCm, ageVal, gender);
        setResult(bmr);
    };
    
    const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
        setUnits(newUnit);
        setResult(null);
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Basal Metabolic Rate (BMR) Calculator</CardTitle>
                <CardDescription>
                    Estimate the minimum number of calories your body needs at rest.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <Label>Gender</Label>
                             <RadioGroup
                                value={gender}
                                onValueChange={(val) => setGender(val as 'male' | 'female')}
                                className="flex space-x-4 pt-2"
                            >
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male-gender" />
                                    <Label htmlFor="male-gender" className="font-normal">Male</Label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female-gender" />
                                    <Label htmlFor="female-gender" className="font-normal">Female</Label>
                                </FormItem>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="age-bmr">Age</Label>
                            <Input id="age-bmr" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                    </div>
                    
                    <div>
                        <Label>Units</Label>
                        <RadioGroup
                            value={units}
                            onValueChange={(val) => handleUnitChange(val as 'metric' | 'imperial')}
                            className="flex space-x-4 pt-2"
                        >
                            <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="metric" id="metric-units-bmr" />
                                <Label htmlFor="metric-units-bmr" className="font-normal">Metric (cm, kg)</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="imperial" id="imperial-units-bmr" />
                                <Label htmlFor="imperial-units-bmr" className="font-normal">Imperial (ft, in, lbs)</Label>
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
                    

                    <Button onClick={calculate} className="w-full" size="lg">Calculate BMR</Button>
                </div>

                {result !== null && (
                    <div className="mt-8 pt-8 space-y-6">
                        <Separator />
                        <div className="text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Your Basal Metabolic Rate (BMR)</Label>
                            <p className="text-5xl font-bold text-primary">{result.toFixed(0)} Calories/day</p>
                        </div>
                        <Card>
                             <CardHeader>
                                <CardTitle>Estimated Daily Calorie Needs</CardTitle>
                                <CardDescription>Based on your activity level, here's an estimate of calories you need to maintain your current weight.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        {activityLevels.map(level => (
                                            <TableRow key={level.value}>
                                                <TableCell>{level.label}</TableCell>
                                                <TableCell className="text-right font-bold text-lg text-accent">
                                                    {(result * level.value).toFixed(0)} Calories/day
                                                </TableCell>
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

export default BmrCalculator;

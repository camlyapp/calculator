
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from './ui/separator';
import { FormItem } from './ui/form';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

// Mifflin-St Jeor Equation for BMR
const calculateBmr = (weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number => {
    if (gender === 'male') {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
};

const activityLevels = {
    sedentary: { label: 'Sedentary (little or no exercise)', value: 1.2 },
    lightly_active: { label: 'Lightly active (light exercise 1-3 days/week)', value: 1.375 },
    moderately_active: { label: 'Moderately active (moderate exercise 3-5 days/week)', value: 1.55 },
    very_active: { label: 'Very active (hard exercise 6-7 days/week)', value: 1.725 },
    super_active: { label: 'Super active (very hard exercise & physical job)', value: 1.9 },
};

const goals = {
    lose: { label: 'Weight Loss (0.5 lb/week)', value: -250 },
    lose_fast: { label: 'Fast Weight Loss (1 lb/week)', value: -500 },
    maintain: { label: 'Maintain Weight', value: 0 },
    gain: { label: 'Weight Gain (0.5 lb/week)', value: 250 },
    gain_fast: { label: 'Fast Weight Gain (1 lb/week)', value: 500 },
};

const macroRatios = {
    balanced: { label: 'Balanced', carbs: 0.4, protein: 0.3, fat: 0.3 },
    low_carb: { label: 'Low Carb', carbs: 0.2, protein: 0.4, fat: 0.4 },
    high_protein: { label: 'High Protein', carbs: 0.3, protein: 0.4, fat: 0.3 },
};

const chartConfig = {
    Carbs: { label: "Carbs", color: "hsl(var(--chart-1))" },
    Protein: { label: "Protein", color: "hsl(var(--chart-2))" },
    Fat: { label: "Fat", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


const CalorieCalculator = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState('30');
    const [heightCm, setHeightCm] = useState('175');
    const [weightKg, setWeightKg] = useState('70');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('9');
    const [weightLbs, setWeightLbs] = useState('154');
    const [activityLevel, setActivityLevel] = useState('moderately_active');
    const [goal, setGoal] = useState('maintain');
    const [macroRatio, setMacroRatio] = useState('balanced');
    const [result, setResult] = useState<{
        totalCalories: number;
        macros: { carbs: number; protein: number; fat: number };
    } | null>(null);
    
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
            heightInCm = (ft * 12 + inch) * 2.54;
            weightInKg = parseFloat(weightLbs) * 0.453592;
        }

        if (isNaN(weightInKg) || isNaN(heightInCm) || weightInKg <= 0 || heightInCm <= 0) {
            setResult(null);
            return;
        }

        const bmr = calculateBmr(weightInKg, heightInCm, ageVal, gender);
        const tdee = bmr * activityLevels[activityLevel as keyof typeof activityLevels].value;
        const totalCalories = tdee + goals[goal as keyof typeof goals].value;

        const ratio = macroRatios[macroRatio as keyof typeof macroRatios];
        const macros = {
            carbs: (totalCalories * ratio.carbs) / 4, // 4 calories per gram
            protein: (totalCalories * ratio.protein) / 4, // 4 calories per gram
            fat: (totalCalories * ratio.fat) / 9, // 9 calories per gram
        };
        
        setResult({ totalCalories, macros });
    };

     const pieChartData = result ? [
        { name: 'Carbs', value: result.macros.carbs, fill: 'var(--color-Carbs)' },
        { name: 'Protein', value: result.macros.protein, fill: 'var(--color-Protein)' },
        { name: 'Fat', value: result.macros.fat, fill: 'var(--color-Fat)' },
    ].filter(item => item.value > 0) : [];


    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Calorie & Macronutrient Calculator</CardTitle>
                <CardDescription>
                    Estimate your daily calorie needs and get a macronutrient breakdown based on your goals.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <div className="space-y-2">
                             <Label>Gender</Label>
                             <RadioGroup value={gender} onValueChange={(val) => setGender(val as 'male' | 'female')} className="flex pt-2">
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male-gender-cal"/>
                                    <Label htmlFor="male-gender-cal" className="font-normal">Male</Label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female-gender-cal"/>
                                    <Label htmlFor="female-gender-cal" className="font-normal">Female</Label>
                                </FormItem>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="age-cal">Age</Label>
                            <Input id="age-cal" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                    </div>

                    {/* Units & Measurements */}
                     <div>
                        <Label>Units</Label>
                        <RadioGroup value={units} onValueChange={(val) => setUnits(val as 'metric'|'imperial')} className="flex space-x-4 pt-2">
                             <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="metric" id="metric-cal" />
                                <Label htmlFor="metric-cal" className="font-normal">Metric (cm, kg)</Label>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="imperial" id="imperial-cal" />
                                <Label htmlFor="imperial-cal" className="font-normal">Imperial (ft, in, lbs)</Label>
                            </FormItem>
                        </RadioGroup>
                    </div>

                     {units === 'metric' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="height-cm-cal">Height (cm)</Label>
                                <Input id="height-cm-cal" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight-kg-cal">Weight (kg)</Label>
                                <Input id="weight-kg-cal" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
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
                                <Label htmlFor="weight-lbs-cal">Weight (lbs)</Label>
                                <Input id="weight-lbs-cal" type="number" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
                            </div>
                        </div>
                    )}
                    
                    {/* Activity, Goal, Macros */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="activity-level">Activity Level</Label>
                            <Select value={activityLevel} onValueChange={setActivityLevel}>
                                <SelectTrigger id="activity-level"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(activityLevels).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goal">Goal</Label>
                            <Select value={goal} onValueChange={setGoal}>
                                <SelectTrigger id="goal"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(goals).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="macro-ratio">Macronutrient Ratio</Label>
                            <Select value={macroRatio} onValueChange={setMacroRatio}>
                                <SelectTrigger id="macro-ratio"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(macroRatios).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                     </div>

                    <Button onClick={calculate} className="w-full" size="lg">Calculate</Button>
                </div>

                {result && (
                    <div className="mt-8 pt-8 space-y-6">
                        <Separator />
                        <Card className="bg-secondary/50">
                             <CardHeader>
                                <CardTitle className="text-center">Your Daily Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                 <div className="text-center">
                                    <Label className="text-lg text-muted-foreground">Target Daily Calories</Label>
                                    <p className="text-5xl font-bold text-primary">{result.totalCalories.toFixed(0)}</p>
                                </div>
                                <div className="space-y-4">
                                     <div className="text-center">
                                        <Label className="text-lg">Macronutrient Breakdown (grams/day)</Label>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="p-2 bg-background rounded-lg">
                                            <p className="font-bold text-xl" style={{color: 'hsl(var(--chart-1))'}}>
                                                {result.macros.carbs.toFixed(0)}g
                                            </p>
                                            <p className="text-sm">Carbs</p>
                                        </div>
                                         <div className="p-2 bg-background rounded-lg">
                                            <p className="font-bold text-xl" style={{color: 'hsl(var(--chart-2))'}}>
                                                {result.macros.protein.toFixed(0)}g
                                            </p>
                                            <p className="text-sm">Protein</p>
                                        </div>
                                         <div className="p-2 bg-background rounded-lg">
                                            <p className="font-bold text-xl" style={{color: 'hsl(var(--chart-3))'}}>
                                                {result.macros.fat.toFixed(0)}g
                                            </p>
                                            <p className="text-sm">Fat</p>
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

export default CalorieCalculator;

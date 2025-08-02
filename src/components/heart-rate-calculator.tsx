
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FormItem } from './ui/form';

const heartRateZones = [
    { name: 'Zone 1: Very Light', percentage: '50-60%', description: 'Improves overall health and helps recovery.' },
    { name: 'Zone 2: Light', percentage: '60-70%', description: 'Improves basic endurance and fat burning.' },
    { name: 'Zone 3: Moderate', percentage: '70-80%', description: 'Improves cardiovascular fitness.' },
    { name: 'Zone 4: Hard', percentage: '80-90%', description: 'Increases maximum performance capacity.' },
    { name: 'Zone 5: Maximum', percentage: '90-100%', description: 'Develops maximum performance and speed.' },
];

const restingRateCategories = {
    male: [
        { age: '18-25', athletic: '<55', excellent: '56-61', good: '62-65', above_avg: '66-69', avg: '70-73', below_avg: '74-81', poor: '>82' },
        { age: '26-35', athletic: '<54', excellent: '55-61', good: '62-65', above_avg: '66-70', avg: '71-74', below_avg: '75-81', poor: '>82' },
        { age: '36-45', athletic: '<56', excellent: '57-62', good: '63-66', above_avg: '67-70', avg: '71-75', below_avg: '76-82', poor: '>83' },
        { age: '46-55', athletic: '<57', excellent: '58-63', good: '64-67', above_avg: '68-71', avg: '72-76', below_avg: '77-83', poor: '>84' },
        { age: '56-65', athletic: '<56', excellent: '57-61', good: '62-67', above_avg: '68-71', avg: '72-75', below_avg: '76-81', poor: '>82' },
        { age: '65+', athletic: '<55', excellent: '56-61', good: '62-65', above_avg: '66-69', avg: '70-73', below_avg: '74-79', poor: '>80' },
    ],
    female: [
        { age: '18-25', athletic: '<59', excellent: '60-65', good: '66-69', above_avg: '70-73', avg: '74-78', below_avg: '79-84', poor: '>85' },
        { age: '26-35', athletic: '<59', excellent: '60-64', good: '65-68', above_avg: '69-72', avg: '73-76', below_avg: '77-82', poor: '>83' },
        { age: '36-45', athletic: '<59', excellent: '60-64', good: '65-69', above_avg: '70-73', avg: '74-78', below_avg: '79-84', poor: '>85' },
        { age: '46-55', athletic: '<60', excellent: '61-65', good: '66-69', above_avg: '70-73', avg: '74-77', below_avg: '78-83', poor: '>84' },
        { age: '56-65', athletic: '<59', excellent: '60-64', good: '65-68', above_avg: '69-73', avg: '74-77', below_avg: '78-83', poor: '>84' },
        { age: '65+', athletic: '<59', excellent: '60-64', good: '65-68', above_avg: '69-72', avg: '73-76', below_avg: '77-83', poor: '>84' },
    ]
};

const TargetHeartRate = () => {
    const [age, setAge] = useState('30');
    const [maxHeartRate, setMaxHeartRate] = useState<number | null>(null);

    const calculate = () => {
        const ageVal = parseInt(age);
        if (isNaN(ageVal) || ageVal <= 0) {
            setMaxHeartRate(null);
            return;
        }
        setMaxHeartRate(220 - ageVal);
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="age-thr">Your Age</Label>
                <Input id="age-thr" value={age} onChange={(e) => setAge(e.target.value)} type="number" />
            </div>
            <Button onClick={calculate} className="w-full">Calculate Zones</Button>
            {maxHeartRate && (
                <div className="mt-6 pt-6 border-t">
                    <p className="text-center text-lg">Your estimated Maximum Heart Rate is <span className="font-bold text-primary">{maxHeartRate} bpm</span>.</p>
                     <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Target Heart Rate Zones</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Zone</TableHead>
                                        <TableHead>Intensity</TableHead>
                                        <TableHead>Heart Rate Range (bpm)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {heartRateZones.map(zone => {
                                        const [min, max] = zone.percentage.replace('%', '').split('-').map(Number);
                                        const minBpm = Math.round(maxHeartRate * (min / 100));
                                        const maxBpm = Math.round(maxHeartRate * (max / 100));
                                        return (
                                            <TableRow key={zone.name}>
                                                <TableCell className="font-semibold">{zone.name}</TableCell>
                                                <TableCell>{zone.percentage}</TableCell>
                                                <TableCell className="text-accent font-bold">{minBpm} - {maxBpm}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

const RestingHeartRate = () => {
    const [rhr, setRhr] = useState('65');
    const [age, setAge] = useState('30');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [result, setResult] = useState<string | null>(null);

    const analyze = () => {
        const rhrVal = parseInt(rhr);
        const ageVal = parseInt(age);
        if (isNaN(rhrVal) || isNaN(ageVal)) {
            setResult(null);
            return;
        }

        const ageGroup = restingRateCategories[gender].find(g => {
            if (g.age.includes('+')) return ageVal >= parseInt(g.age);
            const [min, max] = g.age.split('-').map(Number);
            return ageVal >= min && ageVal <= max;
        });

        if (!ageGroup) {
            setResult("Age out of range for typical data.");
            return;
        }

        for (const [category, range] of Object.entries(ageGroup)) {
            if (category === 'age') continue;
            if (typeof range === 'string') {
                if (range.startsWith('<')) {
                    if (rhrVal < parseInt(range.substring(1))) {
                        setResult(category.charAt(0).toUpperCase() + category.slice(1));
                        return;
                    }
                } else if (range.startsWith('>')) {
                     if (rhrVal > parseInt(range.substring(1))) {
                        setResult(category.charAt(0).toUpperCase() + category.slice(1));
                        return;
                    }
                } else {
                    const [min, max] = range.split('-').map(Number);
                    if (rhrVal >= min && rhrVal <= max) {
                        setResult(category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '));
                        return;
                    }
                }
            }
        }
    };
    
    return (
         <div className="space-y-4 pt-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="rhr">Resting Heart Rate (bpm)</Label>
                    <Input id="rhr" value={rhr} onChange={(e) => setRhr(e.target.value)} type="number" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="rhr-age">Your Age</Label>
                    <Input id="rhr-age" value={age} onChange={(e) => setAge(e.target.value)} type="number" />
                </div>
                 <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup value={gender} onValueChange={(v) => setGender(v as 'male'|'female')} className="flex pt-2">
                        <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male-rhr" />
                            <Label htmlFor="male-rhr" className="font-normal">Male</Label>
                        </FormItem>
                         <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female-rhr" />
                            <Label htmlFor="female-rhr" className="font-normal">Female</Label>
                        </FormItem>
                    </RadioGroup>
                </div>
            </div>
            <Button onClick={analyze} className="w-full">Analyze RHR</Button>
             {result && (
                <div className="mt-6 pt-6 border-t text-center">
                    <Label>Your Fitness Category (based on RHR)</Label>
                    <p className="text-2xl font-bold text-primary">{result}</p>
                </div>
            )}
        </div>
    );
};

const HeartRateCalculator = () => {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Heart Rate Calculator</CardTitle>
                <CardDescription>
                    Calculate your target heart rate for exercise and analyze your resting heart rate.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="target" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="target">Target Heart Rate</TabsTrigger>
                        <TabsTrigger value="resting">Resting Heart Rate</TabsTrigger>
                    </TabsList>
                    <TabsContent value="target">
                       <TargetHeartRate />
                    </TabsContent>
                    <TabsContent value="resting">
                        <RestingHeartRate />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default HeartRateCalculator;

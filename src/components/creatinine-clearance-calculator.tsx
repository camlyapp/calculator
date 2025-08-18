
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem } from './ui/form';
import { Separator } from './ui/separator';

// Cockcroft-Gault formula
const calculateCrCl = (
    age: number,
    weightKg: number,
    serumCreatinine: number, // in mg/dL
    gender: 'male' | 'female'
): number => {
    if (age <= 0 || weightKg <= 0 || serumCreatinine <= 0) return 0;

    const crcl = ((140 - age) * weightKg) / (72 * serumCreatinine);
    
    if (gender === 'female') {
        return crcl * 0.85;
    }
    
    return crcl;
};

const CreatinineClearanceCalculator = () => {
    const [age, setAge] = useState('50');
    const [weight, setWeight] = useState('70'); // kg
    const [serumCreatinine, setSerumCreatinine] = useState('1.1'); // mg/dL
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const ageVal = parseInt(age);
        const weightVal = parseFloat(weight);
        const creatinineVal = parseFloat(serumCreatinine);
        
        if (isNaN(ageVal) || isNaN(weightVal) || isNaN(creatinineVal)) {
            setResult(null);
            return;
        }

        const crcl = calculateCrCl(ageVal, weightVal, creatinineVal, gender);
        setResult(crcl);
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Creatinine Clearance Calculator</CardTitle>
                <CardDescription>
                    Estimate kidney function using the Cockcroft-Gault formula. For educational purposes only.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup value={gender} onValueChange={(val) => setGender(val as 'male' | 'female')} className="flex pt-2">
                               <FormItem className="flex items-center space-x-2">
                                   <RadioGroupItem value="male" id="male-crcl"/>
                                   <Label htmlFor="male-crcl" className="font-normal">Male</Label>
                               </FormItem>
                               <FormItem className="flex items-center space-x-2">
                                   <RadioGroupItem value="female" id="female-crcl"/>
                                   <Label htmlFor="female-crcl" className="font-normal">Female</Label>
                               </FormItem>
                           </RadioGroup>
                       </div>
                        <div className="space-y-2">
                           <Label htmlFor="age-crcl">Age</Label>
                           <Input id="age-crcl" type="number" value={age} onChange={e => setAge(e.target.value)} />
                       </div>
                        <div className="space-y-2">
                           <Label htmlFor="weight-crcl">Weight (kg)</Label>
                           <Input id="weight-crcl" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                       </div>
                        <div className="space-y-2">
                           <Label htmlFor="serum-crcl">Serum Creatinine (mg/dL)</Label>
                           <Input id="serum-crcl" type="number" value={serumCreatinine} onChange={e => setSerumCreatinine(e.target.value)} step="0.1"/>
                       </div>
                    </div>
                    
                    <Button onClick={calculate} className="w-full" size="lg">Calculate</Button>
                </div>

                {result !== null && (
                    <div className="mt-8 pt-8">
                        <Separator />
                        <div className="mt-8 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Estimated Creatinine Clearance</Label>
                            <p className="text-5xl font-bold text-primary">{result.toFixed(2)} mL/min</p>
                             <p className="text-xs text-muted-foreground mt-2">This is an estimate. Consult a healthcare professional for medical advice.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CreatinineClearanceCalculator;

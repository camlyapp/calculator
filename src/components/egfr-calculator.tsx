
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem } from './ui/form';
import { Separator } from './ui/separator';

// 2021 CKD-EPI Creatinine Equation
const calculateEgfr = (
    serumCreatinine: number, // in mg/dL
    age: number,
    gender: 'male' | 'female'
): number => {
    if (age <= 0 || serumCreatinine <= 0) return 0;
    
    let k: number, a: number;
    if (gender === 'female') {
        k = 0.7;
        a = -0.241;
    } else { // male
        k = 0.9;
        a = -0.302;
    }
    
    const scr_k = serumCreatinine / k;
    
    const egfr = 142 * Math.pow(Math.min(scr_k, 1), a) * Math.pow(Math.max(scr_k, 1), -1.200) * Math.pow(0.9938, age) * (gender === 'female' ? 1.012 : 1);
    
    return egfr;
};

const getEgfrStage = (egfr: number): { stage: string, description: string, colorClass: string } => {
    if (egfr >= 90) return { stage: 'Stage 1', description: 'Normal or high GFR', colorClass: 'text-green-500' };
    if (egfr >= 60) return { stage: 'Stage 2', description: 'Mildly decreased GFR', colorClass: 'text-yellow-500' };
    if (egfr >= 45) return { stage: 'Stage 3a', description: 'Mildly to moderately decreased GFR', colorClass: 'text-orange-500' };
    if (egfr >= 30) return { stage: 'Stage 3b', description: 'Moderately to severely decreased GFR', colorClass: 'text-orange-600' };
    if (egfr >= 15) return { stage: 'Stage 4', description: 'Severely decreased GFR', colorClass: 'text-red-500' };
    return { stage: 'Stage 5', description: 'Kidney Failure', colorClass: 'text-red-700' };
};

const EgfrCalculator = () => {
    const [age, setAge] = useState('50');
    const [serumCreatinine, setSerumCreatinine] = useState('1.1');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [result, setResult] = useState<{ egfr: number, stage: string, description: string, colorClass: string } | null>(null);

    const calculate = () => {
        const ageVal = parseInt(age);
        const creatinineVal = parseFloat(serumCreatinine);
        
        if (isNaN(ageVal) || isNaN(creatinineVal)) {
            setResult(null);
            return;
        }

        const egfr = calculateEgfr(creatinineVal, ageVal, gender);
        const stageInfo = getEgfrStage(egfr);
        setResult({
            egfr,
            ...stageInfo
        });
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">eGFR Calculator (CKD-EPI 2021)</CardTitle>
                <CardDescription>
                    Estimate Glomerular Filtration Rate using the 2021 CKD-EPI Creatinine Equation. For educational use only.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup value={gender} onValueChange={(val) => setGender(val as 'male' | 'female')} className="flex pt-2">
                               <FormItem className="flex items-center space-x-2">
                                   <RadioGroupItem value="male" id="male-egfr"/>
                                   <Label htmlFor="male-egfr" className="font-normal">Male</Label>
                               </FormItem>
                               <FormItem className="flex items-center space-x-2">
                                   <RadioGroupItem value="female" id="female-egfr"/>
                                   <Label htmlFor="female-egfr" className="font-normal">Female</Label>
                               </FormItem>
                           </RadioGroup>
                       </div>
                        <div className="space-y-2">
                           <Label htmlFor="age-egfr">Age</Label>
                           <Input id="age-egfr" type="number" value={age} onChange={e => setAge(e.target.value)} />
                       </div>
                        <div className="space-y-2">
                           <Label htmlFor="serum-egfr">Serum Creatinine (mg/dL)</Label>
                           <Input id="serum-egfr" type="number" value={serumCreatinine} onChange={e => setSerumCreatinine(e.target.value)} step="0.1"/>
                       </div>
                    </div>
                    
                    <Button onClick={calculate} className="w-full" size="lg">Calculate eGFR</Button>
                </div>

                {result !== null && (
                    <div className="mt-8 pt-8">
                        <Separator />
                        <div className="mt-8 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Estimated GFR</Label>
                            <p className="text-5xl font-bold text-primary">{result.egfr.toFixed(0)} mL/min/1.73m²</p>
                            <div className={`mt-2 font-semibold text-xl ${result.colorClass}`}>
                                <p>{result.stage}: {result.description}</p>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">This is an estimate. Consult a healthcare professional for medical advice.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EgfrCalculator;

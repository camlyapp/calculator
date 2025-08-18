
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem } from './ui/form';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '@/lib/utils';

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

const egfrStages = [
    { stage: 'Stage 1', gfr: '90+', description: 'Normal or high', colorClass: 'bg-green-100 dark:bg-green-900/50' },
    { stage: 'Stage 2', gfr: '60-89', description: 'Mildly decreased', colorClass: 'bg-yellow-100 dark:bg-yellow-900/50' },
    { stage: 'Stage 3a', gfr: '45-59', description: 'Mildly to moderately decreased', colorClass: 'bg-orange-100 dark:bg-orange-900/50' },
    { stage: 'Stage 3b', gfr: '30-44', description: 'Moderately to severely decreased', colorClass: 'bg-orange-200 dark:bg-orange-800/50' },
    { stage: 'Stage 4', gfr: '15-29', description: 'Severely decreased', colorClass: 'bg-red-100 dark:bg-red-900/50' },
    { stage: 'Stage 5', gfr: '<15', description: 'Kidney failure', colorClass: 'bg-red-200 dark:bg-red-800/50' },
];

const getEgfrStageInfo = (egfr: number): { stage: string, description: string, colorClass: string } => {
    if (egfr >= 90) return { stage: 'Stage 1', description: 'Normal or high GFR', colorClass: 'text-green-600 dark:text-green-400' };
    if (egfr >= 60) return { stage: 'Stage 2', description: 'Mildly decreased GFR', colorClass: 'text-yellow-600 dark:text-yellow-400' };
    if (egfr >= 45) return { stage: 'Stage 3a', description: 'Mildly to moderately decreased GFR', colorClass: 'text-orange-600 dark:text-orange-400' };
    if (egfr >= 30) return { stage: 'Stage 3b', description: 'Moderately to severely decreased GFR', colorClass: 'text-orange-700 dark:text-orange-500' };
    if (egfr >= 15) return { stage: 'Stage 4', description: 'Severely decreased GFR', colorClass: 'text-red-600 dark:text-red-400' };
    return { stage: 'Stage 5', description: 'Kidney Failure', colorClass: 'text-red-700 dark:text-red-500' };
};

const getRiskCategory = (egfr: number, uacr: number): { category: string, color: string } => {
    if (uacr < 30) {
        if (egfr >= 60) return { category: 'Low Risk', color: 'bg-green-500' };
        if (egfr >= 45) return { category: 'Moderately Increased Risk', color: 'bg-yellow-500' };
        if (egfr >= 30) return { category: 'High Risk', color: 'bg-orange-500' };
        return { category: 'Very High Risk', color: 'bg-red-500' };
    } else if (uacr <= 300) {
        if (egfr >= 60) return { category: 'Moderately Increased Risk', color: 'bg-yellow-500' };
        if (egfr >= 45) return { category: 'High Risk', color: 'bg-orange-500' };
        return { category: 'Very High Risk', color: 'bg-red-500' };
    } else { // uacr > 300
        if (egfr >= 60) return { category: 'High Risk', color: 'bg-orange-500' };
        return { category: 'Very High Risk', color: 'bg-red-500' };
    }
};

const kdigoRiskMatrix = [
    { uacr: 'A1 (<30)', gfr60: 'Low', gfr45: 'Moderate', gfr30: 'High', gfr15: 'Very High', color60: 'bg-green-500/80', color45: 'bg-yellow-500/80', color30: 'bg-orange-500/80', color15: 'bg-red-500/80' },
    { uacr: 'A2 (30-300)', gfr60: 'Moderate', gfr45: 'High', gfr30: 'Very High', gfr15: 'Very High', color60: 'bg-yellow-500/80', color45: 'bg-orange-500/80', color30: 'bg-red-500/80', color15: 'bg-red-500/80' },
    { uacr: 'A3 (>300)', gfr60: 'High', gfr45: 'Very High', gfr30: 'Very High', gfr15: 'Very High', color60: 'bg-orange-500/80', color45: 'bg-red-500/80', color30: 'bg-red-500/80', color15: 'bg-red-500/80' },
];


const EgfrCalculator = () => {
    const [age, setAge] = useState('50');
    const [serumCreatinine, setSerumCreatinine] = useState('1.1');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [uacr, setUacr] = useState('20');
    const [result, setResult] = useState<{ 
        egfr: number;
        stage: string;
        description: string;
        colorClass: string;
        risk: { category: string; color: string; };
     } | null>(null);

    const calculate = () => {
        const ageVal = parseInt(age);
        const creatinineVal = parseFloat(serumCreatinine);
        const uacrVal = parseFloat(uacr);
        
        if (isNaN(ageVal) || isNaN(creatinineVal) || isNaN(uacrVal) || ageVal <=0 || creatinineVal <= 0 || uacrVal < 0) {
            setResult(null);
            return;
        }

        const egfr = calculateEgfr(creatinineVal, ageVal, gender);
        const stageInfo = getEgfrStageInfo(egfr);
        const riskInfo = getRiskCategory(egfr, uacrVal);
        setResult({
            egfr,
            ...stageInfo,
            risk: riskInfo,
        });
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Advanced eGFR Calculator (CKD-EPI 2021)</CardTitle>
                <CardDescription>
                    Estimate Glomerular Filtration Rate and assess kidney health risk using the 2021 CKD-EPI equation and UACR. For educational use only.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="space-y-2">
                           <Label htmlFor="uacr-egfr">UACR (mg/g)</Label>
                           <Input id="uacr-egfr" type="number" value={uacr} onChange={e => setUacr(e.target.value)} step="1"/>
                       </div>
                    </div>
                    
                    <Button onClick={calculate} className="w-full" size="lg">Calculate eGFR & Risk</Button>
                </div>

                {result !== null && (
                    <div className="mt-8 pt-8 space-y-8">
                        <Separator />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="text-center bg-secondary/50 p-6 rounded-lg">
                                <Label className="text-lg text-muted-foreground">Estimated GFR</Label>
                                <p className="text-5xl font-bold text-primary">{result.egfr.toFixed(0)} mL/min/1.73m²</p>
                                <div className={`mt-2 font-semibold text-xl ${result.colorClass}`}>
                                    <p>{result.stage}: {result.description}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">This is an estimate. Consult a healthcare professional for medical advice.</p>
                            </div>
                            <div className="text-center bg-secondary/50 p-6 rounded-lg">
                                <Label className="text-lg text-muted-foreground">Kidney Disease Prognosis</Label>
                                <p className="text-5xl font-bold text-primary flex items-center justify-center gap-3">
                                    <span className={cn('w-8 h-8 rounded-full', result.risk.color)}></span>
                                    {result.risk.category}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">Based on KDIGO 2024 guidelines (eGFR + UACR).</p>
                            </div>
                        </div>

                         <Card>
                            <CardHeader>
                                <CardTitle>CKD Prognosis Heat Map (KDIGO)</CardTitle>
                                <CardDescription>Your risk category is based on both eGFR (columns) and Albuminuria/UACR (rows).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>UACR (mg/g)</TableHead>
                                            <TableHead className="text-center">eGFR ≥60</TableHead>
                                            <TableHead className="text-center">eGFR 45-59</TableHead>
                                            <TableHead className="text-center">eGFR 30-44</TableHead>
                                            <TableHead className="text-center">eGFR {'<'}30</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kdigoRiskMatrix.map(row => (
                                            <TableRow key={row.uacr}>
                                                <TableCell className="font-bold">{row.uacr}</TableCell>
                                                <TableCell className={cn('text-center text-background font-semibold', row.color60)}>{row.gfr60}</TableCell>
                                                <TableCell className={cn('text-center text-background font-semibold', row.color45)}>{row.gfr45}</TableCell>
                                                <TableCell className={cn('text-center text-background font-semibold', row.color30)}>{row.gfr30}</TableCell>
                                                <TableCell className={cn('text-center text-background font-semibold', row.color15)}>{row.gfr15}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>What is eGFR?</AccordionTrigger>
                                        <AccordionContent>
                                            eGFR stands for estimated Glomerular Filtration Rate. It is a measure of how well your kidneys are filtering wastes from your blood. It's calculated from your blood serum creatinine level, age, and gender.
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="item-2">
                                        <AccordionTrigger>What is UACR?</AccordionTrigger>
                                        <AccordionContent>
                                            UACR stands for Urine Albumin-to-Creatinine Ratio. It measures the amount of albumin (a type of protein) in your urine. A high UACR can be an early sign of kidney damage, as healthy kidneys do not let albumin pass into the urine.
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="item-3">
                                        <AccordionTrigger>Why combine eGFR and UACR?</AccordionTrigger>
                                        <AccordionContent>
                                           Combining eGFR (a measure of kidney function) with UACR (a measure of kidney damage) gives a more complete picture of kidney health. This combination is used to determine the risk of Chronic Kidney Disease (CKD) progression, allowing for better management and treatment planning.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>What do the different risk categories mean?</AccordionTrigger>
                                        <AccordionContent>
                                           The colors on the heat map represent the risk for CKD progression, cardiovascular events, and other adverse outcomes. Green (Low Risk) is ideal. Yellow (Moderately Increased) suggests monitoring. Orange (High) and Red (Very High) indicate a significant risk and typically require active management by a healthcare professional.
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="item-5">
                                        <AccordionTrigger>Is this calculator a medical diagnosis?</AccordionTrigger>
                                        <AccordionContent className="font-semibold text-destructive">
                                            No. This calculator is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding your health and any medical conditions.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EgfrCalculator;


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
        
        if (isNaN(ageVal) || isNaN(creatinineVal) || ageVal <=0 || creatinineVal <= 0) {
            setResult(null);
            return;
        }

        const egfr = calculateEgfr(creatinineVal, ageVal, gender);
        const stageInfo = getEgfrStageInfo(egfr);
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
                    <div className="mt-8 pt-8 space-y-8">
                        <Separator />
                        <div className="text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Estimated GFR</Label>
                            <p className="text-5xl font-bold text-primary">{result.egfr.toFixed(0)} mL/min/1.73m²</p>
                            <div className={`mt-2 font-semibold text-xl ${result.colorClass}`}>
                                <p>{result.stage}: {result.description}</p>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">This is an estimate. Consult a healthcare professional for medical advice.</p>
                        </div>

                         <Card>
                            <CardHeader>
                                <CardTitle>eGFR Stages of Chronic Kidney Disease (CKD)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Stage</TableHead>
                                            <TableHead>eGFR (mL/min/1.73m²)</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {egfrStages.map(stage => (
                                            <TableRow key={stage.stage} className={result.stage === stage.stage ? stage.colorClass : ''}>
                                                <TableCell className="font-bold">{stage.stage}</TableCell>
                                                <TableCell>{stage.gfr}</TableCell>
                                                <TableCell>{stage.description}</TableCell>
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
                                        <AccordionTrigger>Why is eGFR important?</AccordionTrigger>
                                        <AccordionContent>
                                            The eGFR is a key indicator of kidney health. A low eGFR may be a sign of kidney disease. Early detection can help prevent the progression of kidney disease.
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="item-3">
                                        <AccordionTrigger>What do the different stages mean?</AccordionTrigger>
                                        <AccordionContent>
                                            The stages classify the severity of chronic kidney disease (CKD). Stage 1 indicates normal or high function but with evidence of kidney damage. Stages 2-4 indicate progressively worsening kidney function. Stage 5 signifies kidney failure, often requiring dialysis or a transplant.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>What factors can affect eGFR results?</AccordionTrigger>
                                        <AccordionContent>
                                            Several factors can influence eGFR, including muscle mass, diet (especially high meat intake), certain medications, and hydration levels. The formula used here is a standardized estimate and may not be perfectly accurate for every individual.
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

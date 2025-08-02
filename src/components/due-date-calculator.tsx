
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { addDays, format, isValid, differenceInDays } from 'date-fns';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

const DueDateCalculator = () => {
    const [calculationMethod, setCalculationMethod] = useState<'lmp' | 'conception'>('lmp');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [result, setResult] = useState<{
        dueDate: string;
        gestationalAge: string;
        trimester: number;
        conceptionDate: string;
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateDueDate = () => {
        if (selectedDate && isValid(selectedDate)) {
            let dueDate: Date;
            let conceptionDateEst: Date;

            if (calculationMethod === 'lmp') {
                dueDate = addDays(selectedDate, 280);
                conceptionDateEst = addDays(selectedDate, 14);
            } else { // Conception date
                dueDate = addDays(selectedDate, 266);
                conceptionDateEst = selectedDate;
            }

            const today = new Date();
            const gestationalDays = differenceInDays(today, conceptionDateEst) + 14;

            if (gestationalDays < 0 || gestationalDays > 300) { // Basic validation
                setResult(null);
                return;
            }

            const weeks = Math.floor(gestationalDays / 7);
            const days = gestationalDays % 7;
            
            let trimester = 1;
            if (weeks >= 28) trimester = 3;
            else if (weeks >= 14) trimester = 2;
            
            setResult({
                dueDate: format(dueDate, 'PPP'),
                gestationalAge: `${weeks} weeks, ${days} days`,
                trimester,
                conceptionDate: format(conceptionDateEst, 'PPP')
            });
        } else {
            setResult(null);
        }
    };
    
    useEffect(() => {
        if (isMounted) {
            calculateDueDate();
        }
    }, [selectedDate, calculationMethod, isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Pregnancy Due Date Calculator</CardTitle>
                <CardDescription>Estimate your due date based on your last menstrual period or conception date.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className='flex-1 space-y-4'>
                         <div>
                            <Label>Calculation Method</Label>
                            <RadioGroup
                                value={calculationMethod}
                                onValueChange={(val) => setCalculationMethod(val as 'lmp' | 'conception')}
                                className="flex space-x-4 pt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lmp" id="lmp-method" />
                                    <Label htmlFor="lmp-method" className="font-normal">Last Menstrual Period</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="conception" id="conception-method" />
                                    <Label htmlFor="conception-method" className="font-normal">Date of Conception</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2 flex flex-col items-center">
                            <Label>{calculationMethod === 'lmp' ? 'First Day of Last Period' : 'Date of Conception'}</Label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                        </div>
                         <Button onClick={calculateDueDate} className="w-full">Calculate</Button>
                    </div>
                    
                    {result && (
                        <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t">
                            <div className="text-center space-y-8">
                                <div>
                                    <Label className="text-lg text-muted-foreground">Estimated Due Date</Label>
                                    <p className="text-4xl font-bold text-primary">{result.dueDate}</p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Gestational Age</p>
                                        <p className="font-bold text-lg">{result.gestationalAge}</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Current Trimester</p>
                                        <p className="font-bold text-lg">{result.trimester}</p>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-accent/20 rounded-lg">
                                    <Label className="text-accent-foreground">Estimated Conception Date</Label>
                                    <p className="text-xl font-bold text-accent">{result.conceptionDate}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DueDateCalculator;


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { addDays, format, isValid, differenceInDays, subDays } from 'date-fns';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

type CalculationMethod = 'lmp' | 'conception' | 'ivf_day3' | 'ivf_day5' | 'ultrasound';

const DueDateCalculator = () => {
    const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('lmp');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    
    // State for ultrasound method
    const [ultrasoundDate, setUltrasoundDate] = useState<Date | undefined>(new Date());
    const [weeksAtUltrasound, setWeeksAtUltrasound] = useState('8');
    const [daysAtUltrasound, setDaysAtUltrasound] = useState('0');

    const [result, setResult] = useState<{
        dueDate: string;
        gestationalAge: string;
        trimester: number;
        conceptionDate: string;
        methodUsed: string;
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateDueDate = () => {
        if (!isMounted) return;

        let dueDate: Date | undefined;
        let conceptionDateEst: Date | undefined;
        let methodUsed = '';

        const dateForCalc = calculationMethod === 'ultrasound' ? ultrasoundDate : selectedDate;

        if (!dateForCalc || !isValid(dateForCalc)) {
            setResult(null);
            return;
        }
        
        switch (calculationMethod) {
            case 'lmp':
                // Naegele's rule: LMP + 280 days (40 weeks)
                dueDate = addDays(dateForCalc, 280);
                conceptionDateEst = addDays(dateForCalc, 14);
                methodUsed = "Last Menstrual Period (Naegele's Rule)";
                break;
            case 'conception':
                dueDate = addDays(dateForCalc, 266);
                conceptionDateEst = dateForCalc;
                methodUsed = "Date of Conception";
                break;
            case 'ivf_day3':
                // Transfer date + 266 days - 3 days
                dueDate = addDays(dateForCalc, 263);
                conceptionDateEst = subDays(dateForCalc, 3);
                methodUsed = "IVF Transfer (3-Day Embryo)";
                break;
             case 'ivf_day5':
                // Transfer date + 266 days - 5 days
                dueDate = addDays(dateForCalc, 261);
                conceptionDateEst = subDays(dateForCalc, 5);
                methodUsed = "IVF Transfer (5-Day Embryo)";
                break;
            case 'ultrasound':
                const weeks = parseInt(weeksAtUltrasound) || 0;
                const days = parseInt(daysAtUltrasound) || 0;
                const totalDaysGestationAtUltrasound = weeks * 7 + days;
                // Find estimated LMP from ultrasound
                const estLmp = subDays(dateForCalc, totalDaysGestationAtUltrasound);
                dueDate = addDays(estLmp, 280);
                conceptionDateEst = addDays(estLmp, 14);
                methodUsed = "Ultrasound Date";
                break;
        }

        if (dueDate && conceptionDateEst && isValid(dueDate) && isValid(conceptionDateEst)) {
            const today = new Date();
            const gestationalDays = differenceInDays(today, conceptionDateEst) + 14;

            if (gestationalDays < 0 || gestationalDays > 300) {
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
                conceptionDate: format(conceptionDateEst, 'PPP'),
                methodUsed,
            });
        } else {
            setResult(null);
        }
    };
    
    useEffect(() => {
       calculateDueDate();
    }, [selectedDate, calculationMethod, ultrasoundDate, weeksAtUltrasound, daysAtUltrasound, isMounted]);

    if (!isMounted) {
        return null;
    }
    
    const getLabelForDate = () => {
        switch(calculationMethod) {
            case 'lmp': return "First Day of Last Period";
            case 'conception': return "Date of Conception";
            case 'ivf_day3':
            case 'ivf_day5':
                return "Date of Embryo Transfer";
            default: return "";
        }
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Pregnancy Due Date Calculator</CardTitle>
                <CardDescription>Estimate your due date with various methods and rules.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className='flex-1 space-y-4'>
                         <div className='space-y-2'>
                            <Label>Calculation Method</Label>
                            <Select value={calculationMethod} onValueChange={(val) => setCalculationMethod(val as CalculationMethod)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lmp">Last Menstrual Period</SelectItem>
                                    <SelectItem value="conception">Date of Conception</SelectItem>
                                    <SelectItem value="ivf_day3">IVF Transfer (3-Day)</SelectItem>
                                    <SelectItem value="ivf_day5">IVF Transfer (5-Day)</SelectItem>
                                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {calculationMethod !== 'ultrasound' ? (
                             <div className="space-y-2 flex flex-col items-center">
                                <Label>{getLabelForDate()}</Label>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4 p-4 border rounded-lg">
                                <div className="space-y-2 flex flex-col items-center">
                                    <Label>Date of Ultrasound</Label>
                                    <Calendar
                                        mode="single"
                                        selected={ultrasoundDate}
                                        onSelect={setUltrasoundDate}
                                        className="rounded-md border"
                                    />
                                </div>
                                <div className="flex gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="weeks-us">Gestation (Weeks)</Label>
                                        <Input id="weeks-us" value={weeksAtUltrasound} onChange={e => setWeeksAtUltrasound(e.target.value)} type="number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="days-us">Gestation (Days)</Label>
                                        <Input id="days-us" value={daysAtUltrasound} onChange={e => setDaysAtUltrasound(e.target.value)} type="number" />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                         <Button onClick={calculateDueDate} className="w-full">Calculate</Button>
                    </div>
                    
                    {result && (
                        <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t">
                            <div className="text-center space-y-8">
                                <div>
                                    <Label className="text-lg text-muted-foreground">Estimated Due Date</Label>
                                    <p className="text-4xl font-bold text-primary">{result.dueDate}</p>
                                    <p className="text-xs text-muted-foreground">Based on {result.methodUsed}</p>
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

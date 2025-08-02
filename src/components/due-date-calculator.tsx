
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
        dueDate: Date;
        gestationalAge: string;
        trimester: number;
        conceptionDate: Date;
        methodUsed: string;
        daysUntilDue: number;
        milestones: { name: string; date: string; }[];
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateDueDate = () => {
        if (!isMounted) return;

        let dueDate: Date | undefined;
        let lmpFromConception: Date | undefined;
        let methodUsed = '';

        const dateForCalc = calculationMethod === 'ultrasound' ? ultrasoundDate : selectedDate;

        if (!dateForCalc || !isValid(dateForCalc)) {
            setResult(null);
            return;
        }
        
        switch (calculationMethod) {
            case 'lmp':
                lmpFromConception = dateForCalc;
                methodUsed = "Last Menstrual Period (Naegele's Rule)";
                break;
            case 'conception':
                lmpFromConception = subDays(dateForCalc, 14);
                methodUsed = "Date of Conception";
                break;
            case 'ivf_day3':
                lmpFromConception = subDays(dateForCalc, 17); // 14 days for ovulation + 3 days embryo
                methodUsed = "IVF Transfer (3-Day Embryo)";
                break;
             case 'ivf_day5':
                lmpFromConception = subDays(dateForCalc, 19); // 14 days for ovulation + 5 days embryo
                methodUsed = "IVF Transfer (5-Day Embryo)";
                break;
            case 'ultrasound':
                const weeks = parseInt(weeksAtUltrasound) || 0;
                const days = parseInt(daysAtUltrasound) || 0;
                const totalDaysGestationAtUltrasound = weeks * 7 + days;
                lmpFromConception = subDays(dateForCalc, totalDaysGestationAtUltrasound);
                methodUsed = "Ultrasound Date";
                break;
        }
        
        dueDate = addDays(lmpFromConception, 280);
        const conceptionDate = addDays(lmpFromConception, 14);

        if (dueDate && conceptionDate && isValid(dueDate) && isValid(conceptionDate)) {
            const today = new Date();
            const gestationalDays = differenceInDays(today, lmpFromConception);

            if (gestationalDays < 0 || gestationalDays > 300) {
                setResult(null);
                return;
            }

            const weeks = Math.floor(gestationalDays / 7);
            const days = gestationalDays % 7;
            
            let trimester = 1;
            if (weeks >= 28) trimester = 3;
            else if (weeks >= 14) trimester = 2;
            
            const milestones = [
                { name: "End of 1st Trimester", date: format(addDays(lmpFromConception, 14 * 7), 'PPP')},
                { name: "End of 2nd Trimester", date: format(addDays(lmpFromConception, 28 * 7), 'PPP')},
                { name: "Estimated Viability", date: format(addDays(lmpFromConception, 24 * 7), 'PPP')},
            ];

            setResult({
                dueDate,
                gestationalAge: `${weeks} weeks, ${days} days`,
                trimester,
                conceptionDate,
                methodUsed,
                daysUntilDue: differenceInDays(dueDate, today),
                milestones,
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
                <CardDescription>Estimate your due date with various methods and get key pregnancy milestones.</CardDescription>
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
                        <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t space-y-6">
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-primary">Estimated Due Date</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-4xl font-bold">{format(result.dueDate, 'PPP')}</p>
                                    <p className="text-lg text-accent">{result.daysUntilDue} days to go!</p>
                                    <p className="text-xs text-muted-foreground mt-2">Based on {result.methodUsed}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Status</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                                     <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Gestational Age</p>
                                        <p className="font-bold text-lg">{result.gestationalAge}</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Current Trimester</p>
                                        <p className="font-bold text-lg">{result.trimester}</p>
                                    </div>
                                      <div className="p-4 bg-muted rounded-lg col-span-full">
                                        <p className="text-sm text-muted-foreground">Estimated Conception Date</p>
                                        <p className="font-bold text-lg">{format(result.conceptionDate, 'PPP')}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Milestones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {result.milestones.map(m => (
                                        <div key={m.name} className="flex justify-between text-sm p-2 bg-muted rounded-lg">
                                            <span>{m.name}</span>
                                            <span className="font-semibold">{m.date}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DueDateCalculator;

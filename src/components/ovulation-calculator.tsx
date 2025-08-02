
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addDays, subDays, format, isValid } from 'date-fns';
import { Button } from './ui/button';

const OvulationCalculator = () => {
    const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(new Date());
    const [cycleLength, setCycleLength] = useState('28');
    const [result, setResult] = useState<{
        ovulationDate: string;
        fertileWindowStart: string;
        fertileWindowEnd: string;
        nextPeriodDate: string;
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateOvulation = () => {
        if (!lastPeriodDate || !isValid(lastPeriodDate)) {
            setResult(null);
            return;
        }

        const length = parseInt(cycleLength);
        if (isNaN(length) || length < 21 || length > 45) { // Common physiological range
            setResult(null);
            return;
        }

        // Ovulation typically occurs 14 days before the next period.
        const nextPeriod = addDays(lastPeriodDate, length);
        const ovulationDay = subDays(nextPeriod, 14);

        setResult({
            ovulationDate: format(ovulationDay, 'PPP'),
            // Fertile window is typically 5 days before ovulation + ovulation day
            fertileWindowStart: format(subDays(ovulationDay, 5), 'PPP'),
            fertileWindowEnd: format(ovulationDay, 'PPP'),
            nextPeriodDate: format(nextPeriod, 'PPP'),
        });
    };

    useEffect(() => {
        if (isMounted) {
            calculateOvulation();
        }
    }, [lastPeriodDate, cycleLength, isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Ovulation Calculator</CardTitle>
                <CardDescription>
                    Estimate your most fertile days to help you get pregnant.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className='flex-1 space-y-4'>
                        <div className="space-y-2 flex flex-col items-center">
                            <Label>First Day of Your Last Period</Label>
                            <Calendar
                                mode="single"
                                selected={lastPeriodDate}
                                onSelect={setLastPeriodDate}
                                className="rounded-md border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cycle-length">Average Cycle Length (Days)</Label>
                            <Input
                                id="cycle-length"
                                value={cycleLength}
                                onChange={e => setCycleLength(e.target.value)}
                                type="number"
                                placeholder="e.g., 28"
                            />
                             <p className="text-xs text-muted-foreground">Typically between 21 and 45 days.</p>
                        </div>
                        <Button onClick={calculateOvulation} className="w-full">Recalculate</Button>
                    </div>
                    
                    {result && (
                        <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t space-y-6">
                             <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-primary">Estimated Fertile Window</CardTitle>
                                    <CardDescription>The best time to try to conceive.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-2xl font-bold">{result.fertileWindowStart}</p>
                                    <p className="text-lg">to</p>
                                    <p className="text-2xl font-bold">{result.fertileWindowEnd}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Dates</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="p-4 bg-muted rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">Estimated Ovulation Day</p>
                                        <p className="font-bold text-lg text-accent">{result.ovulationDate}</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">Estimated Next Period</p>
                                        <p className="font-bold text-lg">{result.nextPeriodDate}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default OvulationCalculator;


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { intervalToDuration, format, isValid } from 'date-fns';

const DateCalculator = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    const [result, setResult] = useState<{ years: number, months: number, days: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateDifference = () => {
        if (startDate && endDate) {
            if (endDate < startDate) {
                alert("End date cannot be earlier than the start date.");
                setResult(null);
                return;
            }
            const duration = intervalToDuration({ start: startDate, end: endDate });
            setResult({
                years: duration.years || 0,
                months: duration.months || 0,
                days: duration.days || 0,
            });
        }
    };
    
    if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full max-w-2xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Date Calculator</CardTitle>
                <CardDescription>Calculate the duration between two dates.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 flex flex-col items-center">
                        <Label>Start Date</Label>
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            className="rounded-md border"
                            initialFocus
                        />
                         <p className="text-sm text-muted-foreground">{startDate && isValid(startDate) ? format(startDate, 'PPP') : 'Invalid date'}</p>
                    </div>
                     <div className="space-y-2 flex flex-col items-center">
                        <Label>End Date</Label>
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            className="rounded-md border"
                        />
                         <p className="text-sm text-muted-foreground">{endDate && isValid(endDate) ? format(endDate, 'PPP') : 'Invalid date'}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <Button onClick={calculateDifference} className="w-full">Calculate Difference</Button>
                </div>
                
                {result && (
                    <div className="mt-6 text-center bg-secondary/50 p-6 rounded-lg">
                        <Label className="text-lg text-muted-foreground">Duration</Label>
                        <div className="flex justify-center items-baseline space-x-4 mt-2">
                             <div>
                                <p className="text-4xl font-bold text-primary">{result.years}</p>
                                <p className="text-sm text-muted-foreground">Years</p>
                            </div>
                             <div>
                                <p className="text-4xl font-bold text-primary">{result.months}</p>
                                <p className="text-sm text-muted-foreground">Months</p>
                            </div>
                             <div>
                                <p className="text-4xl font-bold text-primary">{result.days}</p>
                                <p className="text-sm text-muted-foreground">Days</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DateCalculator;

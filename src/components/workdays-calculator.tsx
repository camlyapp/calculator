
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { differenceInBusinessDays, format, isValid } from 'date-fns';

const WorkdaysCalculator = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        const today = new Date();
        setStartDate(today);
        setEndDate(new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()));
    }, []);

    const calculateDifference = () => {
        if (startDate && endDate) {
            if (endDate < startDate) {
                alert("End date cannot be earlier than the start date.");
                setResult(null);
                return;
            }
            const businessDays = differenceInBusinessDays(endDate, startDate);
            setResult(businessDays);
        }
    };
    
    return (
        <Card className="w-full max-w-2xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Workdays Calculator</CardTitle>
                <CardDescription>Calculate the number of business days (Mon-Fri) between two dates.</CardDescription>
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
                        />
                        <p className="text-sm text-muted-foreground">{startDate && isValid(startDate) ? format(startDate, 'PPP') : 'Loading...'}</p>
                    </div>
                     <div className="space-y-2 flex flex-col items-center">
                        <Label>End Date</Label>
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            className="rounded-md border"
                        />
                         <p className="text-sm text-muted-foreground">{endDate && isValid(endDate) ? format(endDate, 'PPP') : 'Loading...'}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <Button onClick={calculateDifference} className="w-full">Calculate Workdays</Button>
                </div>
                
                {result !== null && (
                    <div className="mt-6 text-center bg-secondary/50 p-6 rounded-lg">
                        <Label className="text-lg text-muted-foreground">Total Workdays</Label>
                        <p className="text-4xl font-bold text-primary">{result}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WorkdaysCalculator;

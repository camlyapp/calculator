
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { differenceInBusinessDays, format, isValid } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const WorkdaysCalculator = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    const [result, setResult] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            calculateDifference();
        }
    }, [startDate, endDate, isMounted])

    const calculateDifference = () => {
        if (startDate && endDate) {
            if (endDate < startDate) {
                // Silently handle, or maybe a toast in a real app
                setResult(null);
                return;
            }
            const businessDays = differenceInBusinessDays(endDate, startDate);
            setResult(businessDays);
        }
    };
    
    if (!isMounted) {
        return null;
    }

    const DatePicker = ({date, setDate}: {date?: Date, setDate: (d?: Date) => void}) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear() + 100}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );

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
                        <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                     <div className="space-y-2 flex flex-col items-center">
                        <Label>End Date</Label>
                        <DatePicker date={endDate} setDate={setEndDate} />
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

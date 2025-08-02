
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { add, sub, format, parse } from 'date-fns';
import { Calendar } from './ui/calendar';

type DateManipulationTabProps = {
  mode: 'time' | 'date';
};

const DateManipulationTab = ({ mode }: DateManipulationTabProps) => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState('10:00:00');
    const [days, setDays] = useState('0');
    const [hours, setHours] = useState(mode === 'time' ? '2' : '0');
    const [minutes, setMinutes] = useState(mode === 'time' ? '30' : '0');
    const [seconds, setSeconds] = useState('0');
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculate = () => {
        setError('');
        
        try {
            let baseDate: Date;
            if (mode === 'time') {
                baseDate = parse(startTime, 'HH:mm:ss', new Date());
            } else {
                if (!startDate) throw new Error("Please select a start date.");
                baseDate = startDate;
            }

            if (isNaN(baseDate.getTime())) {
                throw new Error("Invalid start date or time format.");
            }

            const duration = {
                days: parseInt(days) || 0,
                hours: parseInt(hours) || 0,
                minutes: parseInt(minutes) || 0,
                seconds: parseInt(seconds) || 0,
            };

            let newDate;
            if (operation === 'add') {
                newDate = add(baseDate, duration);
            } else {
                newDate = sub(baseDate, duration);
            }

            setResult(format(newDate, 'PPP HH:mm:ss'));

        } catch (e: any) {
             setError(e.message || 'Invalid input. Please check your values.');
             setResult('');
        }
    };
    
    if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full max-w-2xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">{mode === 'date' ? 'Add or Subtract Days' : 'Time Calculator'}</CardTitle>
                <CardDescription>
                    {mode === 'date' 
                        ? 'Calculate a future or past date by adding or subtracting days.'
                        : 'Add or subtract a duration to a given time.'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                     <div className="space-y-2">
                        {mode === 'time' ? (
                            <>
                                <Label htmlFor="start-time">Start Time (HH:MM:SS)</Label>
                                <Input 
                                    id="start-time" 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)}
                                    placeholder="e.g., 10:00:00"
                                />
                            </>
                        ) : (
                             <div className="flex flex-col items-center">
                                <Label>Start Date</Label>
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    className="rounded-md border"
                                />
                             </div>
                        )}
                    </div>
                    
                    <div>
                        <Label>Operation</Label>
                        <RadioGroup 
                            value={operation} 
                            onValueChange={(value) => setOperation(value as 'add' | 'subtract')} 
                            className="flex space-x-4 pt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="add" id="add-op" />
                                <Label htmlFor="add-op" className="font-normal">Add</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="subtract" id="sub-op" />
                                <Label htmlFor="sub-op" className="font-normal">Subtract</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="days">Days</Label>
                            <Input id="days" value={days} onChange={e => setDays(e.target.value)} type="number" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="hours">Hours</Label>
                            <Input id="hours" value={hours} onChange={e => setHours(e.target.value)} type="number" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="minutes">Minutes</Label>
                            <Input id="minutes" value={minutes} onChange={e => setMinutes(e.target.value)} type="number" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="seconds">Seconds</Label>
                            <Input id="seconds" value={seconds} onChange={e => setSeconds(e.target.value)} type="number" />
                        </div>
                    </div>

                    <Button onClick={calculate} className="w-full">Calculate Time</Button>

                    {error && <p className="text-center text-destructive">{error}</p>}

                    {result && (
                        <div className="mt-6 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Resulting Date and Time</Label>
                            <p className="text-2xl font-bold text-primary">{result}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DateManipulationTab;

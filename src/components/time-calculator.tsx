
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { add, sub, format, parse } from 'date-fns';

const TimeCalculator = () => {
    const [startTime, setStartTime] = useState('10:00:00');
    const [days, setDays] = useState('0');
    const [hours, setHours] = useState('2');
    const [minutes, setMinutes] = useState('30');
    const [seconds, setSeconds] = useState('0');
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const calculate = () => {
        setError('');
        
        try {
            const baseDate = new Date();
            const parsedTime = parse(startTime, 'HH:mm:ss', baseDate);

            if (isNaN(parsedTime.getTime())) {
                throw new Error("Invalid time format.");
            }

            const duration = {
                days: parseInt(days) || 0,
                hours: parseInt(hours) || 0,
                minutes: parseInt(minutes) || 0,
                seconds: parseInt(seconds) || 0,
            };

            let newDate;
            if (operation === 'add') {
                newDate = add(parsedTime, duration);
            } else {
                newDate = sub(parsedTime, duration);
            }

            setResult(format(newDate, 'PPP HH:mm:ss'));

        } catch (e: any) {
             setError(e.message || 'Invalid input. Please check your values.');
             setResult('');
        }
    };
    
    return (
        <Card className="w-full max-w-2xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Time Calculator</CardTitle>
                <CardDescription>Add or subtract a duration to a given time.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time (HH:MM:SS)</Label>
                        <Input 
                            id="start-time" 
                            value={startTime} 
                            onChange={(e) => setStartTime(e.target.value)}
                            placeholder="e.g., 10:00:00"
                        />
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

export default TimeCalculator;

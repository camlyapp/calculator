
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { add, sub, format, parse } from 'date-fns';
import { Calendar } from './ui/calendar';
import AnalogClock from './analog-clock';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Clock } from 'lucide-react';
import TimePicker from './time-picker';

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

    const [clockTime, setClockTime] = useState({ hours: 10, minutes: 0, seconds: 0 });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (mode === 'time') {
            const [h, m, s] = startTime.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                setClockTime({ hours: h, minutes: m, seconds: s });
            }
        }
    }, [startTime, mode]);

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

            if (mode === 'time') {
                const newTime = format(newDate, 'HH:mm:ss');
                setResult(newTime);
                const [h, m, s] = newTime.split(':').map(Number);
                setClockTime({ hours: h, minutes: m, seconds: s });
            } else {
                 setResult(format(newDate, 'PPP'));
            }

        } catch (e: any) {
             setError(e.message || 'Invalid input. Please check your values.');
             setResult('');
        }
    };
    
    if (!isMounted) {
        return null;
    }

    const handleTimeChange = (newTime: { hour: number; minute: number; second: number }) => {
        const { hour, minute, second } = newTime;
        const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        setStartTime(formattedTime);
    }

    return (
        <Card className="w-full max-w-4xl shadow-2xl mt-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            {mode === 'time' ? (
                                <>
                                    <Label>Start Time</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {startTime}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <TimePicker
                                                initialTime={startTime}
                                                onTimeChange={handleTimeChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
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

                        <Button onClick={calculate} className="w-full">Calculate</Button>
                    </div>

                     <div className="flex flex-col items-center justify-center space-y-4">
                        {mode === 'time' && <AnalogClock {...clockTime} />}
                        
                        {error && <p className="text-center text-destructive">{error}</p>}

                        {result && (
                            <div className="text-center bg-secondary/50 p-6 rounded-lg w-full">
                                <Label className="text-lg text-muted-foreground">Result</Label>
                                <p className="text-2xl font-bold text-primary">{result}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DateManipulationTab;

    
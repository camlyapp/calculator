
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { intervalToDuration, isFuture } from 'date-fns';

const CountdownCalculator = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [targetDate, setTargetDate] = useState<Date | undefined>(tomorrow);
    const [targetTime, setTargetTime] = useState('09:00:00');
    const [countdown, setCountdown] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            const now = new Date();
            const fullTargetDate = getFullTargetDate();

            if (fullTargetDate && isFuture(fullTargetDate)) {
                const duration = intervalToDuration({ start: now, end: fullTargetDate });
                setCountdown({
                    days: duration.days || 0,
                    hours: duration.hours || 0,
                    minutes: duration.minutes || 0,
                    seconds: duration.seconds || 0,
                });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsRunning(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, targetDate, targetTime]);
    
    const getFullTargetDate = () => {
         if (!targetDate) return null;
        
        const [hours, minutes, seconds] = targetTime.split(':').map(Number);
        const fullDate = new Date(targetDate);
        fullDate.setHours(hours, minutes, seconds);
        return fullDate;
    };

    const handleStartStop = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            const fullTargetDate = getFullTargetDate();
            if (fullTargetDate && isFuture(fullTargetDate)) {
                 setIsRunning(true);
            } else {
                alert("Please select a future date and time to start the countdown.");
            }
        }
    };
    
     if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full max-w-2xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Countdown Calculator</CardTitle>
                <CardDescription>Set a future date and time to start a live countdown.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2 flex flex-col items-center">
                            <Label>Target Date</Label>
                            <Calendar
                                mode="single"
                                selected={targetDate}
                                onSelect={setTargetDate}
                                className="rounded-md border"
                                disabled={isRunning}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="target-time">Target Time (HH:MM:SS)</Label>
                            <Input 
                                id="target-time" 
                                value={targetTime} 
                                onChange={(e) => setTargetTime(e.target.value)}
                                placeholder="e.g., 09:00:00"
                                disabled={isRunning}
                            />
                        </div>
                    </div>

                    <Button onClick={handleStartStop} className="w-full">
                        {isRunning ? 'Stop Countdown' : 'Start Countdown'}
                    </Button>

                    {(countdown || isRunning) && (
                        <div className="mt-6 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Time Remaining</Label>
                            <div className="flex justify-center items-baseline space-x-2 sm:space-x-4 mt-2">
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary">{countdown?.days ?? '0'}</p>
                                    <p className="text-sm text-muted-foreground">Days</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary">{countdown?.hours ?? '0'}</p>
                                    <p className="text-sm text-muted-foreground">Hours</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary">{countdown?.minutes ?? '0'}</p>
                                    <p className="text-sm text-muted-foreground">Minutes</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary">{countdown?.seconds ?? '0'}</p>
                                    <p className="text-sm text-muted-foreground">Seconds</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CountdownCalculator;

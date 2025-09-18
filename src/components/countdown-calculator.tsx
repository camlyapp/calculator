
"use client";

import { useState, useEffect, useRef } from 'react';
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
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // Clean up timer on component unmount
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const getFullTargetDate = () => {
         if (!targetDate) return null;
        
        const [hours, minutes, seconds] = targetTime.split(':').map(Number);
        const fullDate = new Date(targetDate);
        fullDate.setHours(hours, minutes, seconds);
        return fullDate;
    };
    
    const updateCountdown = () => {
        const fullTargetDate = getFullTargetDate();

        if (fullTargetDate && isFuture(fullTargetDate)) {
            const now = new Date();
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
             if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }
    }

    useEffect(() => {
        if (isRunning) {
            updateCountdown(); // Initial update
            timerRef.current = setInterval(updateCountdown, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning]);

    const handleStartStop = async () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            const fullTargetDate = getFullTargetDate();
            if (fullTargetDate && isFuture(fullTargetDate)) {
                 if ('Notification' in window && Notification.permission === 'default') {
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted') {
                        alert('Notification permission was not granted. You will not be notified when the countdown ends.');
                    }
                }
                setIsRunning(true);
                
                const timeRemaining = fullTargetDate.getTime() - new Date().getTime();
                if (timeRemaining > 0) {
                     // Notification on completion
                     setTimeout(() => {
                         if (Notification.permission === 'granted') {
                             new Notification('Countdown Finished!', {
                                body: `Your countdown set for ${fullTargetDate.toLocaleString()} has ended.`,
                                icon: '/camly.png'
                             });
                         }
                         setIsRunning(false);
                     }, timeRemaining);
                }
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
                <CardDescription>Set a future date and time to start a live countdown. You will be notified when it ends.</CardDescription>
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
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 100}
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

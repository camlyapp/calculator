
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { isFuture, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import TimePicker from './time-picker';
import { Clock } from 'lucide-react';

const CountdownCalculator = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [targetDate, setTargetDate] = useState<Date | undefined>(tomorrow);
    const [targetTime, setTargetTime] = useState('09:00:00');
    const [countdown, setCountdown] = useState<{ days: number, hours: number, minutes: number, seconds: number, milliseconds: number } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef<number | null>(null);

    const { toast } = useToast();

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);
        // Clean up timer on component unmount
        return () => {
            if (timerRef.current) cancelAnimationFrame(timerRef.current);
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
            const now = new Date().getTime();
            const target = fullTargetDate.getTime();
            let difference = target - now;

            if (difference > 0) {
                 const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                 difference -= days * (1000 * 60 * 60 * 24);
                 const hours = Math.floor(difference / (1000 * 60 * 60));
                 difference -= hours * (1000 * 60 * 60);
                 const minutes = Math.floor(difference / (1000 * 60));
                 difference -= minutes * (1000 * 60);
                 const seconds = Math.floor(difference / 1000);
                 const milliseconds = difference % 1000;
                
                setCountdown({ days, hours, minutes, seconds, milliseconds });

                timerRef.current = requestAnimationFrame(updateCountdown);

            } else {
                 setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
                 setIsRunning(false);
            }
        } else {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
            setIsRunning(false);
        }
    }


    const handleStartStop = async () => {
        if (isRunning) {
            setIsRunning(false);
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = null;
            }
        } else {
            const fullTargetDate = getFullTargetDate();
            if (fullTargetDate && isFuture(fullTargetDate)) {
                 if ('Notification' in window && Notification.permission === 'default') {
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted') {
                        toast({
                            variant: 'destructive',
                            title: 'Permission Denied',
                            description: 'You will not be notified when the countdown ends.',
                        });
                    }
                }
                setIsRunning(true);
                
                const timeRemaining = fullTargetDate.getTime() - new Date().getTime();
                if (timeRemaining > 0) {
                     setTimeout(() => {
                         if (Notification.permission === 'granted') {
                             new Notification('Countdown Finished!', {
                                body: `Your countdown for ${fullTargetDate.toLocaleString()} has ended.`,
                                icon: '/camly.png'
                             });
                         }
                         setIsRunning(false);
                     }, timeRemaining);
                }
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Invalid Date',
                    description: "Please select a future date and time to start the countdown.",
                });
            }
        }
    };
    
    useEffect(() => {
        if (isRunning) {
            timerRef.current = requestAnimationFrame(updateCountdown);
        } else {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
            }
        };
    }, [isRunning]);
    
     if (!isMounted) {
        return null;
    }
    
     const handleTimeChange = (newTime: { hour: number; minute: number; second: number }) => {
        const { hour, minute, second } = newTime;
        const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        setTargetTime(formattedTime);
    }

    return (
        <Card className="w-full max-w-4xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Countdown Calculator</CardTitle>
                <CardDescription>Set a future date and time to start a live countdown. You will be notified when it ends.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-2 flex flex-col items-center">
                            <Label>Target Date</Label>
                            <Calendar
                                mode="single"
                                selected={targetDate}
                                onSelect={setTargetDate}
                                className="rounded-md border"
                                disabled={isRunning}
                                captionLayout="dropdown-buttons"
                                fromDate={new Date()}
                                toYear={new Date().getFullYear() + 100}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="target-time">Target Time</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isRunning}>
                                            <Clock className="mr-2 h-4 w-4" />
                                            {targetTime}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <TimePicker
                                            initialTime={targetTime}
                                            onTimeChange={handleTimeChange}
                                        />
                                    </PopoverContent>
                                </Popover>
                        </div>
                    </div>

                    <Button onClick={handleStartStop} className="w-full">
                        {isRunning ? 'Stop Countdown' : 'Start Countdown'}
                    </Button>

                    {(countdown || isRunning) && (
                        <div className="mt-6 text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Time Remaining</Label>
                            <div className="flex flex-wrap justify-center items-baseline space-x-2 sm:space-x-4 mt-2">
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary tabular-nums">{countdown?.days ?? '0'}</p>
                                    <p className="text-sm text-muted-foreground">Days</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary tabular-nums">{String(countdown?.hours ?? 0).padStart(2, '0')}</p>
                                    <p className="text-sm text-muted-foreground">Hours</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary tabular-nums">{String(countdown?.minutes ?? 0).padStart(2, '0')}</p>
                                    <p className="text-sm text-muted-foreground">Minutes</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary tabular-nums">{String(countdown?.seconds ?? 0).padStart(2, '0')}</p>
                                    <p className="text-sm text-muted-foreground">Seconds</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-4xl font-bold text-primary tabular-nums">{String(countdown?.milliseconds ?? 0).padStart(3, '0')}</p>
                                    <p className="text-sm text-muted-foreground">Milliseconds</p>
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

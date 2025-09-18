
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { isFuture, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import TimePicker from './time-picker';
import { Clock } from 'lucide-react';
import SandboxAnimation from './sandbox-animation';

const CountdownCalculator = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [targetDate, setTargetDate] = useState<Date | undefined>(tomorrow);
    const [targetTime, setTargetTime] = useState('00:00:00');
    const [countdown, setCountdown] = useState<{ days: number, hours: number, minutes: number, seconds: number, milliseconds: number } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [countdownProgress, setCountdownProgress] = useState(100);
    const [totalCountdownDuration, setTotalCountdownDuration] = useState(0);

    const { toast } = useToast();

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);
        const now = new Date();
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        setTargetTime(formattedTime);
        // Clean up timer on component unmount
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
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

                if (totalCountdownDuration > 0) {
                    const remainingTime = (target - now);
                    setCountdownProgress((remainingTime / totalCountdownDuration) * 100);
                }

            } else {
                 setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
                 setIsRunning(false);
                 setCountdownProgress(0);
                 if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                 }
            }
        } else {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
            setIsRunning(false);
            setCountdownProgress(0);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
             }
        }
    }

    const playBeep = () => {
        if (typeof window !== 'undefined' && window.AudioContext) {
            const audioContext = new window.AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 60);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 60);
        }
    };


    const handleStartStop = async () => {
        if (isRunning) {
            setIsRunning(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
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
                const now = new Date().getTime();
                const totalDuration = fullTargetDate.getTime() - now;
                setTotalCountdownDuration(totalDuration);
                setCountdownProgress(100);
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
                         playBeep();
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
            timerRef.current = setInterval(updateCountdown, 100); // Update every 100ms
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
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !targetDate && "text-muted-foreground"
                                        )}
                                         disabled={isRunning}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={targetDate}
                                        onSelect={setTargetDate}
                                        initialFocus
                                        disabled={isRunning}
                                    />
                                </PopoverContent>
                            </Popover>
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
                        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-8 bg-secondary/50 p-6 rounded-lg">
                           <SandboxAnimation percentage={countdownProgress} />
                            <div className="text-center">
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
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CountdownCalculator;

    

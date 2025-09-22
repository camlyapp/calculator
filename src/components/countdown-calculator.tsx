
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { isFuture, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Mic, MicOff, Volume, Volume1, Volume2, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import TimePicker from './time-picker';
import { Clock } from 'lucide-react';
import SandboxAnimation from './sandbox-animation';
import { Switch } from './ui/switch';

const CountdownCalculator = () => {
    const [targetDate, setTargetDate] = useState<Date | undefined>(new Date());
    const [targetTime, setTargetTime] = useState('00:00:00');
    const [countdown, setCountdown] = useState<{ days: number, hours: number, minutes: number, seconds: number, milliseconds: number } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const alarmRef = useRef<NodeJS.Timeout | null>(null);


    const [countdownProgress, setCountdownProgress] = useState(100);
    const [totalCountdownDuration, setTotalCountdownDuration] = useState(0);

    const { toast } = useToast();

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    
    const [isSecondSoundOn, setIsSecondSoundOn] = useState(true);
    const [isHourlySoundOn, setIsHourlySoundOn] = useState(false);
    const lastPlayedSecondRef = useRef<number | null>(null);
    const lastPlayedHourRef = useRef<number | null>(null);


    useEffect(() => {
        setIsMounted(true);
        const now = new Date();
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        setTargetTime(formattedTime);
        // Clean up timers on component unmount
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (alarmRef.current) clearInterval(alarmRef.current);
        };
    }, []);

    const getFullTargetDate = () => {
         if (!targetDate) return null;
        
        const [hours, minutes, seconds] = targetTime.split(':').map(Number);
        const fullDate = new Date(targetDate);
        fullDate.setHours(hours, minutes, seconds);
        return fullDate;
    };

    const playBeep = () => {
        if (typeof window !== 'undefined' && window.AudioContext) {
            const audioContext = new window.AudioContext();
            
            const playNote = (frequency: number, duration: number, delay: number) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
                gainNode.gain.setValueAtTime(1, audioContext.currentTime + delay);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration);

                oscillator.start(audioContext.currentTime + delay);
                oscillator.stop(audioContext.currentTime + delay + duration);
            }
            
            playNote(660, 0.15, 0); 
            playNote(660, 0.15, 0.2);
            playNote(660, 0.15, 0.4);
            playNote(880, 0.3, 0.6);
        }
    };

    const playTick = () => {
        if (typeof window !== 'undefined' && window.AudioContext) {
            const audioContext = new window.AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime); // Low frequency for a "tick"
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        }
    };
    
    const playHourlyChime = () => {
        if (typeof window !== 'undefined' && window.AudioContext) {
            const audioContext = new window.AudioContext();
            const playNote = (frequency: number, startTime: number, duration: number) => {
                 const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
                gainNode.gain.setValueAtTime(0.8, audioContext.currentTime + startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);
                oscillator.start(audioContext.currentTime + startTime);
                oscillator.stop(audioContext.currentTime + startTime + duration);
            }
            playNote(523.25, 0, 0.4); // C5
            playNote(783.99, 0.5, 0.4); // G5
        }
    }

    
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
                
                if (isSecondSoundOn && lastPlayedSecondRef.current !== seconds) {
                    playTick();
                    lastPlayedSecondRef.current = seconds;
                }
                
                if (isHourlySoundOn && lastPlayedHourRef.current !== hours && minutes === 59 && seconds === 59) {
                     playHourlyChime();
                     lastPlayedHourRef.current = hours;
                }

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
                 if (!alarmRef.current) {
                    playBeep(); // Play once immediately
                    alarmRef.current = setInterval(playBeep, 2000); // And then every 2 seconds
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


    const handleStartStop = async () => {
        if (isRunning) {
            setIsRunning(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (alarmRef.current) {
                clearInterval(alarmRef.current);
                alarmRef.current = null;
            }
        } else {
             if (alarmRef.current) {
                clearInterval(alarmRef.current);
                alarmRef.current = null;
            }
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

                const currentCountdown = {
                    days: Math.floor(totalDuration / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((totalDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((totalDuration % (1000 * 60)) / 1000),
                    milliseconds: totalDuration % 1000,
                };
                lastPlayedSecondRef.current = currentCountdown.seconds;
                lastPlayedHourRef.current = currentCountdown.hours;

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
    }, [isRunning, isSecondSoundOn, isHourlySoundOn]);
    
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="flex items-center space-x-2">
                             <Switch id="second-sound" checked={isSecondSoundOn} onCheckedChange={setIsSecondSoundOn} disabled={!isRunning}/>
                             <Label htmlFor="second-sound" className="flex items-center gap-2">
                                <Volume1 className="h-5 w-5" /> Second Tick Sound
                            </Label>
                        </div>
                         <div className="flex items-center space-x-2">
                             <Switch id="hourly-sound" checked={isHourlySoundOn} onCheckedChange={setIsHourlySoundOn} disabled={!isRunning}/>
                             <Label htmlFor="hourly-sound" className="flex items-center gap-2">
                                <Volume2 className="h-5 w-5" /> Hourly Chime
                            </Label>
                        </div>
                    </div>

                    <Button onClick={handleStartStop} className="w-full">
                        {isRunning ? 'Stop Countdown' : 'Start Countdown'}
                    </Button>

                    {(countdown || isRunning) && (
                        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-8 bg-secondary/50 p-6 rounded-lg">
                           <div className="flex items-center justify-center gap-4">
                                <SandboxAnimation percentage={countdownProgress} />
                                <div className="flex items-center text-primary">
                                    <span className="text-3xl font-bold tabular-nums">{countdownProgress.toFixed(1)}</span>
                                    <Percent className="h-6 w-6" />
                                </div>
                            </div>
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

    

    
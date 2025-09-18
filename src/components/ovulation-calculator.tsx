
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addDays, subDays, format, isValid, eachDayOfInterval, getMonth, getYear } from 'date-fns';
import { Button } from './ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface CyclePrediction {
    ovulationDate: Date;
    fertileWindowStart: Date;
    fertileWindowEnd: Date;
    nextPeriodDate: Date;
}

const OvulationCalculator = () => {
    const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(new Date());
    const [cycleLength, setCycleLength] = useState('28');
    const [lutealPhaseLength, setLutealPhaseLength] = useState('14');
    const [predictions, setPredictions] = useState<CyclePrediction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    useEffect(() => {
        if (lastPeriodDate) {
            setCurrentMonth(lastPeriodDate);
        }
    }, [lastPeriodDate])

    const calculateOvulation = () => {
        if (!lastPeriodDate || !isValid(lastPeriodDate)) {
            setPredictions([]);
            return;
        }

        const cycleLen = parseInt(cycleLength);
        const lutealLen = parseInt(lutealPhaseLength);
        if (isNaN(cycleLen) || isNaN(lutealLen) || cycleLen < 21 || cycleLen > 45 || lutealLen < 10 || lutealLen > 18) {
            setPredictions([]);
            return;
        }
        
        const newPredictions: CyclePrediction[] = [];
        let currentLmp = lastPeriodDate;

        for (let i = 0; i < 6; i++) { // Calculate for next 6 cycles
            const nextPeriod = addDays(currentLmp, cycleLen);
            const ovulationDay = subDays(nextPeriod, lutealLen);
            
            newPredictions.push({
                ovulationDate: ovulationDay,
                fertileWindowStart: subDays(ovulationDay, 5),
                fertileWindowEnd: ovulationDay,
                nextPeriodDate: nextPeriod,
            });
            currentLmp = nextPeriod;
        }
        setPredictions(newPredictions);
    };

    const useMemoResult = useMemo(() => {
        const fertile: Date[] = [];
        const ovulation: Date[] = [];
        const period: Date[] = [];

        predictions.forEach(p => {
            fertile.push(...eachDayOfInterval({ start: p.fertileWindowStart, end: p.fertileWindowEnd }));
            ovulation.push(p.ovulationDate);
            // Assuming period lasts 5 days for visualization
            period.push(...eachDayOfInterval({ start: p.nextPeriodDate, end: addDays(p.nextPeriodDate, 4)}));
        });
        return { fertileDays: fertile, ovulationDays: ovulation, periodDays: period };
    }, [predictions]);

    const { fertileDays, ovulationDays, periodDays } = useMemoResult;
    
    useEffect(() => {
        if (isMounted) {
            calculateOvulation();
        }
    }, [lastPeriodDate, cycleLength, lutealPhaseLength, isMounted]);

    if (!isMounted) {
        return null;
    }

    const changeMonth = (amount: number) => {
        setCurrentMonth(prev => addDays(prev, amount * 30)); // Approximate month change
    }

    const currentPrediction = predictions.find(p => getMonth(p.ovulationDate) === getMonth(currentMonth) && getYear(p.ovulationDate) === getYear(currentMonth)) || predictions[0];
    
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
                    month={date}
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear() - 1}
                    toYear={new Date().getFullYear() + 1}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Advanced Ovulation & Fertile Window Calculator</CardTitle>
                <CardDescription>
                    Pinpoint your most fertile days by providing your cycle details. Projections are shown for the next 6 cycles.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className='flex-1 space-y-6 w-full md:w-auto md:max-w-sm'>
                        <div className="space-y-2">
                            <Label>First Day of Your Last Period</Label>
                            <DatePicker date={lastPeriodDate} setDate={setLastPeriodDate} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cycle-length">Average Cycle Length (Days)</Label>
                            <Input
                                id="cycle-length"
                                value={cycleLength}
                                onChange={e => setCycleLength(e.target.value)}
                                type="number"
                                placeholder="21-45 days"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="luteal-phase">Luteal Phase Length (Days)</Label>
                            <Input
                                id="luteal-phase"
                                value={lutealPhaseLength}
                                onChange={e => setLutealPhaseLength(e.target.value)}
                                type="number"
                                placeholder="Usually 14 days"
                            />
                            <p className="text-xs text-muted-foreground">The time from ovulation to your next period. If unsure, leave as 14.</p>
                        </div>
                        <Button onClick={calculateOvulation} className="w-full">Recalculate</Button>
                    </div>
                    
                    <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t w-full space-y-6">
                        {predictions.length > 0 && currentPrediction ? (
                            <>
                                <Card>
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-primary">Key Dates for This Cycle</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">Fertile Window</p>
                                            <p className="font-bold text-sm">{format(currentPrediction.fertileWindowStart, 'MMM d')} - {format(currentPrediction.fertileWindowEnd, 'MMM d')}</p>
                                        </div>
                                         <div className="p-2 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">Est. Ovulation</p>
                                            <p className="font-bold text-accent text-sm">{format(currentPrediction.ovulationDate, 'PPP')}</p>
                                        </div>
                                        <div className="p-2 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">Next Period</p>
                                            <p className="font-bold text-sm">{format(currentPrediction.nextPeriodDate, 'PPP')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <div className="p-4 border rounded-lg">
                                     <div className="flex justify-center items-center mb-4">
                                        <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
                                            <ChevronLeft />
                                        </Button>
                                        <h3 className="text-lg font-semibold w-48 text-center">
                                            {format(currentMonth, 'MMMM yyyy')}
                                        </h3>
                                        <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
                                            <ChevronRight />
                                        </Button>
                                    </div>
                                    <Calendar
                                        month={currentMonth}
                                        onMonthChange={setCurrentMonth}
                                        modifiers={{ 
                                            fertile: fertileDays, 
                                            ovulation: ovulationDays,
                                            period: periodDays,
                                        }}
                                        modifiersClassNames={{
                                            fertile: 'bg-green-100 dark:bg-green-900/50 rounded-full',
                                            ovulation: 'bg-accent text-accent-foreground rounded-full font-bold',
                                            period: 'bg-red-100 dark:bg-red-900/50 rounded-none'
                                        }}
                                        className="rounded-md mx-auto"
                                    />
                                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/50 rounded-full"/>
                                            <span>Fertile Window</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-accent rounded-full"/>
                                            <span>Ovulation Day</span>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/50"/>
                                            <span>Period</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                             <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Please provide valid inputs to see your results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OvulationCalculator;

    
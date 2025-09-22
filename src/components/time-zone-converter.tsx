
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { timeZones } from '@/lib/timezones';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PlusCircle, Trash2, X, Sun, Moon, GripVertical } from 'lucide-react';
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import AnalogClock from './analog-clock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { format, isValid } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import TimePicker from './time-picker';
import AnalogClockModern from './analog-clock-modern';
import AnalogClockMinimalist from './analog-clock-minimalist';
import { timezoneInfo } from '@/lib/timezone-info';
import Flag from 'react-world-flags';
import TimeZoneSearch from './timezone-search';


const clockComponents = [AnalogClock, AnalogClockModern, AnalogClockMinimalist];

const clockColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--accent))',
];

// Function to get time zone details
export const getTimeZoneDetails = (date: Date, timeZone: string) => {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZoneName: 'shortOffset',
        });
        const parts = formatter.formatToParts(date);
        
        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
        const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');
        const offset = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT';

        // Check for DST by comparing standard and DST offsets.
        // This is a heuristic: get the offsets in January and June and see if they differ.
        const janDate = new Date(date.getFullYear(), 0, 1);
        const julDate = new Date(date.getFullYear(), 6, 1);
        
        const janFormatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' });
        const julFormatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' });
        
        const janOffsetPart = janFormatter.formatToParts(janDate).find(p=>p.type==='timeZoneName');
        const julOffsetPart = julFormatter.formatToParts(julDate).find(p=>p.type==='timeZoneName');

        // It's DST if the offsets are different and the current offset matches the "summer" offset.
        const isDst = (janOffsetPart?.value !== julOffsetPart?.value) && (offset === julOffsetPart?.value);


        return { h: hour, m: minute, s: second, offset, isDst };
    } catch(e) {
        console.error(`Failed to get details for timezone: ${timeZone}`, e);
        return { h: 0, m: 0, s: 0, offset: 'N/A', isDst: false };
    }
}


const WorldClock = () => {
    const [localTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
        localTimeZone,
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
    ]);
    const [timeOffset, setTimeOffset] = useState(0); // Offset in hours from current time
    const [now, setNow] = useState(new Date());
    const [isMounted, setIsMounted] = useState(false);
    const [draggedTz, setDraggedTz] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const addTimezone = (timezone: string) => {
        if (!selectedTimezones.includes(timezone)) {
            setSelectedTimezones([...selectedTimezones, timezone]);
        }
    };

    const removeTimezone = (timezone: string) => {
        if (timezone === localTimeZone) return; // Prevent removing local time
        setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
    };

    const displayTime = new Date(now.getTime() + timeOffset * 60 * 60 * 1000);

    const formatTime = (date: Date, timeZone: string) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }).format(date);
        } catch (e) {
            return 'Invalid TZ';
        }
    };
    
    const formatDate = (date: Date, timeZone: string) => {
         try {
            return new Intl.DateTimeFormat('en-US', {
                timeZone,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            }).format(date);
        } catch (e) {
            return 'N/A';
        }
    }
    
    const getDayIndicator = (date: Date, timeZone: string): string => {
        try {
            const localDate = new Date(date.toLocaleString('en-US', { timeZone: localTimeZone }));
            const targetDate = new Date(date.toLocaleString('en-US', { timeZone }));

            const localDay = localDate.getDate();
            const targetDay = targetDate.getDate();

            if (targetDay > localDay || (targetDay === 1 && localDay > 25)) return 'Next Day';
            if (targetDay < localDay || (localDay === 1 && targetDay > 25)) return 'Prev. Day';
        } catch(e) {
            return '';
        }
        
        return '';
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tz: string) => {
        setDraggedTz(tz);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tz);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); 
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropTz: string) => {
        e.preventDefault();
        if (!draggedTz || draggedTz === dropTz) {
            setDraggedTz(null);
            return;
        }

        const fromIndex = selectedTimezones.indexOf(draggedTz);
        const toIndex = selectedTimezones.indexOf(dropTz);

        const items = [...selectedTimezones];
        const [reorderedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, reorderedItem);

        setSelectedTimezones(items);
        setDraggedTz(null);
    };


    if (!isMounted) {
        return null;
    }

    return (
        <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
                <Label htmlFor="time-slider">Meeting Planner / Time Scrubber</Label>
                <Slider
                    id="time-slider"
                    min={-12}
                    max={12}
                    step={0.5}
                    value={[timeOffset]}
                    onValueChange={(value) => setTimeOffset(value[0])}
                />
                 <p className="text-center text-sm text-muted-foreground">
                    {timeOffset === 0 ? "Current Time" : `${Math.abs(timeOffset)} hours ${timeOffset > 0 ? 'from now' : 'ago'}`}
                </p>
            </div>

            <div className="space-y-4">
                {selectedTimezones.map((tz, index) => {
                    const { h, m, s, offset, isDst } = getTimeZoneDetails(displayTime, tz);
                    const countryInfo = timezoneInfo[tz];
                    const countryName = countryInfo ? countryInfo.countryName : '';
                    const color = clockColors[index % clockColors.length];
                    const isDragging = draggedTz === tz;
                    const ClockComponent1 = clockComponents[0];
                    const ClockComponent2 = clockComponents[1];
                    const ClockComponent3 = clockComponents[2];

                    return (
                        <div
                            key={tz}
                            draggable={tz !== localTimeZone}
                            onDragStart={(e) => handleDragStart(e, tz)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, tz)}
                            onDragEnd={() => setDraggedTz(null)}
                            className={cn(
                                'flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-secondary/50 transition-opacity',
                                tz !== localTimeZone && 'cursor-grab',
                                isDragging && 'opacity-50'
                            )}
                        >
                             <div className={cn("flex items-center", tz === localTimeZone && "invisible")}>
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <ClockComponent1
                                    hours={h}
                                    minutes={m}
                                    seconds={s}
                                    color={color}
                                    className="w-20 h-20 sm:w-24 sm:h-24"
                                />
                                <ClockComponent2
                                    hours={h}
                                    minutes={m}
                                    seconds={s}
                                    color={color}
                                    className="w-20 h-20 sm:w-24 sm:h-24"
                                    style={{ '--clock-accent-color': color } as React.CSSProperties}
                                />
                                <ClockComponent3
                                    hours={h}
                                    minutes={m}
                                    seconds={s}
                                    color={color}
                                    className="w-20 h-20 sm:w-24 sm:h-24"
                                    style={{ '--clock-accent-color': color } as React.CSSProperties}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{tz.replace(/_/g, ' ')}</p>
                                        <p className="text-sm text-muted-foreground">{countryName}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            {formatDate(displayTime, tz)}
                                        </p>
                                        <div className="text-xs text-muted-foreground h-4 flex items-center gap-1">
                                            <span>{offset}</span>
                                            {isDst && <Sun className="h-3 w-3 text-yellow-500" title="Daylight Saving Time" />}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold tabular-nums">{formatTime(displayTime, tz)}</p>
                                        <p className="text-xs text-muted-foreground h-4">{getDayIndicator(displayTime, tz)}</p>
                                    </div>
                                </div>
                            </div>
                           
                            {tz !== localTimeZone && (
                                <Button variant="ghost" size="icon" onClick={() => removeTimezone(tz)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )
                })}
            </div>

            <TimeZoneSearch 
                onSelectTimezone={addTimezone}
                selectedTimezones={selectedTimezones}
                trigger={
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Timezone
                    </Button>
                }
            />
        </CardContent>
    );
};

const TimeConverter = () => {
    const [sourceDate, setSourceDate] = useState<Date | undefined>(new Date());
    const [sourceTime, setSourceTime] = useState('12:00:00');
    const [sourceTz, setSourceTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [targetTz, setTargetTz] = useState('America/New_York');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { resultTime, resultDate, isResultDst, resultOffset } = useMemo(() => {
        if (!sourceDate || !isValid(sourceDate)) return { resultTime: '...', resultDate: '...', isResultDst: false, resultOffset: '...' };

        const [h, m, s] = sourceTime.split(':').map(Number);
        if (isNaN(h) || isNaN(m) || isNaN(s)) {
            return { resultTime: 'Invalid Time', resultDate: '', isResultDst: false, resultOffset: '' };
        }
        
        // Construct a date object representing the local time in the source timezone
        const year = sourceDate.getFullYear();
        const month = sourceDate.getMonth();
        const day = sourceDate.getDate();

        // Create a temporary date string and then parse it. This is more robust than manual offsets.
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        
        try {
            // A trick to parse a date as if it's in a specific timezone
             const localDate = new Date(dateString);
            const tzDate = new Date(localDate.toLocaleString("en-US", {timeZone: sourceTz}));
            const diff = localDate.getTime() - tzDate.getTime();
            const dateInSourceTz = new Date(localDate.getTime() - diff);
            
             if (!isValid(dateInSourceTz)) {
                // Fallback for when the above method fails (can happen in some environments)
                 const fallbackDate = new Date(sourceDate);
                 fallbackDate.setHours(h, m, s, 0);
                 const dateStr = fallbackDate.toISOString().slice(0, 19).replace('T', ' ');
                 
                 const formatter = new Intl.DateTimeFormat('en-US', { timeZone: sourceTz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
                 const parts = formatter.formatToParts(dateInSourceTz);
                 const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';
                 const isoString = `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}:${getPart('second')}Z`;
                 const finalDate = new Date(isoString);
                 
                 if (!isValid(finalDate)) throw new Error("Could not create a valid date in the source timezone.");

                 const targetFormatter = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                 const resultTime = targetFormatter.format(finalDate);
                 const resultDate = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}).format(finalDate);
                 const { isDst, offset: targetOffset } = getTimeZoneDetails(finalDate, targetTz);
                 return { resultTime, resultDate, isResultDst: isDst, resultOffset: targetOffset };

            }


            const targetFormatter = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const resultTime = targetFormatter.format(dateInSourceTz);
            const resultDate = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}).format(dateInSourceTz);

            const { isDst, offset: targetOffset } = getTimeZoneDetails(dateInSourceTz, targetTz);

            return { resultTime, resultDate, isResultDst: isDst, resultOffset: targetOffset };
        } catch(e) {
            console.error(e);
            return { resultTime: 'Invalid TZ', resultDate: '', isResultDst: false, resultOffset: '' };
        }
    }, [sourceDate, sourceTime, sourceTz, targetTz]);
    
     if (!isMounted) {
        return null;
    }
    
    const handleTimeChange = (newTime: { hour: number; minute: number; second: number }) => {
        const { hour, minute, second } = newTime;
        const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        setSourceTime(formattedTime);
    }
    
    return (
        <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                 <div className="space-y-2">
                    <Label>From Timezone</Label>
                    <TimeZoneSearch
                        onSelectTimezone={setSourceTz}
                        selectedTimezones={[sourceTz]}
                        trigger={
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                {sourceTz.replace(/_/g, ' ')}
                            </Button>
                        }
                    />
                </div>
                 <div className="space-y-2">
                    <Label>To Timezone</Label>
                    <TimeZoneSearch
                        onSelectTimezone={setTargetTz}
                        selectedTimezones={[targetTz]}
                        trigger={
                             <Button variant="outline" className="w-full justify-start text-left font-normal">
                                {targetTz.replace(/_/g, ' ')}
                            </Button>
                        }
                    />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                    <Label>Source Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />{sourceDate ? format(sourceDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={sourceDate} onSelect={setSourceDate} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label>Source Time</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <Clock className="mr-2 h-4 w-4" />{sourceTime}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><TimePicker initialTime={sourceTime} onTimeChange={handleTimeChange} /></PopoverContent>
                    </Popover>
                </div>
             </div>
             <div className="text-center bg-secondary/50 p-6 rounded-lg">
                <Label className="text-lg text-muted-foreground">Converted Time</Label>
                <p className="text-4xl font-bold text-primary">{resultTime}</p>
                <p className="font-semibold text-muted-foreground">{resultDate}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-1">
                    {resultOffset} {isResultDst && <Sun className="h-4 w-4 text-yellow-500" title="Daylight Saving Time is active" />}
                </p>
             </div>
        </CardContent>
    );
};


const TimeZoneConverter = () => {
    return (
        <Card className="w-full max-w-4xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Time Zone Tools</CardTitle>
                <CardDescription>Compare time zones on a world clock or convert a specific time.</CardDescription>
            </CardHeader>
            <Tabs defaultValue="world-clock" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="world-clock">World Clock</TabsTrigger>
                    <TabsTrigger value="converter">Time Converter</TabsTrigger>
                </TabsList>
                <TabsContent value="world-clock">
                    <WorldClock />
                </TabsContent>
                <TabsContent value="converter">
                    <TimeConverter />
                </TabsContent>
            </Tabs>
        </Card>
    );
};


export default TimeZoneConverter;

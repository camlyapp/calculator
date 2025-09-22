
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { timeZones } from '@/lib/timezones';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';


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
    const [open, setOpen] = useState(false)


    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const addTimezone = (timezone: string) => {
        if (!selectedTimezones.includes(timezone)) {
            setSelectedTimezones([...selectedTimezones, timezone]);
        }
        setOpen(false);
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
        const localDate = new Date(date.toLocaleString('en-US', { timeZone: localTimeZone }));
        const targetDate = new Date(date.toLocaleString('en-US', { timeZone }));

        const localDay = localDate.getDate();
        const targetDay = targetDate.getDate();

        if (targetDay > localDay || (targetDay === 1 && localDay > 25)) return 'Next Day';
        if (targetDay < localDay || (localDay === 1 && targetDay > 25)) return 'Prev. Day';
        
        return '';
    }

    if (!isMounted) {
        return null; // or a loading skeleton
    }

    return (
        <Card className="w-full max-w-4xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">World Clock & Meeting Planner</CardTitle>
                <CardDescription>Compare time zones and find the perfect meeting time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="time-slider">Time Scrubber</Label>
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
                    {selectedTimezones.map(tz => (
                        <div key={tz} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                            <div className="flex-1">
                                <p className="font-semibold">{tz.replace(/_/g, ' ')}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(displayTime, tz)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold tabular-nums">{formatTime(displayTime, tz)}</p>
                                <p className="text-xs text-accent font-semibold h-4">{getDayIndicator(displayTime, tz)}</p>
                            </div>
                            {tz !== localTimeZone && (
                                <Button variant="ghost" size="icon" onClick={() => removeTimezone(tz)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Timezone
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                         <Command>
                            <CommandInput placeholder="Search timezones..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea className="h-64">
                                    {timeZones.map((tz) => (
                                        <CommandItem
                                            key={tz}
                                            value={tz}
                                            onSelect={() => addTimezone(tz)}
                                        >
                                           <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedTimezones.includes(tz) ? "opacity-100" : "opacity-0"
                                            )}
                                            />
                                            {tz.replace(/_/g, ' ')}
                                        </CommandItem>
                                    ))}
                                    </ScrollArea>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

            </CardContent>
        </Card>
    );
};

export default WorldClock;

    
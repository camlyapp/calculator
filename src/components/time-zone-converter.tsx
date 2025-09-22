
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Clock, Globe } from 'lucide-react';
import TimePicker from './time-picker';
import { cn } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { timeZones } from '@/lib/timezones';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

const TimeZoneConverter = () => {
    const [sourceDate, setSourceDate] = useState<Date | undefined>(new Date());
    const [sourceTime, setSourceTime] = useState('12:00:00');
    const [fromTimeZone, setFromTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [toTimeZone, setToTimeZone] = useState('Europe/London');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
        setSourceTime(currentTime);
    }, []);

    const fullSourceDate = useMemo(() => {
        if (!sourceDate) return null;
        const [hours, minutes, seconds] = sourceTime.split(':').map(Number);
        const d = new Date(sourceDate);
        d.setHours(hours, minutes, seconds);
        return d;
    }, [sourceDate, sourceTime]);

    const conversionResult = useMemo(() => {
        if (!fullSourceDate || !fromTimeZone || !toTimeZone) return null;
        
        try {
            // Create a formatter for the source time zone to get UTC parts
            const sourceFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: fromTimeZone,
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            });
            const parts = sourceFormatter.formatToParts(fullSourceDate);
            const partValues: {[key: string]: string} = {};
            for(const part of parts) {
                partValues[part.type] = part.value;
            }

            // Construct a UTC date string. This is a reliable way to create a date
            // object representing a specific point in time, regardless of the user's local timezone.
            const utcDateStr = `${partValues.year}-${partValues.month}-${partValues.day}T${partValues.hour === '24' ? '00' : partValues.hour}:${partValues.minute}:${partValues.second}Z`;
            const dateInUTC = new Date(utcDateStr);


            // Now format this UTC date into the target timezone
            const targetFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: toTimeZone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZoneName: 'short'
            });

            return targetFormatter.format(fullSourceDate);

        } catch (error) {
            console.error("Time zone conversion error:", error);
            return "Invalid time zone";
        }
    }, [fullSourceDate, fromTimeZone, toTimeZone]);

    if (!isMounted) return null;

    const handleTimeChange = (newTime: { hour: number; minute: number; second: number }) => {
        const { hour, minute, second } = newTime;
        setSourceTime(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`);
    }

    return (
        <Card className="w-full max-w-4xl shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Time Zone Converter</CardTitle>
                <CardDescription>Convert times between different time zones, with daylight saving support.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-primary">Source Time</h3>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !sourceDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {sourceDate ? formatDate(sourceDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={sourceDate} onSelect={setSourceDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <Clock className="mr-2 h-4 w-4" />
                                        {sourceTime}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <TimePicker initialTime={sourceTime} onTimeChange={handleTimeChange} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                             <Label>From Time Zone</Label>
                             <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-72">
                                    {timeZones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                                    </ScrollArea>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>
                     <div className="space-y-4">
                         <h3 className="font-semibold text-lg text-accent">Converted Time</h3>
                         <div className="space-y-2">
                             <Label>To Time Zone</Label>
                             <Select value={toTimeZone} onValueChange={setToTimeZone}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-72">
                                     {timeZones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                                    </ScrollArea>
                                </SelectContent>
                             </Select>
                        </div>
                        {conversionResult && (
                            <div className="text-center bg-secondary/50 p-6 rounded-lg mt-8">
                                <Label className="text-lg text-muted-foreground">Result</Label>
                                <p className="text-3xl font-bold text-accent">{conversionResult}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default TimeZoneConverter;

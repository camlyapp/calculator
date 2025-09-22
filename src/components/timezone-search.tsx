
"use client";

import { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { timeZones } from '@/lib/timezones';
import { Check, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import Flag from 'react-world-flags';
import { timezoneInfo } from '@/lib/timezone-info';
import { getTimeZoneDetails } from './time-zone-converter';

interface TimeZoneSearchProps {
    onSelectTimezone: (timezone: string) => void;
    selectedTimezones?: string[];
    trigger: React.ReactNode;
}

const TimeZoneSearch = ({ onSelectTimezone, selectedTimezones = [], trigger }: TimeZoneSearchProps) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('All');
    const now = useMemo(() => new Date(), []); // Use a stable 'now' for consistent time display within the component's lifecycle

    const filteredTimezones = useMemo(() => {
        if (filter === 'All') {
            return timeZones;
        }
        return timeZones.filter(tz => tz.startsWith(filter));
    }, [filter]);

    const groupedTimezones = useMemo(() => {
        return filteredTimezones.reduce((acc, tz) => {
            const [continent, ...rest] = tz.split('/');
            if (!acc[continent]) {
                acc[continent] = [];
            }
            acc[continent].push(tz);
            return acc;
        }, {} as Record<string, string[]>);
    }, [filteredTimezones]);
    
     const formatTime = (date: Date, timeZone: string) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }).format(date);
        } catch (e) {
            return 'Invalid';
        }
    };


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search timezones..." />
                    <div className="flex items-center gap-1 p-2 border-b">
                        {['All', 'America', 'Europe', 'Asia', 'Africa', 'Australia'].map(f => (
                            <Button 
                                key={f} 
                                variant={filter === f ? "secondary" : "ghost"} 
                                size="sm"
                                onClick={() => setFilter(f)}
                                className="text-xs h-7"
                            >
                                {f}
                            </Button>
                        ))}
                    </div>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <ScrollArea className="h-64">
                            {Object.entries(groupedTimezones).map(([continent, tzs]) => (
                                <CommandGroup key={continent} heading={continent}>
                                    {tzs.map((tz) => {
                                        const { offset, isDst } = getTimeZoneDetails(now, tz);
                                        const countryCode = timezoneInfo[tz]?.countryCode || '';
                                        const countryName = timezoneInfo[tz]?.countryName || '';
                                        return (
                                            <CommandItem
                                                key={tz}
                                                value={`${tz} ${countryName}`}
                                                onSelect={() => {
                                                    onSelectTimezone(tz);
                                                    setOpen(false);
                                                }}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Check className={cn("h-4 w-4", selectedTimezones.includes(tz) ? "opacity-100" : "opacity-0")} />
                                                    <Flag code={countryCode} className="h-4 w-4 rounded-sm" fallback={<div className="h-4 w-4 bg-muted rounded-sm" />} />
                                                    <div>
                                                        <p className="font-semibold text-sm">{tz.split('/').pop()?.replace(/_/g, ' ')}</p>
                                                        <p className="text-xs text-muted-foreground">{countryName}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-mono">{formatTime(now, tz)}</p>
                                                    <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                                        {offset}
                                                        {isDst && <Sun className="h-3 w-3 text-yellow-500" title="DST" />}
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            ))}
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default TimeZoneSearch;

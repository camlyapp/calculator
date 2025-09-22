
"use client";

import { useState, useId } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { format, isValid } from 'date-fns';
import { CalendarIcon, PlusCircle, Trash2, Loader2, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import TimeZoneSearch from './timezone-search';
import { calculateBusinessDaysAction } from '@/app/actions';
import type { CalculateBusinessDaysOutput } from '@/ai/flows/calculate-business-days';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ResultRow {
    id: string;
    timeZone: string;
    result: CalculateBusinessDaysOutput | null;
    isLoading: boolean;
    error?: string;
}

const BusinessDaysCalculator = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    const [rows, setRows] = useState<ResultRow[]>([
        { id: useId(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, result: null, isLoading: false },
        { id: useId(), timeZone: 'America/New_York', result: null, isLoading: false },
    ]);
    const { toast } = useToast();

    const calculateAll = async () => {
        if (!startDate || !endDate || !isValid(startDate) || !isValid(endDate)) {
            toast({ variant: 'destructive', title: 'Invalid Dates', description: 'Please select valid start and end dates.' });
            return;
        }

        if (endDate < startDate) {
            toast({ variant: 'destructive', title: 'Invalid Date Range', description: 'End date cannot be earlier than start date.' });
            return;
        }

        const newRows = rows.map(row => ({ ...row, isLoading: true, error: undefined }));
        setRows(newRows);

        const promises = newRows.map(async (row) => {
            const response = await calculateBusinessDaysAction({
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                timeZone: row.timeZone,
            });

            return {
                ...row,
                result: response.result || null,
                isLoading: false,
                error: response.error,
            };
        });

        const settledRows = await Promise.all(promises);
        setRows(settledRows);
    };
    
    const addRow = () => {
        setRows([...rows, { id: useId(), timeZone: 'Europe/London', result: null, isLoading: false }]);
    };

    const removeRow = (id: string) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const updateRowTimezone = (id: string, timeZone: string) => {
        setRows(rows.map(row => (row.id === id ? { ...row, timeZone } : row)));
    };
    
    const DatePicker = ({ date, setDate }: { date?: Date, setDate: (d?: Date) => void }) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear() + 100} initialFocus /></PopoverContent>
        </Popover>
    );

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Advanced Business Days Calculator</CardTitle>
                <CardDescription>Calculate working days between two dates across different timezones, accounting for local public holidays.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                </div>

                <div className="space-y-4">
                    {rows.map((row, index) => (
                        <div key={row.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label>Timezone</Label>
                                    <TimeZoneSearch
                                        onSelectTimezone={(tz) => updateRowTimezone(row.id, tz)}
                                        selectedTimezones={[row.timeZone]}
                                        trigger={
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                {row.timeZone.replace(/_/g, ' ')}
                                            </Button>
                                        }
                                    />
                                </div>
                                {rows.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>

                            {row.isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-6 w-3/4" />
                                </div>
                            ) : row.error ? (
                                <p className="text-destructive text-sm">Error: {row.error}</p>
                            ) : row.result && (
                                <div className="space-y-2">
                                    <p className="text-2xl font-bold text-primary text-center">{row.result.businessDays} Business Days</p>
                                    <p className="text-xs text-muted-foreground text-center">
                                        ({row.result.totalDays} total days - {row.result.weekendDays} weekend days - {row.result.holidays.length} holidays)
                                    </p>
                                    {row.result.holidays.length > 0 && (
                                        <div className="text-xs text-muted-foreground">
                                            <p className="font-semibold">Holidays observed:</p>
                                            <p>{row.result.holidays.map(h => `${h.name} (${format(new Date(h.date), 'MMM d')})`).join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={addRow}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Timezone
                    </Button>
                    <Button onClick={calculateAll}>
                        <CalendarDays className="mr-2 h-4 w-4" /> Calculate All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BusinessDaysCalculator;


"use client";

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';

interface TimePickerProps {
    initialTime: string; // HH:MM:SS
    onTimeChange: (newTime: { hour: number, minute: number, second: number }) => void;
}

const TimePicker = ({ initialTime, onTimeChange }: TimePickerProps) => {
    const [hour, setHour] = useState(10);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);

    useEffect(() => {
        const [h, m, s] = initialTime.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
            setHour(h);
            setMinute(m);
            setSecond(s);
        }
    }, [initialTime]);
    
    const handleHourChange = (value: string) => {
        const newHour = parseInt(value, 10);
        setHour(newHour);
        onTimeChange({ hour: newHour, minute, second });
    };

    const handleMinuteChange = (value: string) => {
        const newMinute = parseInt(value, 10);
        setMinute(newMinute);
        onTimeChange({ hour, minute: newMinute, second });
    };

    const handleSecondChange = (value: string) => {
        const newSecond = parseInt(value, 10);
        setSecond(newSecond);
        onTimeChange({ hour, minute, second: newSecond });
    };
    
    const timeOptions = (limit: number) => Array.from({ length: limit }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="flex items-end gap-2 p-4">
            <div className="space-y-1">
                <Label htmlFor="hours-picker">Hours</Label>
                <Select value={String(hour).padStart(2, '0')} onValueChange={handleHourChange}>
                    <SelectTrigger className="w-20" id="hours-picker"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <ScrollArea className="h-48">
                            {timeOptions(24).map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
            <span className="font-bold pb-2">:</span>
             <div className="space-y-1">
                <Label htmlFor="minutes-picker">Minutes</Label>
                <Select value={String(minute).padStart(2, '0')} onValueChange={handleMinuteChange}>
                    <SelectTrigger className="w-20" id="minutes-picker"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <ScrollArea className="h-48">
                            {timeOptions(60).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
            <span className="font-bold pb-2">:</span>
             <div className="space-y-1">
                <Label htmlFor="seconds-picker">Seconds</Label>
                <Select value={String(second).padStart(2, '0')} onValueChange={handleSecondChange}>
                    <SelectTrigger className="w-20" id="seconds-picker"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <ScrollArea className="h-48">
                            {timeOptions(60).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default TimePicker;

    
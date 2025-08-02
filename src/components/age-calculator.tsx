
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { intervalToDuration, format, isValid, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>(new Date('1990-01-01'));
    const [result, setResult] = useState<{
        age: { years: number, months: number, days: number };
        summary: { years: number, months: number, weeks: number, days: number, hours: number, minutes: number };
        nextBirthday: { days: number, month: string };
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateAge = () => {
        const now = new Date();
        if (birthDate && isValid(birthDate) && birthDate < now) {
            const ageDuration = intervalToDuration({ start: birthDate, end: now });
            
            // Calculate next birthday
            let nextBirthdayDate = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (now > nextBirthdayDate) {
                nextBirthdayDate.setFullYear(now.getFullYear() + 1);
            }
            const daysToNextBirthday = differenceInDays(nextBirthdayDate, now);

            setResult({
                age: {
                    years: ageDuration.years || 0,
                    months: ageDuration.months || 0,
                    days: ageDuration.days || 0,
                },
                summary: {
                    years: differenceInYears(now, birthDate),
                    months: differenceInMonths(now, birthDate),
                    weeks: differenceInWeeks(now, birthDate),
                    days: differenceInDays(now, birthDate),
                    hours: differenceInDays(now, birthDate) * 24,
                    minutes: differenceInDays(now, birthDate) * 24 * 60,
                },
                nextBirthday: {
                    days: daysToNextBirthday,
                    month: format(nextBirthdayDate, 'MMMM do')
                }
            });
        } else {
            setResult(null);
        }
    };
    
    useEffect(() => {
        if (isMounted) {
            calculateAge();
        }
    }, [birthDate, isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Age Calculator</CardTitle>
                <CardDescription>Calculate your age and see fun facts about your life in numbers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-4">
                    <Label className="text-lg">Enter Your Date of Birth</Label>
                    <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={setBirthDate}
                        className="rounded-md border"
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                    />
                </div>
                
                {result && (
                    <div className="mt-8 pt-8 border-t space-y-8">
                        <div className="text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Your Current Age</Label>
                             <div className="flex justify-center items-baseline space-x-4 mt-2">
                                <div>
                                    <p className="text-4xl font-bold text-primary">{result.age.years}</p>
                                    <p className="text-sm text-muted-foreground">Years</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-primary">{result.age.months}</p>
                                    <p className="text-sm text-muted-foreground">Months</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-primary">{result.age.days}</p>
                                    <p className="text-sm text-muted-foreground">Days</p>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Age Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                <div className="p-2 bg-muted rounded-lg">
                                    <p className="font-bold text-lg">{result.summary.years.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Years</p>
                                </div>
                                 <div className="p-2 bg-muted rounded-lg">
                                    <p className="font-bold text-lg">{result.summary.months.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Months</p>
                                </div>
                                 <div className="p-2 bg-muted rounded-lg">
                                    <p className="font-bold text-lg">{result.summary.weeks.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Weeks</p>
                                </div>
                                 <div className="p-2 bg-muted rounded-lg">
                                    <p className="font-bold text-lg">{result.summary.days.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Days</p>
                                </div>
                                <div className="p-2 bg-muted rounded-lg">
                                    <p className="font-bold text-lg">{result.summary.hours.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Hours</p>
                                </div>
                                <div className="p-2 bg-muted rounded-lg">
                                    <p className="font-bold text-lg">{result.summary.minutes.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Minutes</p>
                                </div>
                            </CardContent>
                        </Card>
                         <div className="text-center bg-accent/20 p-4 rounded-lg">
                             <Label className="text-lg text-accent-foreground">Next Birthday</Label>
                             <p className="text-2xl font-bold text-accent">{result.nextBirthday.days} days until {result.nextBirthday.month}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AgeCalculator;

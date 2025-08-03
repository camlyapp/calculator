
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { intervalToDuration, format, isValid, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

const getZodiacSign = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    return "Capricorn"; // Default
};


const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>(new Date('1990-01-01'));
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [result, setResult] = useState<{
        age: { years: number, months: number, days: number };
        summary: { years: number, months: number, weeks: number, days: number, hours: number, minutes: number };
        nextBirthday: { days: number, month: string };
        birthDetails: { dayOfWeek: string, zodiacSign: string };
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateAge = () => {
        const now = toDate || new Date();
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
                },
                birthDetails: {
                    dayOfWeek: format(birthDate, 'EEEE'),
                    zodiacSign: getZodiacSign(birthDate),
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
    }, [birthDate, toDate, isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Age Calculator</CardTitle>
                <CardDescription>Calculate your age at a specific date and see fun facts about your life in numbers.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 flex flex-col items-center">
                        <Label>Date of Birth</Label>
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
                    <div className="space-y-2 flex flex-col items-center">
                        <Label>Age at Date</Label>
                        <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            className="rounded-md border"
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={new Date().getFullYear() + 100}
                        />
                    </div>
                </div>
                
                {result && (
                    <div className="mt-8 pt-8 border-t space-y-8">
                        <div className="text-center bg-secondary/50 p-6 rounded-lg">
                            <Label className="text-lg text-muted-foreground">Your Age at {toDate ? format(toDate, 'PPP') : 'Today'}</Label>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Birth Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-center">
                                    <div className="p-2 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Born on a</p>
                                        <p className="font-bold text-lg">{result.birthDetails.dayOfWeek}</p>
                                    </div>
                                    <div className="p-2 bg-muted rounded-lg">
                                         <p className="text-sm text-muted-foreground">Your Zodiac Sign</p>
                                        <p className="font-bold text-lg">{result.birthDetails.zodiacSign}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Age Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4 text-center">
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
                                    <div className="p-2 bg-muted rounded-lg col-span-2">
                                        <p className="font-bold text-lg">{result.summary.minutes.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Minutes</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
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

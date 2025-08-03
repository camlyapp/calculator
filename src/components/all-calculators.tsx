
"use client";

import { BrainCircuit, CalendarDays, HeartPulse, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const calculatorPages = [
    {
        href: '/math-science-calculators',
        label: 'Math & Science',
        icon: BrainCircuit,
        description: 'Solve equations, graph functions, and handle complex calculations with ease.',
    },
    {
        href: '/date-time-calculators',
        label: 'Date & Time',
        icon: CalendarDays,
        description: 'Calculate durations, workdays, countdowns, and manipulate dates effortlessly.',
    },
    {
        href: '/personal-health-calculators',
        label: 'Personal & Health',
        icon: HeartPulse,
        description: 'Track your BMI, BMR, due date, and other health metrics to stay on top of your well-being.',
    },
    {
        href: '/other-specialized-calculators',
        label: 'Other Calculators',
        icon: Sparkles,
        description: 'Explore a variety of specialized tools for GPA, fuel efficiency, and more.',
    }
];

const AllCalculators = () => {
    return (
        <Card className="w-full mt-6 shadow-none border-none bg-transparent">
            <CardContent className="p-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {calculatorPages.map((page) => {
                        const Icon = page.icon;
                        return (
                            <Link href={page.href} key={page.href}>
                                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors h-full flex flex-col items-center justify-center text-center">
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2" />
                                    <h3 className="text-sm font-semibold">{page.label}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default AllCalculators;

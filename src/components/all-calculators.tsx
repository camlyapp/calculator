
"use client";

import { BrainCircuit, CalendarDays, HeartPulse, Landmark, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const calculatorPages = [
    {
        href: '/',
        label: 'Financial',
        icon: Landmark,
        description: 'Calculate loans, mortgages, investments, and plan your financial future with our powerful tools.',
    },
    {
        href: '/personal-health-calculators',
        label: 'Personal & Health',
        icon: HeartPulse,
        description: 'Track your BMI, BMR, due date, and other health metrics to stay on top of your well-being.',
    },
    {
        href: '/date-time-calculators',
        label: 'Date & Time',
        icon: CalendarDays,
        description: 'Calculate durations, workdays, countdowns, and manipulate dates effortlessly.',
    },
    {
        href: '/math-science-calculators',
        label: 'Math & Science',
        icon: BrainCircuit,
        description: 'Solve equations, graph functions, and handle complex calculations with ease.',
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
        <Card className="w-full mt-6 shadow-none border-none bg-transparent hidden sm:block">
            <CardContent className="p-0">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {calculatorPages.map((page) => {
                        const Icon = page.icon;
                        return (
                            <Link href={page.href} key={page.href}>
                                <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/20 to-accent/20 text-card-foreground shadow-sm hover:from-primary/30 hover:to-accent/30 transition-all h-full flex flex-col items-center justify-center text-center">
                                    <div className="p-3 rounded-full bg-background/70 mb-2">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
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

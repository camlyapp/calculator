
"use client";

import { BrainCircuit, CalendarDays, HeartPulse, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Card className="w-full mt-6 shadow-lg border-none">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Explore All Calculator Categories</CardTitle>
                <CardDescription>
                    Navigate to any of our specialized calculator pages from here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {calculatorPages.map((page) => {
                        const Icon = page.icon;
                        return (
                            <Link href={page.href} key={page.href}>
                                <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors h-full flex flex-col items-center text-center">
                                    <Icon className="h-12 w-12 text-primary mb-4" />
                                    <h3 className="text-lg font-semibold">{page.label}</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{page.description}</p>
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

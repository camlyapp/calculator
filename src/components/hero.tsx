
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDown, BrainCircuit, Calculator, CalendarDays, HeartPulse, Landmark, Sparkles } from 'lucide-react';

const iconSections = [
    {
        icon: <Landmark className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
        label: "Financial",
        href: "/"
    },
    {
        icon: <HeartPulse className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
        label: "Health",
        href: "/personal-health-calculators"
    },
     {
        icon: <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
        label: "Math & Science",
        href: "/math-science-calculators"
    },
     {
        icon: <CalendarDays className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
        label: "Date & Time",
        href: "/date-time-calculators"
    },
     {
        icon: <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
        label: "Other Tools",
        href: "/other-specialized-calculators"
    },
     {
        icon: <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
        label: "Calculators",
        href: "#calculators"
    },
]

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Empower Your Decisions with Precision Calculators
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                From complex financial projections to daily health metrics, Camly provides the clarity you need. Accurate, fast, and easy to use.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="#calculators">
                  Explore Calculators
                  <ArrowDown className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
           <div className="mx-auto lg:order-last sm:hidden lg:block">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {iconSections.map(section => (
                <Link href={section.href} key={section.label}>
                    <div className="flex flex-col items-center justify-center p-2 sm:p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 animate-rainbow-glow bg-[length:400%_400%]">
                        {section.icon}
                        <p className="mt-2 text-xs font-semibold text-center">{section.label}</p>
                    </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

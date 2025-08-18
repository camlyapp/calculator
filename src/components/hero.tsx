
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

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
           <Image
            src="https://placehold.co/600x400.png"
            data-ai-hint="finance abstract"
            width="600"
            height="400"
            alt="Hero"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;


"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalogClockProps extends React.SVGProps<SVGSVGElement> {
  hours: number;
  minutes: number;
  seconds: number;
  color?: string;
}

const AnalogClockModern = ({ hours, minutes, seconds, color = 'hsl(var(--primary))', className, ...props }: AnalogClockProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={cn("w-24 h-24 bg-muted rounded-lg animate-pulse", className)} />;
  }
  
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
     <div className={cn("w-24 h-24 rounded-lg bg-card shadow-inner flex items-center justify-center relative", className)}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-label="Modern analog clock" {...props}>
            {/* Clock Face */}
            <rect x="2" y="2" width="96" height="96" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="2" />

            {/* Hour and Minute Markers */}
            {Array.from({ length: 12 }).map((_, i) => (
                <line
                    key={i}
                    x1="50"
                    y1="8"
                    x2="50"
                    y2={i % 3 === 0 ? "18" : "12"}
                    stroke={i % 3 === 0 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    transform={`rotate(${i * 30} 50 50)`}
                />
            ))}

            {/* Hour Hand */}
            <line
                x1="50"
                y1="50"
                x2="50"
                y2="30"
                stroke="hsl(var(--foreground))"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${hourDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Minute Hand */}
            <line
                x1="50"
                y1="50"
                x2="50"
                y2="20"
                stroke="hsl(var(--foreground))"
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${minuteDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Second Hand */}
             <line
                x1="50"
                y1="55"
                x2="50"
                y2="10"
                stroke="var(--clock-accent-color)"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${secondDeg} 50 50)`}
                style={{ transition: 'transform 0.1s linear' }}
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="5" fill="hsl(var(--card))" stroke="var(--clock-accent-color)" strokeWidth="2" />
        </svg>
    </div>
  );
};

export default AnalogClockModern;

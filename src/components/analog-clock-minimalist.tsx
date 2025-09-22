
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalogClockProps extends React.SVGProps<SVGSVGElement> {
  hours: number;
  minutes: number;
  seconds: number;
  color?: string;
}

const AnalogClockMinimalist = ({ hours, minutes, seconds, color = 'hsl(var(--primary))', className, ...props }: AnalogClockProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={cn("w-24 h-24 bg-muted rounded-full animate-pulse", className)} />;
  }
  
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className={cn("w-24 h-24 rounded-full bg-card flex items-center justify-center relative", className)}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-label="Minimalist analog clock" {...props}>
             {/* Clock Face */}
            <circle cx="50" cy="50" r="48" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1" />
            
            {/* Hour Markers as dots */}
            {Array.from({ length: 12 }).map((_, i) => (
                <circle
                    key={i}
                    cx="50"
                    cy="10"
                    r={i % 3 === 0 ? 2 : 1}
                    fill="hsl(var(--muted-foreground))"
                    transform={`rotate(${i * 30} 50 50)`}
                />
            ))}

            {/* Hour Hand */}
            <rect
                x="48.5"
                y="28"
                width="3"
                height="22"
                rx="1.5"
                fill="hsl(var(--foreground))"
                transform={`rotate(${hourDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Minute Hand */}
            <rect
                x="49"
                y="15"
                width="2"
                height="35"
                rx="1"
                fill="hsl(var(--foreground))"
                transform={`rotate(${minuteDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Second Hand - Now a thicker, filled rectangle for accessibility */}
             <rect
                x="49.5"
                y="18"
                width="1"
                height="32"
                rx="0.5"
                fill="hsl(var(--primary))"
                transform={`rotate(${secondDeg} 50 50)`}
                style={{ transition: 'transform 0.1s linear' }}
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="1" />
        </svg>
    </div>
  );
};

export default AnalogClockMinimalist;

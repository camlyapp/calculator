
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

            {/* Main markers (12, 3, 6, 9) */}
            {Array.from({ length: 4 }).map((_, i) => (
                <rect
                    key={i}
                    x="49"
                    y="4"
                    width="2"
                    height="8"
                    fill="hsl(var(--foreground))"
                    rx="1"
                    transform={`rotate(${i * 90} 50 50)`}
                />
            ))}

            {/* Hour Hand */}
            <rect
                x="48"
                y="35"
                width="4"
                height="15"
                rx="2"
                fill="hsl(var(--foreground))"
                transform={`rotate(${hourDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Minute Hand */}
            <rect
                x="49"
                y="20"
                width="2"
                height="30"
                rx="1"
                fill="hsl(var(--foreground))"
                transform={`rotate(${minuteDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Second Hand */}
             <line
                x1="50"
                y1="60"
                x2="50"
                y2="15"
                stroke="var(--clock-accent-color)"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${secondDeg} 50 50)`}
                style={{ transition: 'transform 0.1s linear' }}
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="2" fill="var(--clock-accent-color)" />
        </svg>
    </div>
  );
};

export default AnalogClockMinimalist;

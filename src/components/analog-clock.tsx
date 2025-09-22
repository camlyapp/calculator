
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  color?: string;
  className?: string;
}

const AnalogClock = ({ hours, minutes, seconds, color = 'hsl(var(--primary))', className }: AnalogClockProps) => {
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
  
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className={cn("w-24 h-24 rounded-full border-2 bg-card shadow-md flex items-center justify-center relative", className)}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-label="Analog clock">
            {/* Clock Face */}
            <circle cx="50" cy="50" r="48" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1" />

            {/* Hour and Minute Markers */}
            {Array.from({ length: 60 }).map((_, i) => (
                <line
                    key={i}
                    x1="50"
                    y1="5"
                    x2="50"
                    y2={i % 5 === 0 ? "12" : "8"}
                    stroke={i % 15 === 0 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                    strokeWidth={i % 15 === 0 ? "1.5" : "1"}
                    transform={`rotate(${i * 6} 50 50)`}
                />
            ))}

             {/* Numbers */}
            {numbers.map(num => {
                 const angle = num * 30 * (Math.PI / 180);
                 const x = 50 + 38 * Math.sin(angle);
                 const y = 50 - 38 * Math.cos(angle);
                return (
                    <text
                        key={num}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fill="hsl(var(--foreground))"
                        className="font-sans"
                    >
                        {num}
                    </text>
                )
            })}

            {/* Hour Hand */}
            <line
                x1="50"
                y1="50"
                x2="50"
                y2="30"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
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
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${minuteDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Second Hand */}
             <line
                x1="50"
                y1="55"
                x2="50"
                y2="15"
                stroke={color}
                strokeWidth="1"
                strokeLinecap="round"
                transform={`rotate(${secondDeg} 50 50)`}
                style={{ transition: 'transform 0.1s linear' }}
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="hsl(var(--card))" stroke={color} strokeWidth="1.5" />
        </svg>
    </div>
  );
};

export default AnalogClock;

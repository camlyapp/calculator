
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
  
  const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

  return (
    <div className={cn("w-24 h-24 rounded-full bg-card flex items-center justify-center relative animated-border-box", className)}>
        <svg width="90%" height="90%" viewBox="0 0 100 100" aria-label="Vibrant animated analog clock with Roman numerals" {...props}>
            {/* Roman Numerals */}
            {romanNumerals.map((num, i) => {
                 const angle = (i * 30 - 60) * (Math.PI / 180);
                 const x = 50 + 40 * Math.cos(angle);
                 const y = 50 + 40 * Math.sin(angle);
                return (
                    <text
                        key={i}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={i % 3 === 0 ? "10" : "7"}
                        fontWeight={i % 3 === 0 ? "bold" : "normal"}
                        fill="hsl(var(--primary))"
                        className="font-serif"
                    >
                        {num}
                    </text>
                )
            })}

             {/* Hour Hand */}
             <line
                x1="50" y1="50"
                x2="50" y2="30"
                stroke="hsl(var(--foreground))"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${hourDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Minute Hand */}
            <line
                x1="50" y1="50"
                x2="50" y2="18"
                stroke="hsl(var(--foreground))"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${minuteDeg} 50 50)`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
            />
             {/* Second Hand */}
             <rect
                x="49.5"
                y="15"
                width="1"
                height="35"
                rx="0.5"
                fill={color}
                transform={`rotate(${secondDeg} 50 50)`}
                style={{ transition: 'transform 0.1s linear' }}
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="4" fill={color} />
            <circle cx="50" cy="50" r="2" fill="hsl(var(--card))" />
        </svg>
    </div>
  );
};

export default AnalogClockMinimalist;


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
  const vibrantColors = [
      'hsl(var(--chart-1))', 
      'hsl(var(--chart-2))', 
      'hsl(var(--chart-3))', 
      'hsl(var(--chart-4))', 
      'hsl(var(--chart-5))',
      'hsl(var(--accent))'
  ];

  return (
    <div className={cn("w-24 h-24 rounded-full bg-card flex items-center justify-center relative", className)}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-label="Vibrant analog clock with Roman numerals" {...props}>
            {/* Clock Face */}
            <circle cx="50" cy="50" r="48" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1" />
            
            {/* Decorative Color Ring */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted-foreground)/0.2)" strokeWidth="4" />
            
            {/* Roman Numerals */}
            {romanNumerals.map((num, i) => {
                 const angle = (i * 30 - 60) * (Math.PI / 180); // Adjust angle for correct placement
                 const x = 50 + 38 * Math.cos(angle);
                 const y = 50 + 38 * Math.sin(angle);
                return (
                    <text
                        key={i}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={i % 3 === 0 ? "12" : "8"}
                        fontWeight={i % 3 === 0 ? "bold" : "normal"}
                        fill={vibrantColors[i % vibrantColors.length]}
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

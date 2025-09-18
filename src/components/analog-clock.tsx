
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
}

const AnalogClock = ({ hours, minutes, seconds }: AnalogClockProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-64 h-64 bg-muted rounded-full animate-pulse" />;
  }
  
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className="w-64 h-64 rounded-full border-4 border-primary/20 bg-card shadow-lg flex items-center justify-center relative">
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
            <div
                key={i}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${i * 30}deg)` }}
            >
                <div
                    className={cn(
                        "absolute top-2 left-1/2 -translate-x-1/2 h-4 w-0.5 bg-foreground/50",
                        i % 3 === 0 && "h-6 w-1 bg-foreground"
                    )}
                />
            </div>
        ))}
      
      {/* Hour Hand */}
      <div
        className="absolute w-1 h-16 bg-foreground rounded-t-full origin-bottom"
        style={{
          transform: `rotate(${hourDeg}deg)`,
          top: 'calc(50% - 4rem)',
          transition: 'transform 0.3s ease-in-out',
        }}
      />
      {/* Minute Hand */}
      <div
        className="absolute w-0.5 h-24 bg-foreground/80 rounded-t-full origin-bottom"
        style={{
          transform: `rotate(${minuteDeg}deg)`,
           top: 'calc(50% - 6rem)',
          transition: 'transform 0.3s ease-in-out',
        }}
      />
      {/* Second Hand */}
      <div
        className="absolute w-px h-28 bg-accent origin-bottom"
        style={{
          transform: `rotate(${secondDeg}deg)`,
           top: 'calc(50% - 7rem)',
          transition: 'transform 0.2s linear',
        }}
      />
      {/* Center dot */}
      <div className="absolute w-3 h-3 bg-primary rounded-full border-2 border-card" />
    </div>
  );
};

export default AnalogClock;

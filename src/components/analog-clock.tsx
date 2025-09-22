
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
    return <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />;
  }
  
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className="w-24 h-24 rounded-full border-2 border-primary/20 bg-card shadow-md flex items-center justify-center relative">
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
            <div
                key={i}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${i * 30}deg)` }}
            >
                <div
                    className={cn(
                        "absolute top-1 left-1/2 -translate-x-1/2 h-2 w-px bg-foreground/50",
                        i % 3 === 0 && "h-3 w-0.5 bg-foreground"
                    )}
                />
            </div>
        ))}
      
      {/* Hour Hand */}
      <div
        className="absolute w-0.5 h-8 bg-foreground rounded-t-full origin-bottom"
        style={{
          transform: `rotate(${hourDeg}deg)`,
          top: 'calc(50% - 2rem)',
          transition: 'transform 0.3s ease-in-out',
        }}
      />
      {/* Minute Hand */}
      <div
        className="absolute w-px h-10 bg-foreground/80 rounded-t-full origin-bottom"
        style={{
          transform: `rotate(${minuteDeg}deg)`,
           top: 'calc(50% - 2.5rem)',
          transition: 'transform 0.3s ease-in-out',
        }}
      />
      {/* Second Hand */}
      <div
        className="absolute w-px h-11 bg-accent origin-bottom"
        style={{
          transform: `rotate(${secondDeg}deg)`,
           top: 'calc(50% - 2.75rem)',
          transition: 'transform 0.2s linear',
        }}
      />
      {/* Center dot */}
      <div className="absolute w-1.5 h-1.5 bg-primary rounded-full border border-card" />
    </div>
  );
};

export default AnalogClock;

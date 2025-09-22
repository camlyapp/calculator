
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SandboxAnimationProps {
  percentage: number; // 0 to 100
  className?: string;
}

const SandboxAnimation = ({ percentage, className }: SandboxAnimationProps) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Calculate fill heights for sand
  const topSandHeight = (clampedPercentage / 100) * 55; // 55 is the height of the top sand area
  const bottomSandHeight = ( (100 - clampedPercentage) / 100) * 55;

  return (
    <div className={cn("w-32 h-48", className)}>
      <svg width="100%" height="100%" viewBox="0 0 100 150" aria-label="Sandbox animation showing time remaining">
        <defs>
          <clipPath id="top-clip">
            <path d="M 20 15 H 80 L 50 70 L 20 15 Z" />
          </clipPath>
          <clipPath id="bottom-clip">
            <path d="M 20 135 H 80 L 50 80 L 20 135 Z" />
          </clipPath>
           <linearGradient id="sandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
        </defs>

        {/* Hourglass Frame */}
        <path 
          d="M 15 10 H 85 L 50 75 L 15 10 M 15 140 H 85 L 50 75" 
          fill="none" 
          stroke="hsl(var(--foreground) / 0.5)" 
          strokeWidth="4" 
          strokeLinecap="round"
          className={cn(clampedPercentage > 0 && "animate-hourglass-spin")}
        />

        {/* Top Sand (disappearing) */}
        <g clipPath="url(#top-clip)">
          <rect 
            x="15" 
            y={15 + (55 - topSandHeight)}
            width="70" 
            height={topSandHeight} 
            fill="url(#sandGradient)"
            style={{ transition: 'y 0.1s linear, height 0.1s linear' }}
          />
        </g>
        
        {/* Bottom Sand (filling) */}
         <g clipPath="url(#bottom-clip)">
          <rect
            x="15"
            y={135 - bottomSandHeight}
            width="70"
            height={bottomSandHeight}
            fill="url(#sandGradient)"
            style={{ transition: 'y 0.1s linear, height 0.1s linear' }}
          />
        </g>

         {/* Falling Sand Stream */}
        {percentage > 0 && percentage < 100 && (
          <path
            d="M 50 72 v 6"
            stroke="url(#sandGradient)"
            strokeWidth="2"
            strokeDasharray="1 3"
            className="animate-[flow_500ms_linear_infinite]"
            style={{ strokeLinecap: 'round' }}
          />
        )}
      </svg>
    </div>
  );
};

export default SandboxAnimation;

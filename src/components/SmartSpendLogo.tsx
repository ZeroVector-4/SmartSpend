import React, { useId } from 'react';
import { useFinancial } from '../context/FinancialContext';

interface SmartSpendLogoProps {
  className?: string;
  glow?: boolean;
}

export const SmartSpendLogo: React.FC<SmartSpendLogoProps> = ({ className = 'w-10 h-10', glow = false }) => {
  const { theme } = useFinancial();
  const isLight = theme === 'light';
  const id = useId();
  const safeId = id.replace(/:/g, '');
  const metallicGrad = `ss-metal-${safeId}`;
  const mintGrad = `ss-mint-${safeId}`;

  return (
    <div className={`relative shrink-0 select-none group cursor-pointer ${className}`}>
      {glow && (
        <div className={`absolute inset-0 rounded-2xl blur-xl -z-10 transition-all duration-1000 opacity-20 group-hover:opacity-35 ${
          isLight ? 'bg-slate-300' : 'bg-emerald-500/15'
        }`} />
      )}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full transition-all duration-500 ease-out group-hover:scale-[1.04]"
      >
        <defs>
          {/* Quiet Luxury Titanium/Platinum Gradient */}
          <linearGradient id={metallicGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#475569" : "#F8FAFC"} />
            <stop offset="50%" stopColor={isLight ? "#1E293B" : "#CBD5E1"} />
            <stop offset="100%" stopColor={isLight ? "#0F172A" : "#64748B"} />
          </linearGradient>

          {/* Premium High-Tech Mint/Emerald Gradient */}
          <linearGradient id={mintGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* 1. Fine-line Geometric Squircle outer container - high-end styling */}
        <rect 
          x="10" 
          y="10" 
          width="80" 
          height="80" 
          rx="24" 
          fill={isLight ? "#FFFFFF" : "#0B0F17"} 
          stroke={isLight ? "#E2E8F0" : "#1E293B"} 
          strokeWidth="1.5"
        />

        {/* 2. Geometric "S" Monogram split into two interlocking premium ribbons */}
        {/* Top ribbon: Cool Metallic Titanium */}
        <path 
          d="M 66 28 H 40 L 34 34 V 42 L 40 48 H 47" 
          stroke={`url(#${metallicGrad})`} 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Bottom ribbon: Precision Mint Emerald */}
        <path 
          d="M 53 48 H 60 L 66 54 V 62 L 60 68 H 34" 
          stroke={`url(#${mintGrad})`} 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Minimalist central accent point indicating transaction focal point */}
        <circle 
          cx="50" 
          cy="48" 
          r="3" 
          fill={isLight ? "#0F172A" : "#34D399"} 
          opacity="0.9"
        />
      </svg>
    </div>
  );
};




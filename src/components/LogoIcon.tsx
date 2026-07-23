import React from "react";

interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className = "w-6 h-6" }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MIInfotech Logo – Computer Repair, Laptop Repair & CCTV Installation in Hassan"
    >
      <title>MIInfotech Logo – Computer Repair, Laptop Repair & CCTV Installation in Hassan</title>
      {/* Curved CRT-style Monitor Screen (Matches user's previous logo shape) */}
      <path
        d="M 12,18 
           C 14,18 64,20 64,20 
           C 64,20 62,50 62,52 
           C 62,52 12,54 10,54 
           C 8,34 10,18 12,18 Z"
        className="text-current"
      />
      
      {/* Monitor Stand */}
      <path
        d="M 32,54 
           L 36,60 
           L 30,60 
           C 25,60 21,65 19,68 
           L 47,68 
           C 45,65 41,60 36,60 
           Z"
        className="text-current"
      />

      {/* 3D-ish CPU Tower (Matches user's previous logo shape) */}
      <path
        d="M 66,20 
           L 75,15 
           L 75,58 
           L 66,54 
           Z"
        className="text-current opacity-85"
      />
      <path
        d="M 77,11 
           L 93,13 
           L 92,61 
           C 90,62 88,64 87,64 
           L 77,61 
           C 77,59 77,15 77,11 Z"
        className="text-current"
      />

      {/* CPU Front Details: Vertical oval button at top, split horizontal lines */}
      <path
        d="M 83,18 
           C 84,18 85,20 85,22 
           C 85,25 84,27 83,27 
           C 82,27 81,25 81,22 
           C 81,20 82,18 83,18 Z"
        fill="currentColor"
        className="text-slate-950"
      />
      <path
        d="M 79,40 
           L 91,40"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-950"
      />
    </svg>
  );
}

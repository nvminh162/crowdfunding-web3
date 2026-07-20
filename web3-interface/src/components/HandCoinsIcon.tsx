import React from 'react';

export const HandCoinsIcon: React.FC<{ className?: string }> = ({ className = "w-36 h-36 text-slate-200" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top-left Coin */}
      <circle cx="34" cy="28" r="11" />
      <circle cx="34" cy="28" r="5" strokeWidth="3" />

      {/* Top-right Coin */}
      <circle cx="70" cy="40" r="11" />
      <circle cx="70" cy="40" r="5" strokeWidth="3" />

      {/* Wrist Cuff Parallel Lines */}
      <path d="M 94 102 L 108 88" />
      <path d="M 84 108 L 98 94" />

      {/* Main Hand Contour */}
      <path d="M 98 94 C 86 82 72 70 56 70 C 42 70 30 80 18 80 C 12 80 8 74 10 66 C 14 54 30 52 42 60 C 52 66 64 64 76 52 L 108 88" />

      {/* Palm Fold Crease */}
      <path d="M 30 76 C 38 66 48 64 58 68" />
    </svg>
  );
};

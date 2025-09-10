import React from 'react';

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Tag({ children, active, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active 
          ? "border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg" 
          : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}

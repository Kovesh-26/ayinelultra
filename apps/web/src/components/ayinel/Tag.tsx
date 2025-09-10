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
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
        active 
          ? "border-indigo-400 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 shadow-lg shadow-indigo-500/25" 
          : "border-white/20 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

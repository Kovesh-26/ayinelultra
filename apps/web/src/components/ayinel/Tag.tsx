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
      className={`group relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active 
          ? "border-indigo-400 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 shadow-lg shadow-indigo-500/25" 
          : "border-white/10 bg-white/5 text-white/70 hover:border-indigo-400/50 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 hover:text-white hover:shadow-lg hover:shadow-indigo-500/10"
      }`}
    >
      {/* Animated background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
    </button>
  );
}

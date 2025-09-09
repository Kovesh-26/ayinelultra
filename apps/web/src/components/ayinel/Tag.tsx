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
      className={`rounded-full border px-3 py-1 text-sm ${
        active
          ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300'
          : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

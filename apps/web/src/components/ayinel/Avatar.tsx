import React from 'react';

interface AvatarProps {
  src?: string;
  label: string;
  sub?: string;
  onClick?: () => void;
}

export function Avatar({ src, label, sub, onClick }: AvatarProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10 transition-colors"
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-full bg-white/10" />
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {sub && <div className="text-xs text-white/60">{sub}</div>}
      </div>
    </div>
  );
}

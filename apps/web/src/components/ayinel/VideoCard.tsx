import React from 'react';

interface VideoCardProps {
  title: string;
  channel?: string;
  duration?: string;
  badge?: string;
  live?: boolean;
  onClick?: () => void;
}

export function VideoCard({ title, channel = "Creator", duration = "6:28", badge, live, onClick }: VideoCardProps) {
  return (
    <div 
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-200"
      onClick={onClick}
    >
      <div className="relative h-40 w-full bg-gradient-to-br from-indigo-600/40 to-fuchsia-600/30">
        {live && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase tracking-wide">
            LIVE
          </span>
        )}
        {badge && (
          <span className="absolute right-3 top-3 rounded-md bg-indigo-600/90 px-2 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
        {!live && (
          <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
            {duration}
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-medium text-white leading-tight">{title}</h3>
        <p className="text-sm text-white/60">{channel}</p>
      </div>
    </div>
  );
}

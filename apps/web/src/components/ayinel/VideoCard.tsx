import React from 'react';

interface VideoCardProps {
  title: string;
  channel?: string;
  duration?: string;
  badge?: string;
  live?: boolean;
  onClick?: () => void;
}

export function VideoCard({
  title,
  channel = 'Creator',
  duration = '6:28',
  badge,
  live,
  onClick,
}: VideoCardProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
      onClick={onClick}
    >
      <div className="relative h-40 w-full bg-gradient-to-br from-indigo-600/40 to-fuchsia-600/30">
        {live && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            LIVE
          </span>
        )}
        {badge && (
          <span className="absolute right-2 top-2 rounded bg-indigo-600/80 px-2 py-0.5 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {duration}
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 font-medium text-white">{title}</h3>
        <p className="text-xs text-white/60">{channel}</p>
      </div>
    </div>
  );
}

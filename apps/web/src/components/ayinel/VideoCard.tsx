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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* Enhanced thumbnail with better gradient and overlay effects */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-indigo-600/50 via-purple-600/40 to-fuchsia-600/50">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]" />
        
        {/* Live badge with pulse animation */}
        {live && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        )}
        
        {/* Enhanced badge */}
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">{badge}</span>
        )}
        
        {/* Duration with better styling */}
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">{duration}</span>
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Enhanced content area */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold text-white transition-colors duration-300 group-hover:text-indigo-300">{title}</h3>
        <p className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">{channel}</p>
      </div>
      
      {/* Subtle glow effect on hover */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

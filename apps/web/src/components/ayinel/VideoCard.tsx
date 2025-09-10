import React from 'react';

interface VideoCardProps {
  title: string;
  channel?: string;
  duration?: string;
  badge?: string;
  live?: boolean;
  views?: string;
  thumbnail?: string;
  onClick?: () => void;
}

export function VideoCard({ 
  title, 
  channel = "Creator", 
  duration = "6:28", 
  badge, 
  live, 
  views = "12.5K views",
  thumbnail,
  onClick 
}: VideoCardProps) {
  
  // Generate random gradient colors for thumbnails
  const gradients = [
    "from-purple-600/60 via-blue-600/40 to-indigo-600/60",
    "from-pink-600/60 via-rose-600/40 to-red-600/60", 
    "from-green-600/60 via-emerald-600/40 to-teal-600/60",
    "from-yellow-600/60 via-orange-600/40 to-red-600/60",
    "from-indigo-600/60 via-purple-600/40 to-pink-600/60",
    "from-cyan-600/60 via-blue-600/40 to-indigo-600/60"
  ];
  
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div 
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
      onClick={onClick}
    >
      <div className={`relative h-48 w-full bg-gradient-to-br ${randomGradient} overflow-hidden`}>
        {/* Mock Video Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>
        
        {/* Video Info Overlays */}
        {live && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-600/90 px-3 py-1 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-white">LIVE</span>
          </div>
        )}
        
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-indigo-400/30">
            {badge}
          </span>
        )}
        
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {duration}
        </span>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>
      
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold text-white text-sm leading-tight group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs">
            {channel.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/70 truncate">{channel}</p>
            <p className="text-xs text-white/50">{views} • 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

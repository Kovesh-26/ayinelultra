import React from 'react';
import { Play, Dot, MoreVertical, Clock, Eye } from 'lucide-react';

interface VideoCardProps {
  title: string;
  channel?: string;
  duration?: string;
  badge?: string;
  live?: boolean;
  views?: string;
  timeAgo?: string;
  thumbnailGradient?: string;
  onClick?: () => void;
}

export function VideoCard({ 
  title, 
  channel = "Creator", 
  duration = "6:28", 
  badge, 
  live, 
  views = "42K views",
  timeAgo = "2 hours ago",
  thumbnailGradient,
  onClick 
}: VideoCardProps) {
  const gradientClass = thumbnailGradient || "from-violet-600/60 via-purple-600/40 to-pink-600/60";
  
  return (
    <div 
      className="group card-video cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={`relative aspect-video bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur rounded-full p-3">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        
        {/* Live indicator */}
        {live && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 px-2 py-1 rounded text-xs font-semibold text-white">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-violet-600 to-purple-600 px-2 py-1 rounded text-xs font-semibold text-white">
            {badge}
          </div>
        )}
        
        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white">
          <Clock className="w-3 h-3 inline mr-1" />
          {duration}
        </div>

        {/* View count for live videos */}
        {live && (
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {views}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {channel.charAt(0).toUpperCase()}
          </div>
          
          {/* Video Info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
              {title}
            </h3>
            <div className="mt-1 space-y-1">
              <div className="text-sm text-white/60 hover:text-white/80 cursor-pointer transition-colors">
                {channel}
              </div>
              <div className="flex items-center text-xs text-white/50 gap-1">
                <span>{views}</span>
                <Dot className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          
          {/* More options */}
          <button className="p-1 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 text-white/60 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

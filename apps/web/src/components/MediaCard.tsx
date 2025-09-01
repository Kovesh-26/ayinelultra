'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ClockIcon, EyeIcon, HeartIcon } from 'lucide-react';

interface MediaCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  author: string;
  views: string;
  time: string;
  duration?: string;
  isLive?: boolean;
  kidSafe?: boolean;
  type?: 'video' | 'music' | 'flip';
  href: string;
}

export default function MediaCard({
  id,
  title,
  thumbnail,
  author,
  views,
  time,
  duration,
  isLive = false,
  kidSafe = false,
  type = 'video',
  href
}: MediaCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition shadow-lg border border-gray-700">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-2xl">
                    {type === 'music' ? '🎵' : type === 'flip' ? '📱' : '🎬'}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">{type}</div>
              </div>
            </div>
          )}
          
          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold shadow-lg flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          )}
          
          {/* Duration Badge */}
          {duration && !isLive && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {duration}
            </div>
          )}
          
          {/* Kid Safe Badge */}
          {kidSafe && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold shadow-lg">
              Kid Safe
            </div>
          )}
        </div>
        
        {/* Content Info */}
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2 text-white group-hover:text-purple-300 transition">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>{views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

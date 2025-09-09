'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  HeartIcon,
  MessageCircleIcon,
  UsersIcon,
  PlusIcon,
} from 'lucide-react';

interface StudioHeaderProps {
  studio: {
    id: string;
    name: string;
    handle: string;
    description?: string;
    avatar?: string;
    banner?: string;
    followerCount: number;
    isFollowing?: boolean;
    theme?: any;
  };
}

export default function StudioHeader({ studio }: StudioHeaderProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
        {studio.banner && (
          <img
            src={studio.banner}
            alt={`${studio.name} banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Studio Info */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between">
          {/* Avatar and Info */}
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold -mt-12 border-4 border-gray-800">
              {studio.avatar ? (
                <img
                  src={studio.avatar}
                  alt={studio.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                studio.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-bold text-white">{studio.name}</h1>
              <p className="text-gray-400">@{studio.handle}</p>
              {studio.description && (
                <p className="text-gray-300 mt-2 max-w-2xl">
                  {studio.description}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                <span>
                  {studio.followerCount.toLocaleString()} Crew members
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              <MessageCircleIcon className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition',
                studio.isFollowing
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              )}
            >
              <HeartIcon className="w-4 h-4" />
              <span>{studio.isFollowing ? 'Tuned-In' : 'Tune-In'}</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition">
              <UsersIcon className="w-4 h-4" />
              <span>Join Crew</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              <PlusIcon className="w-4 h-4" />
              <span>Boost</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6 border-b border-gray-700">
          {['About', 'Videos', 'Music', 'Broadcast', 'Community', 'Store'].map(
            (tab) => (
              <button
                key={tab}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition',
                  tab === 'About'
                    ? 'text-white border-purple-500'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                )}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

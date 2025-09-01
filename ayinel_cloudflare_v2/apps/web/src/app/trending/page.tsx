'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrendingVideo {
  id: string;
  title: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  thumbnail: string;
  duration: number;
  views: number;
  boosts: number;
  createdAt: string;
  category: string;
  isLive?: boolean;
}

interface TrendingCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  crew: number;
  tuneIns: number;
  totalViews: number;
  recentVideos: number;
}

export default function TrendingPage() {
  const [trendingVideos, setTrendingVideos] = useState<TrendingVideo[]>([]);
  const [trendingCreators, setTrendingCreators] = useState<TrendingCreator[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'creators'>('videos');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for development
    const mockTrendingVideos: TrendingVideo[] = [
      {
        id: "video-1",
        title: "Amazing Ayinel Platform Demo - Building the Future of Video",
        creator: {
          id: "creator-1",
          username: "ayinel_creator",
          displayName: "Ayinel Creator",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
        },
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=320&h=180&fit=crop",
        duration: 1247,
        views: 154200,
        boosts: 12470,
        createdAt: "2024-01-15T10:30:00Z",
        category: "Technology"
      },
      {
        id: "video-2",
        title: "Live Gaming Stream: Epic Battle Royale",
        creator: {
          id: "creator-2",
          username: "gamemaster",
          displayName: "GameMaster",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
        },
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=320&h=180&fit=crop",
        duration: 0,
        views: 89200,
        boosts: 5670,
        createdAt: "2024-01-15T09:00:00Z",
        category: "Gaming",
        isLive: true
      },
      {
        id: "video-3",
        title: "How to Create Your First Studio on Ayinel",
        creator: {
          id: "creator-3",
          username: "ayinel_tutorials",
          displayName: "Ayinel Tutorials",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
        },
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=180&fit=crop",
        duration: 892,
        views: 45600,
        boosts: 2340,
        createdAt: "2024-01-14T15:20:00Z",
        category: "Education"
      },
      {
        id: "video-4",
        title: "Understanding the Token Economy",
        creator: {
          id: "creator-4",
          username: "token_expert",
          displayName: "Token Expert",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
        },
        thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=320&h=180&fit=crop",
        duration: 654,
        views: 34200,
        boosts: 1890,
        createdAt: "2024-01-14T12:45:00Z",
        category: "Finance"
      },
      {
        id: "video-5",
        title: "Cooking with Ayinel: Gourmet Recipes",
        creator: {
          id: "creator-5",
          username: "chef_ayinel",
          displayName: "Chef Ayinel",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
        },
        thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=320&h=180&fit=crop",
        duration: 1200,
        views: 28900,
        boosts: 1560,
        createdAt: "2024-01-13T18:30:00Z",
        category: "Cooking"
      },
      {
        id: "video-6",
        title: "Fitness Challenge: 30-Day Transformation",
        creator: {
          id: "creator-6",
          username: "fitness_guru",
          displayName: "Fitness Guru",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face"
        },
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=180&fit=crop",
        duration: 1800,
        views: 23400,
        boosts: 1230,
        createdAt: "2024-01-13T14:15:00Z",
        category: "Fitness"
      }
    ];

    const mockTrendingCreators: TrendingCreator[] = [
      {
        id: "creator-1",
        username: "ayinel_creator",
        displayName: "Ayinel Creator",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        banner: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=150&fit=crop",
        bio: "Building the future of video content creation and consumption. Passionate about technology and innovation.",
        crew: 8920,
        tuneIns: 156,
        totalViews: 1247000,
        recentVideos: 47
      },
      {
        id: "creator-2",
        username: "gamemaster",
        displayName: "GameMaster",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=150&fit=crop",
        bio: "Professional gamer and content creator. Bringing you the best gaming content and live streams.",
        crew: 5670,
        tuneIns: 234,
        totalViews: 890000,
        recentVideos: 89
      },
      {
        id: "creator-3",
        username: "ayinel_tutorials",
        displayName: "Ayinel Tutorials",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        banner: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=150&fit=crop",
        bio: "Educational content creator helping you master the Ayinel platform and beyond.",
        crew: 3450,
        tuneIns: 189,
        totalViews: 456000,
        recentVideos: 34
      }
    ];

    setTimeout(() => {
      setTrendingVideos(mockTrendingVideos);
      setTrendingCreators(mockTrendingCreators);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'LIVE';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading trending content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Ayinel
            </Link>
            <nav className="flex space-x-6">
              <Link href="/explore" className="text-gray-300 hover:text-white">Explore</Link>
              <Link href="/trending" className="text-purple-400 font-medium">Trending</Link>
              <Link href="/live" className="text-gray-300 hover:text-white">Live</Link>
              <Link href="/chat" className="text-gray-300 hover:text-white">Chat</Link>
              <Link href="/studio/create" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Create
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trending</h1>
          <p className="text-gray-400">Discover what's popular on Ayinel right now</p>
        </div>

        {/* Time Filter */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === 'today'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === 'week'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === 'month'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Month
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'videos'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending Videos
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'creators'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending Creators
          </button>
        </div>

        {/* Content */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingVideos.map((video, index) => (
              <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {formatDuration(video.duration)}
                  </div>
                  {video.isLive && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                      LIVE
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    #{index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={video.creator.avatar} 
                      alt={video.creator.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-sm truncate">{video.creator.displayName}</p>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{formatViews(video.views)} views</span>
                    <span>🚀 {formatViews(video.boosts)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-purple-400 text-xs">{video.category}</span>
                    <span className="text-gray-500 text-xs">{formatTime(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'creators' && (
          <div className="space-y-6">
            {trendingCreators.map((creator, index) => (
              <div key={creator.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative h-32">
                  <img 
                    src={creator.banner} 
                    alt="Creator banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    #{index + 1}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={creator.avatar} 
                      alt={creator.displayName}
                      className="w-16 h-16 rounded-full border-4 border-gray-800 -mt-8"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{creator.displayName}</h3>
                      <p className="text-gray-400 text-sm mb-3">@{creator.username}</p>
                      <p className="text-gray-300 text-sm mb-4">{creator.bio}</p>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{formatViews(creator.crew)}</div>
                          <div className="text-gray-400 text-xs">Crew</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{formatViews(creator.tuneIns)}</div>
                          <div className="text-gray-400 text-xs">Tune-Ins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{formatViews(creator.totalViews)}</div>
                          <div className="text-gray-400 text-xs">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{creator.recentVideos}</div>
                          <div className="text-gray-400 text-xs">Videos</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          href={`/profile/${creator.username}`}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                          View Profile
                        </Link>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                          Tune In
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

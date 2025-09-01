'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
  isTunedIn: boolean;
  isOwnProfile: boolean;
  stats: {
    videos: number;
    tuneIns: number;
    crew: number;
    totalViews: number;
  };
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  views: number;
  boosts: number;
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'collections' | 'about'>('videos');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for development
    const mockProfile: Profile = {
      id: "user-1",
      username: username,
      displayName: "Ayinel Creator",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      banner: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=300&fit=crop",
      bio: "Building the future of video content creation and consumption. Passionate about technology, creativity, and community. Join me on this amazing journey! 🚀",
      location: "San Francisco, CA",
      website: "https://ayinel.com",
      joinedDate: "2023-06-15T00:00:00Z",
      isTunedIn: false,
      isOwnProfile: false,
      stats: {
        videos: 47,
        tuneIns: 156,
        crew: 892,
        totalViews: 1247000
      }
    };

    const mockVideos: Video[] = [
      {
        id: "video-1",
        title: "Amazing Ayinel Platform Demo - Building the Future of Video",
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=320&h=180&fit=crop",
        duration: 1247,
        views: 15420,
        boosts: 1247,
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "video-2",
        title: "How to Create Your First Studio on Ayinel",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&h=180&fit=crop",
        duration: 892,
        views: 8234,
        boosts: 567,
        createdAt: "2024-01-14T15:20:00Z"
      },
      {
        id: "video-3",
        title: "Understanding the Token Economy",
        thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=320&h=180&fit=crop",
        duration: 654,
        views: 5678,
        boosts: 234,
        createdAt: "2024-01-13T09:45:00Z"
      }
    ];

    setTimeout(() => {
      setProfile(mockProfile);
      setVideos(mockVideos);
      setIsLoading(false);
    }, 1000);
  }, [username]);

  const formatDuration = (seconds: number) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleTuneIn = () => {
    if (profile) {
      setProfile({
        ...profile,
        isTunedIn: !profile.isTunedIn,
        stats: {
          ...profile.stats,
          crew: profile.isTunedIn ? profile.stats.crew - 1 : profile.stats.crew + 1
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
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
              <Link href="/trending" className="text-gray-300 hover:text-white">Trending</Link>
              <Link href="/live" className="text-gray-300 hover:text-white">Live</Link>
              <Link href="/studio/create" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Create
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Profile Banner */}
      <div className="relative">
        <img 
          src={profile.banner} 
          alt="Profile banner"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <img 
                src={profile.avatar} 
                alt={profile.displayName}
                className="w-32 h-32 rounded-full border-4 border-gray-800"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.displayName}</h1>
                <p className="text-gray-400 text-lg mb-1">@{profile.username}</p>
                <p className="text-gray-500 text-sm">Joined {formatDate(profile.joinedDate)}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {!profile.isOwnProfile && (
                <button
                  onClick={handleTuneIn}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                    profile.isTunedIn
                      ? 'bg-gray-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {profile.isTunedIn ? 'Tuned In' : 'Tune In'}
                </button>
              )}
              
              {profile.isOwnProfile && (
                <Link
                  href="/studio/edit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profile.stats.videos}</div>
              <div className="text-gray-400 text-sm">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profile.stats.tuneIns}</div>
              <div className="text-gray-400 text-sm">Tune-Ins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profile.stats.crew}</div>
              <div className="text-gray-400 text-sm">Crew</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{formatViews(profile.stats.totalViews)}</div>
              <div className="text-gray-400 text-sm">Total Views</div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-white text-lg leading-relaxed">{profile.bio}</p>

          {/* Links */}
          {(profile.location || profile.website) && (
            <div className="flex space-x-6 mt-4 text-gray-400">
              {profile.location && (
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                >
                  <span>🌐</span>
                  <span>{profile.website}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'videos'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'collections'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              About
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <Link 
                    key={video.id} 
                    href={`/watch/${video.id}`}
                    className="group"
                  >
                    <div className="relative mb-3">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{formatViews(video.views)} views</span>
                      <span>🚀 {video.boosts}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'collections' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Collections Yet</h3>
                <p className="text-gray-400">This creator hasn't created any collections yet.</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About {profile.displayName}</h3>
                  <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">{profile.stats.videos}</div>
                      <div className="text-gray-400 text-sm">Videos Created</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">{formatViews(profile.stats.totalViews)}</div>
                      <div className="text-gray-400 text-sm">Total Views</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

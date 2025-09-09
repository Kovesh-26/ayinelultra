'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, auth, endpoints } from '@/lib/api';

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
}

interface Studio {
  id: string;
  name: string;
  handle: string;
  about?: string;
  bannerUrl?: string;
  crewCount: number;
  videoCount: number;
}

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  duration: number;
  views: number;
  boosts: number;
  createdAt: string;
  status: string;
}

interface Stats {
  totalViews: number;
  totalBoosts: number;
  totalCrew: number;
  totalVideos: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalViews: 0,
    totalBoosts: 0,
    totalCrew: 0,
    totalVideos: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        const userData = auth.getUser();
        setUser(userData);

        // Load user data and studio
        const [userResponse, studioResponse] = await Promise.all([
          api.get('/users/profile'),
          api.get('/studios/my-studio').catch(() => null), // Studio might not exist
        ]);

        setUser(userResponse.data);

        if (studioResponse) {
          setStudio(studioResponse.data);

          // Load studio-specific data
          const [videosResponse, statsResponse] = await Promise.all([
            api.get(
              endpoints.videos.list + '?studioId=' + studioResponse.data.id
            ),
            api.get('/studios/' + studioResponse.data.id + '/stats'),
          ]);

          setRecentVideos(videosResponse.data.slice(0, 5));
          setStats(statsResponse.data);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load dashboard');
        if (error.response?.status === 401) {
          auth.logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = () => {
    auth.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-purple-200 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-white">
              Ayinel
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href="/uploads"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Upload Video
              </Link>

              {!studio && (
                <Link
                  href="/studio/create"
                  className="bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Create Studio
                </Link>
              )}

              <div className="flex items-center space-x-3">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-white">
                  <p className="font-medium">{user?.displayName}</p>
                  <p className="text-sm text-purple-200">{user?.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.displayName}! 👋
          </h1>
          <p className="text-purple-200">
            Here's what's happening with your content today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-200">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-200">
                  Total Boosts
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalBoosts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-200">
                  Crew Members
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalCrew.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-200">
                  Total Videos
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalVideos.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/uploads"
              className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Upload Video</h3>
                <p className="text-sm text-purple-200">Share new content</p>
              </div>
            </Link>

            {studio ? (
              <Link
                href={`/studio/${studio.handle}`}
                className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">My Studio</h3>
                  <p className="text-sm text-purple-200">Manage your studio</p>
                </div>
              </Link>
            ) : (
              <Link
                href="/studio/create"
                className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="p-2 bg-green-500/20 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Create Studio</h3>
                  <p className="text-sm text-purple-200">Start your channel</p>
                </div>
              </Link>
            )}

            <Link
              href="/wallet"
              className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <div className="p-2 bg-yellow-500/20 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Wallet</h3>
                <p className="text-sm text-purple-200">Manage your balance</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Videos */}
        {studio && recentVideos.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Videos
              </h2>
              <Link
                href={`/studio/${studio.handle}/videos`}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="block bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  <div className="relative">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-white/10 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white/30"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(video.duration / 60)}:
                      {String(video.duration % 60).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-purple-200">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>{video.boosts.toLocaleString()} boosts</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Studio Message */}
        {!studio && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to start creating?
            </h3>
            <p className="text-purple-200 mb-6">
              Create your studio to start uploading videos and building your
              crew.
            </p>
            <Link
              href="/studio/create"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Create Your Studio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, endpoints } from '@/lib/api';

interface SearchResult {
  type: 'video' | 'studio' | 'user';
  data: any;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(type);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query, type);
    }
  }, [query, type]);

  const performSearch = async (searchQuery: string, searchType: string) => {
    setIsLoading(true);

    try {
      let searchResults: SearchResult[] = [];

      if (searchType === 'all' || searchType === 'video') {
        try {
          const videoResponse = await api.get(
            `${endpoints.videos.list}?search=${encodeURIComponent(searchQuery)}`
          );
          searchResults.push(
            ...videoResponse.data.map((video: any) => ({
              type: 'video',
              data: video,
            }))
          );
        } catch (error) {
          console.error('Video search failed:', error);
        }
      }

      if (searchType === 'all' || searchType === 'studio') {
        try {
          const studioResponse = await api.get(
            `${endpoints.studios.list}?search=${encodeURIComponent(searchQuery)}`
          );
          searchResults.push(
            ...studioResponse.data.map((studio: any) => ({
              type: 'studio',
              data: studio,
            }))
          );
        } catch (error) {
          console.error('Studio search failed:', error);
        }
      }

      if (searchType === 'all' || searchType === 'user') {
        try {
          const userResponse = await api.get(
            `/users/search?q=${encodeURIComponent(searchQuery)}`
          );
          searchResults.push(
            ...userResponse.data.map((user: any) => ({
              type: 'user',
              data: user,
            }))
          );
        } catch (error) {
          console.error('User search failed:', error);
        }
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.append('q', searchQuery.trim());
      if (activeFilter !== 'all') {
        params.append('type', activeFilter);
      }
      window.history.pushState({}, '', `/search?${params.toString()}`);
      performSearch(searchQuery.trim(), activeFilter);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderVideoResult = (video: any) => (
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
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-white mb-2 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-purple-200">
          <span>{video.views?.toLocaleString() || 0} views</span>
          <span>{video.boosts?.toLocaleString() || 0} boosts</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>
        {video.creator && (
          <p className="text-sm text-purple-300 mt-2">
            by {video.creator.displayName}
          </p>
        )}
      </div>
    </Link>
  );

  const renderStudioResult = (studio: any) => (
    <Link
      key={studio.id}
      href={`/studio/${studio.handle}`}
      className="block bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10"
    >
      <div className="relative">
        {studio.bannerUrl ? (
          <img
            src={studio.bannerUrl}
            alt={studio.name}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {studio.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-white mb-2">{studio.name}</h3>
        <p className="text-sm text-purple-200 mb-3 line-clamp-2">
          {studio.about}
        </p>
        <div className="flex items-center space-x-4 text-sm text-purple-300">
          <span>{studio.videoCount || 0} videos</span>
          <span>{studio.crewCount || 0} crew members</span>
        </div>
      </div>
    </Link>
  );

  const renderUserResult = (user: any) => (
    <Link
      key={user.id}
      href={`/profile/${user.username}`}
      className="block bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 border border-white/10"
    >
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {user.displayName?.charAt(0)}
            </span>
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-medium text-white">{user.displayName}</h3>
          <p className="text-sm text-purple-200">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-purple-300 mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

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
                href="/dashboard"
                className="bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for videos, studios, or users..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        {query && (
          <div className="mb-8">
            <div className="flex space-x-1 bg-white/10 rounded-lg p-1 max-w-md mx-auto">
              {[
                { id: 'all', label: 'All', count: results.length },
                {
                  id: 'video',
                  label: 'Videos',
                  count: results.filter((r) => r.type === 'video').length,
                },
                {
                  id: 'studio',
                  label: 'Studios',
                  count: results.filter((r) => r.type === 'studio').length,
                },
                {
                  id: 'user',
                  label: 'Users',
                  count: results.filter((r) => r.type === 'user').length,
                },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    const params = new URLSearchParams();
                    params.append('q', query);
                    if (filter.id !== 'all') {
                      params.append('type', filter.id);
                    }
                    window.history.pushState(
                      {},
                      '',
                      `/search?${params.toString()}`
                    );
                    performSearch(query, filter.id);
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-white text-purple-900'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Searching...</h2>
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-purple-200 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No results found
            </h2>
            <p className="text-purple-200 mb-6">
              Try adjusting your search terms or check the spelling.
            </p>
            <div className="space-y-2">
              <p className="text-purple-200 text-sm">Suggestions:</p>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Use different keywords</li>
                <li>• Check your spelling</li>
                <li>• Try more general terms</li>
              </ul>
            </div>
          </div>
        ) : query ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Results for "{query}" ({results.length} found)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => {
                switch (result.type) {
                  case 'video':
                    return renderVideoResult(result.data);
                  case 'studio':
                    return renderStudioResult(result.data);
                  case 'user':
                    return renderUserResult(result.data);
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-purple-200 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Start searching
            </h2>
            <p className="text-purple-200">
              Enter a search term above to find videos, studios, and users on
              Ayinel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

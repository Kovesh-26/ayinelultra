'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [searchQuery, setSearchQuery] = useState('');

  const rooms = [
    {
      id: '1',
      name: 'Gaming Community',
      description:
        'Discuss your favorite games, share strategies, and find teammates',
      memberCount: 1247,
      isLive: true,
      category: 'Gaming',
      image: '/api/placeholder/300/200',
    },
    {
      id: '2',
      name: 'Music Producers',
      description:
        'Share your music, get feedback, and collaborate with other artists',
      memberCount: 892,
      isLive: false,
      category: 'Music',
      image: '/api/placeholder/300/200',
    },
    {
      id: '3',
      name: 'Tech Enthusiasts',
      description:
        'Latest tech news, reviews, and discussions about the future of technology',
      memberCount: 2156,
      isLive: true,
      category: 'Technology',
      image: '/api/placeholder/300/200',
    },
    {
      id: '4',
      name: 'Fitness & Health',
      description:
        'Workout tips, nutrition advice, and motivation for your fitness journey',
      memberCount: 743,
      isLive: false,
      category: 'Fitness',
      image: '/api/placeholder/300/200',
    },
  ];

  const trendingTopics = [
    {
      id: '1',
      title: 'New Gaming Console Release',
      posts: 156,
      category: 'Gaming',
    },
    { id: '2', title: 'AI in Music Production', posts: 89, category: 'Music' },
    {
      id: '3',
      title: 'Latest Smartphone Reviews',
      posts: 234,
      category: 'Technology',
    },
    {
      id: '4',
      title: 'Summer Workout Challenge',
      posts: 67,
      category: 'Fitness',
    },
  ];

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              AYINEL Community
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect, share, and grow with creators worldwide
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search rooms, topics, or creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'rooms'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Community Rooms
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'trending'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Trending Topics
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Create Room
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Popular Community Rooms
              </h2>
              <Link
                href="/community/create"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
              >
                Create Room
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-4xl text-white opacity-20">🎮</span>
                    </div>
                    {room.isLive && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                          <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                          LIVE
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        {room.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {room.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {room.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {room.memberCount.toLocaleString()} members
                      </div>
                      <Link
                        href={`/community/room/${room.id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                      >
                        Join Room
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Trending Topics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {topic.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          {topic.category}
                        </span>
                        <span>{topic.posts} posts</span>
                      </div>
                    </div>
                    <Link
                      href={`/community/topic/${topic.id}`}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Create a Community Room
              </h2>

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="roomName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Room Name *
                  </label>
                  <input
                    id="roomName"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter room name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roomDescription"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="roomDescription"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                    placeholder="Describe what your room is about..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="roomCategory"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="roomCategory"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  >
                    <option value="">Select a category</option>
                    <option value="gaming">Gaming</option>
                    <option value="music">Music</option>
                    <option value="technology">Technology</option>
                    <option value="fitness">Fitness</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Room Privacy
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        defaultChecked
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
                      />
                      <div className="ml-3">
                        <div className="text-white font-medium">Public</div>
                        <div className="text-gray-400 text-sm">
                          Anyone can join and view
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
                      />
                      <div className="ml-3">
                        <div className="text-white font-medium">Private</div>
                        <div className="text-gray-400 text-sm">
                          Invite-only access
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium"
                >
                  Create Room
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function CreatePage() {
  const contentTypes = [
    {
      title: 'Upload Image',
      description: 'Share your photos and artwork with the community',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/upload/image',
      color: 'from-purple-600 to-pink-600',
      available: true,
    },
    {
      title: 'Upload Video',
      description: 'Upload and share your videos with the world',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      ),
      href: '/upload/video',
      color: 'from-blue-600 to-purple-600',
      available: true,
    },
    {
      title: 'Upload Music',
      description: 'Share your music tracks and audio content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      href: '/upload/music',
      color: 'from-green-600 to-blue-600',
      available: false,
    },
    {
      title: 'Go Live',
      description: 'Start a live broadcast to connect with your audience',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      href: '/go-live',
      color: 'from-red-600 to-pink-600',
      available: false,
    },
    {
      title: 'Write Article',
      description: 'Share your thoughts and insights through written content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      href: '/create/article',
      color: 'from-yellow-600 to-red-600',
      available: false,
    },
    {
      title: 'Create Collection',
      description: 'Curate and organize content into themed collections',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: '/create/collection',
      color: 'from-indigo-600 to-purple-600',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">AYINEL</h1>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Create Content</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Share your creativity with the world. Choose what type of content you want to create and start building your audience.
          </p>
        </div>

        {/* Content Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contentTypes.map((type, index) => (
            <div key={index} className="relative group">
              {type.available ? (
                <Link href={type.href}>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-all duration-300`}>
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{type.title}</h3>
                    <p className="text-gray-400 text-sm">{type.description}</p>
                    <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
                      Get started
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 cursor-not-allowed opacity-60">
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center text-white mb-4 opacity-50`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                  <div className="mt-4 flex items-center text-gray-600 text-sm">
                    Coming Soon
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard" className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <div>
                <p className="text-white font-medium">Dashboard</p>
                <p className="text-gray-400 text-sm">View your content and analytics</p>
              </div>
            </Link>
            <Link href="/studio" className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p className="text-white font-medium">Your Studio</p>
                <p className="text-gray-400 text-sm">Manage your creator studio</p>
              </div>
            </Link>
            <Link href="/library" className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <p className="text-white font-medium">Your Library</p>
                <p className="text-gray-400 text-sm">Browse your saved content</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

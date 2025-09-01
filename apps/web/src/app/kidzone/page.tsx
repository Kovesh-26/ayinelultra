'use client';

import React, { useState } from 'react';


export default function KidZonePage() {
  const [selectedAge, setSelectedAge] = useState('5-8');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showParentalControls, setShowParentalControls] = useState(false);

  const ageGroups = [
    { id: '2-4', name: 'Toddlers (2-4)', color: 'bg-pink-500' },
    { id: '5-8', name: 'Kids (5-8)', color: 'bg-blue-500' },
    { id: '9-12', name: 'Pre-teens (9-12)', color: 'bg-green-500' },
  ];

  const categories = [
    { id: 'all', name: 'All Content', icon: '🌟' },
    { id: 'educational', name: 'Educational', icon: '📚' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'games', name: 'Games', icon: '🎮' },
    { id: 'art', name: 'Art & Crafts', icon: '🎨' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
  ];

  const videos = [
    {
      id: 1,
      title: "Fun with Colors - Learning for Kids",
      creator: "Happy Learning",
      thumbnail: "https://via.placeholder.com/320x180/ff6b6b/ffffff?text=Colors",
      duration: "8:32",
      views: "12K",
      ageGroup: "5-8",
      category: "educational",
      rating: "G"
    },
    {
      id: 2,
      title: "Animal Sounds - Educational Video",
      creator: "Kids World",
      thumbnail: "https://via.placeholder.com/320x180/4ecdc4/ffffff?text=Animals",
      duration: "6:15",
      views: "8K",
      ageGroup: "2-4",
      category: "educational",
      rating: "G"
    },
    {
      id: 3,
      title: "Easy Drawing Tutorial for Kids",
      creator: "Art for Kids",
      thumbnail: "https://via.placeholder.com/320x180/45b7d1/ffffff?text=Drawing",
      duration: "12:45",
      views: "15K",
      ageGroup: "9-12",
      category: "art",
      rating: "G"
    },
    {
      id: 4,
      title: "Fun Science Experiments",
      creator: "Science Kids",
      thumbnail: "https://via.placeholder.com/320x180/96ceb4/ffffff?text=Science",
      duration: "10:20",
      views: "20K",
      ageGroup: "9-12",
      category: "science",
      rating: "G"
    },
    {
      id: 5,
      title: "Nursery Rhymes Collection",
      creator: "Music Time",
      thumbnail: "https://via.placeholder.com/320x180/ffeaa7/ffffff?text=Music",
      duration: "15:30",
      views: "25K",
      ageGroup: "2-4",
      category: "music",
      rating: "G"
    },
    {
      id: 6,
      title: "Outdoor Adventure Stories",
      creator: "Nature Kids",
      thumbnail: "https://via.placeholder.com/320x180/55a3ff/ffffff?text=Nature",
      duration: "18:45",
      views: "10K",
      ageGroup: "5-8",
      category: "nature",
      rating: "G"
    }
  ];

  const filteredVideos = videos.filter(video => {
    const ageMatch = selectedAge === 'all' || video.ageGroup === selectedAge;
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
    return ageMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🌟</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">KidZone</h1>
                <p className="text-gray-600">Safe, fun content for kids</p>
              </div>
            </div>
            <button
              onClick={() => setShowParentalControls(!showParentalControls)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Parental Controls</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parental Controls Modal */}
      {showParentalControls && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Parental Controls</h3>
              <button
                onClick={() => setShowParentalControls(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set PIN Code
                </label>
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Time Limit
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>No limit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Restrictions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Block music videos</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Block gaming content</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Educational content only</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowParentalControls(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Group Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Group</h3>
              <div className="flex space-x-3">
                {ageGroups.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedAge === age.id
                        ? `${age.color} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {age.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Kid-Safe Content</h3>
              <p className="text-sm text-blue-700 mt-1">
                All content in KidZone is carefully curated and filtered to ensure it&apos;s appropriate for children. 
                Our content is regularly reviewed and updated to maintain the highest safety standards.
              </p>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                  {video.rating}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{video.creator}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{video.views} views</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {video.ageGroup}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more content.</p>
          </div>
        )}

        {/* Featured Activities */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg p-6 text-white">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Art & Crafts</h3>
              <p className="text-pink-100 mb-4">Fun and creative activities for kids</p>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition">
                Explore
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg p-6 text-white">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">Science Experiments</h3>
              <p className="text-blue-100 mb-4">Learn through hands-on experiments</p>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition">
                Explore
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg p-6 text-white">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-2">Nature & Outdoors</h3>
              <p className="text-green-100 mb-4">Discover the world around us</p>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

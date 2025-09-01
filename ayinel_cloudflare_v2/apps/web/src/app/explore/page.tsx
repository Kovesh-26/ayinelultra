'use client';

import Link from 'next/link';

export default function ExplorePage() {
  const featuredContent = [
    {
      id: 1,
      title: "Building a Next-Gen Studio on Ayinel",
      creator: "Ayinel Labs",
      views: "128K",
      duration: "12:45",
      thumbnail: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Ayinel+Studio",
      category: "Tech"
    },
    {
      id: 2,
      title: "Live Coding: Realtime Chat with Durable Objects",
      creator: "Edge Dev",
      views: "3.2K",
      duration: "LIVE",
      thumbnail: "https://via.placeholder.com/320x180/ef4444/ffffff?text=Live+Coding",
      category: "Tech"
    },
    {
      id: 3,
      title: "Gaming Stream: Latest Updates",
      creator: "GameMaster",
      views: "45K",
      duration: "1:23:45",
      thumbnail: "https://via.placeholder.com/320x180/10b981/ffffff?text=Gaming",
      category: "Gaming"
    }
  ];

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
              <Link href="/explore" className="text-purple-400 font-medium">Explore</Link>
              <Link href="/trending" className="text-gray-300 hover:text-white">Trending</Link>
              <Link href="/live" className="text-gray-300 hover:text-white">Live</Link>
              <Link href="/studio/create" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Create
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Explore Content</h1>
        
        {/* Featured Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.map((content) => (
            <div key={content.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
              <div className="relative">
                <img 
                  src={content.thumbnail} 
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {content.duration}
                </div>
                {content.duration === "LIVE" && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                    LIVE
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{content.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{content.creator}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{content.views} views</span>
                  <span className="text-purple-400 text-sm">{content.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {['Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy'].map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
              >
                <div className="text-white font-medium">{category}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

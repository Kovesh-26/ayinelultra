'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const handleStartWatching = () => {
    router.push('/explore');
  };

  const handleCreate = () => {
    router.push('/studio/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-white mb-4">
                Ayinel
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                Discover amazing content from creators worldwide. Tune-In, Boost, and build your Crew.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2.1M</div>
                <div className="text-purple-200">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1.2K</div>
                <div className="text-purple-200">Live Streams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">45.2B</div>
                <div className="text-purple-200">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">45K</div>
                <div className="text-purple-200">Creators</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartWatching}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Watching
              </button>
              <button
                onClick={handleCreate}
                className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-white hover:text-purple-900 transform hover:scale-105"
              >
                Create
              </button>
            </div>

            {/* Navigation Links */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-purple-200">
              <Link href="/explore" className="hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/trending" className="hover:text-white transition-colors">
                Trending
              </Link>
              <Link href="/live" className="hover:text-white transition-colors">
                Live
              </Link>
              <Link href="/music" className="hover:text-white transition-colors">
                Music
              </Link>
              <Link href="/videos" className="hover:text-white transition-colors">
                Videos
              </Link>
            </div>
          </div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {['Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy'].map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-white font-medium">{category}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

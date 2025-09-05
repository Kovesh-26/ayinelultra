import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studios - Ayinel',
  description: 'Discover amazing studios on Ayinel',
};

export default function StudiosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🎭 Studios
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore creative studios and join their crew
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Studios will be loaded here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-600 h-32 rounded-lg mb-4"></div>
            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Studio discovery coming soon...
        </p>
      </div>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Family-Friendly Studios - Ayinel',
  description: 'Discover family-friendly studios on Ayinel',
};

export default function FamilyFriendlyStudiosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          👨‍👩‍👧‍👦 Family-Friendly Studios
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Safe, educational, and entertaining content for the whole family
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="text-blue-600 dark:text-blue-400 text-2xl mr-3">
            🛡️
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              KidZone Verified
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              All studios on this page are verified as family-friendly and safe for children.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Family-friendly studios will be loaded here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-600 h-32 rounded-lg mb-4 relative">
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                FAMILY
              </div>
            </div>
            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Family-friendly studio discovery coming soon...
        </p>
      </div>
    </div>
  );
}

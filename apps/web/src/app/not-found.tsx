import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <PageHeader
          title="Page Not Found"
          subtitle="The page you're looking for doesn't exist."
        />
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <p className="text-muted-foreground mb-6">
            Oops! The page you&apos;re looking for seems to have wandered off.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go Home
            </Link>
            <Link
              href="/explore"
              className="block w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

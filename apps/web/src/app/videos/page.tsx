'use client';
const categories = ['All', 'Music', 'Gaming', 'Education', 'Comedy'];

export default function VideosPage() {
  return (
    <main className="mx-auto max-w-7xl p-4 space-y-4">
      <header className="flex flex-wrap items-center gap-2 justify-between">
        <h1 className="text-2xl font-semibold">Videos</h1>
        <div className="flex gap-2">
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Search videos…"
          />
          <select className="rounded-xl border px-3 py-2">
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <article key={i} className="rounded-2xl border overflow-hidden">
            <div className="aspect-video bg-zinc-900" />
            <div className="p-3">
              <div className="font-medium line-clamp-2">
                Video Title #{i + 1}
              </div>
              <div className="text-xs opacity-70 mt-1">
                Studio · 12.3K views · 2 days ago
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

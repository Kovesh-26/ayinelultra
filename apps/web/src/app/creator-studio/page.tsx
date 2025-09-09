'use client';

export default function CreatorStudio() {
  return (
    <main className="mx-auto max-w-7xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Studio Dashboard</h1>
        <div className="flex gap-2">
          <button className="rounded-xl border px-3 py-2">Upload</button>
          <button className="rounded-xl border px-3 py-2">Go Live</button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Views (7d)" value="—" />
        <Card title="Watch Time" value="—" />
        <Card title="New Crew" value="—" />
        <Card title="Revenue" value="$0.00" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border p-4 lg:col-span-2">
          <h2 className="font-medium mb-3">Content</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="rounded-xl border p-3">
                <div className="aspect-video rounded-lg bg-zinc-900 mb-2" />
                <div className="font-medium">Video #{i + 1}</div>
                <div className="text-xs opacity-70">
                  Status: Ready · Boosts: —
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="rounded-2xl border p-4">
          <h2 className="font-medium mb-3">Audience Insights</h2>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border p-3">Top Region: —</div>
            <div className="rounded-xl border p-3">Peak Hour: —</div>
            <div className="rounded-xl border p-3">Returning Viewers: —</div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

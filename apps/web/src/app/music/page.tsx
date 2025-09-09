'use client';
import { useState } from 'react';

type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  src?: string;
};

const demo: Track[] = [
  { id: '1', title: 'First Light', artist: 'Ayinel', duration: '3:24' },
  { id: '2', title: 'City Nights', artist: 'Studio Crew', duration: '4:02' },
];

export default function MusicPage() {
  const [current, setCurrent] = useState<Track | null>(demo[0] ?? null);

  return (
    <main className="mx-auto max-w-7xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Music</h1>
        <div className="flex gap-2">
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Search music…"
          />
          <button className="rounded-xl border px-3 py-2">Filters</button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border p-4">
          <div className="aspect-video rounded-xl bg-zinc-950 grid place-items-center text-white">
            <span>Audio Visualizer</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button className="rounded-xl border px-3 py-2">Play</button>
            <button className="rounded-xl border px-3 py-2">Pause</button>
            <button className="rounded-xl border px-3 py-2">Next</button>
            <div className="ml-auto opacity-70 text-sm">
              {current
                ? `${current.title} — ${current.artist}`
                : 'Choose a track'}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border p-4 space-y-3">
          <h2 className="font-medium">Playlist</h2>
          <ul className="space-y-2">
            {demo.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setCurrent(t)}
                  className="w-full rounded-xl border px-3 py-2 text-left hover:bg-zinc-50"
                >
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs opacity-70">
                    {t.artist} · {t.duration}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}

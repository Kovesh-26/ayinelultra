'use client';
import { useState } from 'react';

export default function LivePage() {
  const [isLive, setIsLive] = useState(true);

  return (
    <main className="mx-auto max-w-7xl p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Broadcast</h1>
        <div className="text-sm opacity-70">{isLive ? 'Live' : 'Offline'}</div>
      </header>

      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border p-3">
          {/* Replace with real player (Cloudflare Stream/Mux) */}
          <div className="aspect-video rounded-xl bg-black/80 grid place-items-center text-white">
            <span>Stream Player</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              className="rounded-xl border px-3 py-2"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'End Stream' : 'Go Live'}
            </button>
            <button className="rounded-xl border px-3 py-2">Quality</button>
            <button className="rounded-xl border px-3 py-2">Share</button>
          </div>
        </div>

        <aside className="rounded-2xl border p-3 h-[calc(56.25vw/2)] md:h-auto flex flex-col">
          <h2 className="font-medium mb-2">Live Chat</h2>
          <div className="flex-1 rounded-xl border p-2 overflow-auto space-y-2 text-sm">
            <div className="opacity-70">Welcome to the chat…</div>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-xl border px-3 py-2"
              placeholder="Type a message…"
            />
            <button className="rounded-xl border px-3 py-2">Send</button>
          </div>
        </aside>
      </section>

      <footer className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-3">Viewer Count: 0</div>
        <div className="rounded-xl border p-3">Bitrate: —</div>
        <div className="rounded-xl border p-3">Dropped Frames: —</div>
      </footer>
    </main>
  );
}

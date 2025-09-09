'use client';

import React from 'react';

// --- small atoms -------------------------------------------------------------
function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* inline SVG so we don't depend on /public assets */}
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="ayinelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#ayinelGrad)" opacity="0.2" />
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" fill="url(#ayinelGrad)" opacity="0.45" />
        <circle cx="12" cy="12" r="4" fill="url(#ayinelGrad)" />
        <circle cx="13.5" cy="10.5" r="1.1" fill="#fff" />
      </svg>
      <span className="text-lg font-semibold text-white">Ayinel</span>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#0d141b] border border-white/10 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/80">{icon}</div>
      <div>
        <div className="text-white text-lg font-semibold leading-tight">{value}</div>
        <div className="text-xs text-white/60">{label}</div>
      </div>
    </div>
  );
}

function Tag({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`rounded-full border px-3 py-1 text-sm ${
        active
          ? 'border-white/10 bg-white/20 text-white'
          : 'border-white/10 bg-white/5 text-white/80 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function VideoCard({
  title,
  live,
  duration = '12:45',
}: {
  title: string;
  live?: boolean;
  duration?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="relative h-40 w-full bg-gradient-to-br from-indigo-600/40 to-fuchsia-600/30">
        {live && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            LIVE
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {duration}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-white/10" />
          <div>
            <h3 className="text-white font-medium leading-tight">{title}</h3>
            <div className="text-xs text-white/60">by username</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- header & sidebar --------------------------------------------------------
function TopNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f14]/80 backdrop-blur">
      <Container className="h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden md:block w-80">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <span className="text-white/50">🔎</span>
              <input
                placeholder="Search Ayinel..."
                className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
            Upload
          </button>
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow">
            Create
          </button>
          <div className="ml-2 h-8 w-8 rounded-full bg-white/10" />
        </div>
      </Container>
    </div>
  );
}

function Sidebar() {
  const items: [string, string][] = [
    ['🏠', 'Home'],
    ['🧭', 'Explore'],
    ['🔥', 'Trending'],
    ['🔴', 'Live'],
    ['🎵', 'Music'],
    ['🎬', 'Videos'],
  ];
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <nav className="sticky top-16 space-y-2">
        {items.map(([icon, label], i) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
              i === 0 ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

// --- page --------------------------------------------------------------------
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar />

          <main className="flex-1">
            {/* hero */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-800/50 via-purple-800/40 to-fuchsia-700/40 p-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-400">Ayinel</span>
              </h1>
              <p className="mt-2 text-white/80">
                Discover amazing content from creators worldwide. Tune-In, Boost, and build your Crew.
              </p>

              <div className="mt-5 flex gap-3">
                <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                  Start Watching
                </button>
                <button className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
                  Create
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Stat icon={<span>👥</span>} label="Active Users" value="2.1M" />
                <Stat icon={<span>📡</span>} label="Live Streams" value="1.2K" />
                <Stat icon={<span>📈</span>} label="Total Views" value="45.2B" />
              </div>
            </div>

            {/* categories */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['All', 'Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy', 'News'].map(
                (c, i) => (
                  <Tag key={c} active={i === 0}>
                    {c}
                  </Tag>
                ),
              )}
            </div>

            {/* content grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <VideoCard title="Building a Next-Gen Platform" />
              <VideoCard title="Live Coding: Realtime Chat" live />
              <VideoCard title="Top Creator Moments" />
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
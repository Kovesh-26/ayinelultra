import React from "react";
import {
  Container,
  TopNav,
  Tag,
  VideoCard,
  StatCard
} from '@/components/ayinel';

function Stat({ label, value }: { label: string; value: string }) {
  return <StatCard label={label} value={value} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <nav className="sticky top-16 space-y-2">
              {[
                ["🏠", "Home"],
                ["🧭", "Explore"],
                ["🔥", "Trending"],
                ["🔴", "Live"],
                ["🎵", "Music"],
                ["🎬", "Videos"],
              ].map(([icon, label], i) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-default ${
                    i === 0 ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1">
            {/* Hero */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-800/50 via-purple-800/40 to-fuchsia-700/40 p-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome to <span className="text-indigo-300">Ayinel</span>
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
                <Stat label="Active Users" value="2.1M" />
                <Stat label="Live Streams" value="1.2K" />
                <Stat label="Total Views" value="45.2B" />
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["All","Gaming","Music","Tech","Fitness","Cooking","Travel","Education","Comedy","News"].map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </div>

            {/* Content rows */}
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
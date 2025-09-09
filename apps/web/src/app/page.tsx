'use client';

import React, { useState } from 'react';
import {
  Container,
  Section,
  TopNav,
  Sidebar,
  Grid,
  Tag,
  VideoCard,
  Stat
} from '@/components/ayinel';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy'];

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Home" />
          <main className="flex-1">
            {/* Hero Section */}
            <div className="mb-8 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-800/50 via-purple-800/40 to-fuchsia-700/40 p-8">
              {/* watermark eye */}
              <svg
                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-20"
                width="520"
                height="220"
                viewBox="0 0 520 220"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="heroEye" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <ellipse cx="260" cy="110" rx="240" ry="96" fill="url(#heroEye)" opacity="0.15" />
                <circle cx="260" cy="110" r="48" fill="url(#heroEye)" opacity="0.35" />
                <circle cx="260" cy="110" r="18" fill="url(#heroEye)" />
              </svg>

              <h1 className="text-3xl md:text-4xl font-bold relative">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-400">
                  Ayinel
                </span>
              </h1>
              <p className="mt-2 text-white/80 relative">
                Discover amazing content from creators worldwide. Tune-In, Boost, and build your Crew.
              </p>

              <div className="mt-5 flex gap-3 relative">
                <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                  Start Watching
                </button>
                <button className="rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  Create
                </button>
              </div>

              {/* four stat cards */}
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <Stat icon={<span>👥</span>} label="Active Users" value="2.1M" />
                <Stat icon={<span>📡</span>} label="Live Streams" value="1.2K" />
                <Stat icon={<span>📈</span>} label="Total Views" value="45.2B" />
                <Stat icon={<span>👑</span>} label="Creators" value="45K" />
              </div>
            </div>

            {/* Categories */}
            <Section title="Categories">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Tag 
                    key={category}
                    active={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Tag>
        ))}
      </div>
            </Section>

            {/* Featured Content */}
            <Section title="Featured Content">
              <Grid>
                {[
                  { title: "Building a Next-Gen Studio on Ayinel", badge: "FEATURED" },
                  { title: "Live Coding: Realtime Chat", live: true },
                  { title: "Amazing Guitar Cover - Wonderwall" },
                  { title: "Quick Cooking Tips - 5 Minute Meals" },
                  { title: "Trending: Latest Tech News" },
                  { title: "Gaming: Epic Battle Royale" },
                ].map((video) => (
                  <VideoCard key={video.title} {...video} />
                ))}
              </Grid>
            </Section>

            {/* Quick Links */}
            <Section title="Quick Links">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a href="/explore" className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="text-2xl mb-2">🧭</div>
                  <div className="font-semibold text-white">Explore</div>
                  <div className="text-sm text-white/60">Discover new content</div>
                </a>
                <a href="/trending" className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-semibold text-white">Trending</div>
                  <div className="text-sm text-white/60">See what's popular</div>
                </a>
                <a href="/live" className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="text-2xl mb-2">🔴</div>
                  <div className="font-semibold text-white">Live</div>
                  <div className="text-sm text-white/60">Watch broadcasts</div>
                </a>
                <a href="/music" className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="text-2xl mb-2">🎵</div>
                  <div className="font-semibold text-white">Music</div>
                  <div className="text-sm text-white/60">Listen to collections</div>
                </a>
              </div>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}
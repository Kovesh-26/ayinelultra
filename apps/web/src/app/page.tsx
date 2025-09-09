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
  StatCard,
} from '@/components/ayinel';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const stats = [
    { number: '2.1M', label: 'Active Users', icon: '👥' },
    { number: '1.2K', label: 'Live Streams', icon: '📡' },
    { number: '45.2B', label: 'Total Views', icon: '📊' },
    { number: '45K', label: 'Creators', icon: '👑' },
  ];

  const categories = [
    'Gaming',
    'Music',
    'Tech',
    'Fitness',
    'Cooking',
    'Travel',
    'Education',
    'Comedy',
  ];

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Home" />
          <main className="flex-1">
            {/* Hero Section */}
            <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-800/40 via-purple-800/30 to-fuchsia-700/40 p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Welcome to Ayinel
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Join the creator revolution. It&apos;s time to shine.
                  </p>
                  <div className="flex gap-4">
                    <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-white font-semibold shadow">
                      Start Watching
                    </button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white hover:bg-white/10">
                      Create
                    </button>
                    <a
                      href="/demo"
                      className="rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-6 py-3 text-indigo-300 hover:bg-indigo-500/20"
                    >
                      View UI Demo
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <StatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.number}
                    />
                  ))}
                </div>
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
                  {
                    title: 'Building a Next-Gen Studio on Ayinel',
                    badge: 'FEATURED',
                  },
                  { title: 'Live Coding: Realtime Chat', live: true },
                  { title: 'Amazing Guitar Cover - Wonderwall' },
                  { title: 'Quick Cooking Tips - 5 Minute Meals' },
                  { title: 'Trending: Latest Tech News' },
                  { title: 'Gaming: Epic Battle Royale' },
                ].map((video) => (
                  <VideoCard key={video.title} {...video} />
                ))}
              </Grid>
            </Section>

            {/* Quick Links */}
            <Section title="Quick Links">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/explore"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl mb-2">🧭</div>
                  <div className="font-semibold text-white">Explore</div>
                  <div className="text-sm text-white/60">
                    Discover new content
                  </div>
                </a>
                <a
                  href="/trending"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-semibold text-white">Trending</div>
                  <div className="text-sm text-white/60">
                    See what's popular
                  </div>
                </a>
                <a
                  href="/live"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl mb-2">🔴</div>
                  <div className="font-semibold text-white">Live</div>
                  <div className="text-sm text-white/60">Watch broadcasts</div>
                </a>
                <a
                  href="/music"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl mb-2">🎵</div>
                  <div className="font-semibold text-white">Music</div>
                  <div className="text-sm text-white/60">
                    Listen to collections
                  </div>
                </a>
              </div>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}

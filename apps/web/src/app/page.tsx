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
  StatCard
} from '@/components/ayinel';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const stats = [
    { number: '2.1M', label: 'Active Users', icon: '👥' },
    { number: '1.2K', label: 'Live Streams', icon: '📡' },
    { number: '45.2B', label: 'Total Views', icon: '📊' },
    { number: '45K', label: 'Creators', icon: '👑' }
  ];

  const categories = ['All', 'Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy', 'News'];

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Home" />
          <main className="flex-1">
            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-800/40 via-purple-800/30 to-fuchsia-700/40 p-8">
              {/* Faint Eye Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <svg width="300" height="200" viewBox="0 0 300 200" className="text-white">
                  <ellipse cx="150" cy="100" rx="120" ry="60" fill="none" stroke="currentColor" strokeWidth="3" />
                  <ellipse cx="150" cy="100" rx="60" ry="30" fill="currentColor" opacity="0.3" />
                  <circle cx="150" cy="100" r="15" fill="currentColor" />
                </svg>
              </div>
              
              <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">
                    Welcome to Ayinel
                  </h1>
                  <p className="text-lg text-white/80 mb-6">
                    Discover amazing content from creators worldwide. Tune-In, Boost, and build your Crew.
                  </p>
                  <div className="flex gap-4">
                    <button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
                      Start Watching
                    </button>
                    <button className="rounded-full border border-white/20 bg-black/20 px-8 py-3 text-white hover:bg-black/30 hover:border-white/30 transition-all">
                      Create
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.number} />
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
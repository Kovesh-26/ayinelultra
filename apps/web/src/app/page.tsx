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

  const categories = ['Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy'];

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Home" />
          <main className="flex-1">
            {/* Enhanced Hero Section */}
            <div className="group relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-800/40 via-purple-800/30 to-fuchsia-700/40 p-8 shadow-2xl shadow-indigo-500/20">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20 opacity-50" />
              <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl" />
              
              {/* Floating orbs for visual interest */}
              <div className="absolute top-4 left-4 h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-xl animate-pulse" />
              <div className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 blur-xl animate-pulse" style={{animationDelay: '1s'}} />
              
              <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto]">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">Welcome to Ayinel</h1>
                  <p className="text-lg text-white/80">
                    Join the creator revolution. It&apos;s time to shine.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105">
                      <span className="relative z-10">Start Watching</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                    <button className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg">
                      <span className="relative z-10">Create</span>
                    </button>
                    <a 
                      href="/demo" 
                      className="group relative overflow-hidden rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-6 py-3 text-indigo-300 font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/25"
                    >
                      <span className="relative z-10">View UI Demo</span>
                    </a>
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

            {/* Enhanced Quick Links */}
            <Section title="Quick Links">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <a href="/explore" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">🧭</div>
                    <div className="font-semibold text-white mb-2">Explore</div>
                    <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">Discover new content</div>
                  </div>
                </a>
                <a href="/trending" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">🔥</div>
                    <div className="font-semibold text-white mb-2">Trending</div>
                    <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">See what's popular</div>
                  </div>
                </a>
                <a href="/live" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">🔴</div>
                    <div className="font-semibold text-white mb-2">Live</div>
                    <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">Watch broadcasts</div>
                  </div>
                </a>
                <a href="/music" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">🎵</div>
                    <div className="font-semibold text-white mb-2">Music</div>
                    <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">Listen to collections</div>
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
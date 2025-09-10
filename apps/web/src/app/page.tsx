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

  const categories = ['All', 'Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy'];

  const mockVideos = [
    { title: "Building a Next-Gen Studio on Ayinel", badge: "FEATURED", views: "125K views" },
    { title: "Live Coding: Realtime Chat", live: true, views: "2.3K views" },
    { title: "Amazing Guitar Cover - Wonderwall", views: "45K views" },
    { title: "Quick Cooking Tips - 5 Minute Meals", views: "89K views" },
    { title: "Trending: Latest Tech News", views: "156K views" },
    { title: "Gaming: Epic Battle Royale", views: "234K views" },
    { title: "Art Tutorial: Digital Painting Basics", views: "67K views" },
    { title: "Fitness: 10 Minute Morning Workout", views: "92K views" },
    { title: "Travel Vlog: Amazing Japan Adventure", views: "178K views" },
    { title: "Comedy Sketch: Office Life Parody", views: "203K views" },
    { title: "Music Production: Beat Making 101", views: "78K views" },
    { title: "Tech Review: Latest Smartphones 2024", views: "145K views" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Home" />
          <main className="flex-1 max-w-5xl">
            {/* Enhanced Logo Banner */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-fuchsia-900/60 backdrop-blur-xl relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 animate-pulse"></div>
              <div className="relative p-8 md:p-12">
                {/* Central Logo Banner */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-4xl font-bold shadow-2xl">👁️</div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Welcome to Ayinel
                  </h1>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Join the creator revolution. Discover amazing content, connect with creators, and build your community.
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-white font-semibold shadow-2xl hover:scale-105 transition-transform duration-200">
                      🎬 Start Watching
                    </button>
                    <button className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-white hover:bg-white/20 transition-colors">
                      ✨ Create Content
                    </button>
                    <a 
                      href="/demo" 
                      className="rounded-2xl border border-indigo-500/50 bg-indigo-500/20 backdrop-blur-sm px-8 py-4 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                    >
                      🎨 View UI Demo
                    </a>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <Section title="🎯 Browse Categories">
              <div className="flex flex-wrap gap-3">
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
            <Section title="🌟 Featured Content">
              <Grid>
                {mockVideos.slice(0, 6).map((video, index) => (
                  <VideoCard key={index} {...video} />
                ))}
              </Grid>
            </Section>

            {/* More Videos */}
            <Section title="📺 More Videos">
              <Grid>
                {mockVideos.slice(6).map((video, index) => (
                  <VideoCard key={index + 6} {...video} />
                ))}
              </Grid>
            </Section>

            {/* Enhanced Quick Links */}
            <Section title="🚀 Quick Actions">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a href="/explore" className="group rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6 hover:from-blue-600/30 hover:to-cyan-600/30 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🧭</div>
                  <div className="font-semibold text-white mb-1">Explore</div>
                  <div className="text-sm text-white/60">Discover new content and creators</div>
                </a>
                <a href="/trending" className="group rounded-2xl border border-white/10 bg-gradient-to-br from-red-600/20 to-orange-600/20 p-6 hover:from-red-600/30 hover:to-orange-600/30 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔥</div>
                  <div className="font-semibold text-white mb-1">Trending</div>
                  <div className="text-sm text-white/60">See what's popular right now</div>
                </a>
                <a href="/live" className="group rounded-2xl border border-white/10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔴</div>
                  <div className="font-semibold text-white mb-1">Live</div>
                  <div className="text-sm text-white/60">Watch live broadcasts</div>
                </a>
                <a href="/music" className="group rounded-2xl border border-white/10 bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎵</div>
                  <div className="font-semibold text-white mb-1">Music</div>
                  <div className="text-sm text-white/60">Listen to music collections</div>
                </a>
              </div>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}
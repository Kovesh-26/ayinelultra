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
import { Play, TrendingUp, Users, Eye, Crown, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const stats = [
    { number: '2.1M', label: 'Active Users', icon: Users },
    { number: '1.2K', label: 'Live Streams', icon: Play },
    { number: '45.2B', label: 'Total Views', icon: Eye },
    { number: '45K', label: 'Creators', icon: Crown }
  ];

  const categories = ['All', 'Gaming', 'Music', 'Tech', 'Fitness', 'Cooking', 'Travel', 'Education', 'Comedy'];

  const featuredVideos = [
    { 
      title: "Building a Next-Gen Studio on Ayinel", 
      badge: "FEATURED",
      channel: "TechCreator",
      views: "125K views",
      timeAgo: "3 hours ago",
      thumbnailGradient: "from-emerald-600/60 via-teal-600/40 to-cyan-600/60"
    },
    { 
      title: "Live Coding: Realtime Chat System", 
      live: true,
      channel: "CodeMaster",
      views: "2.3K watching",
      timeAgo: "Live now",
      thumbnailGradient: "from-red-600/60 via-orange-600/40 to-yellow-600/60"
    },
    { 
      title: "Amazing Guitar Cover - Wonderwall",
      channel: "MelodyStudio",
      views: "89K views",
      timeAgo: "1 day ago",
      thumbnailGradient: "from-purple-600/60 via-pink-600/40 to-rose-600/60"
    },
    { 
      title: "Quick Cooking Tips - 5 Minute Meals",
      channel: "ChefLife",
      views: "156K views",
      timeAgo: "2 days ago",
      thumbnailGradient: "from-orange-600/60 via-red-600/40 to-pink-600/60"
    },
    { 
      title: "Trending: Latest Tech News & Reviews",
      channel: "TechDaily",
      views: "67K views",
      timeAgo: "5 hours ago",
      thumbnailGradient: "from-blue-600/60 via-indigo-600/40 to-purple-600/60"
    },
    { 
      title: "Gaming: Epic Battle Royale Highlights",
      channel: "GameZone",
      views: "234K views",
      timeAgo: "6 hours ago",
      thumbnailGradient: "from-violet-600/60 via-purple-600/40 to-fuchsia-600/60"
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <TopNav />
      <Container>
        <div className="flex gap-8 pt-8">
          <Sidebar active="Home" />
          <main className="flex-1 min-w-0">
            {/* Hero Section */}
            <div className="mb-8 card-modern p-8 ayinel-gradient-subtle border-violet-500/20">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-violet-300">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm font-medium">Welcome to the Creator Revolution</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                      Discover Amazing
                      <br />
                      Content on Ayinel
                    </h1>
                    <p className="text-lg text-white/70 max-w-md">
                      Join millions of creators and viewers in the ultimate platform that blends the best of video sharing, live streaming, and social connection.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button className="btn-primary flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Watching
                    </button>
                    <button className="btn-secondary">
                      Explore Studios
                    </button>
                    <a 
                      href="/demo" 
                      className="btn-ghost flex items-center gap-2 border border-violet-500/30"
                    >
                      <Sparkles className="w-4 h-4" />
                      View UI Demo
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="ayinel-glass p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-violet-400">
                        <stat.icon className="w-4 h-4" />
                        <span className="text-xs font-medium text-white/60">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-white">Browse by Category</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Content */}
            <Section title="Trending Now">
              <Grid>
                {featuredVideos.map((video, index) => (
                  <VideoCard key={index} {...video} />
                ))}
              </Grid>
            </Section>

            {/* Quick Actions */}
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a href="/explore" className="group card-modern p-6 hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl">🧭</span>
                  </div>
                  <div className="font-semibold text-white mb-1">Explore</div>
                  <div className="text-sm text-white/60">Discover new content and creators</div>
                </a>
                <a href="/trending" className="group card-modern p-6 hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div className="font-semibold text-white mb-1">Trending</div>
                  <div className="text-sm text-white/60">See what's popular right now</div>
                </a>
                <a href="/live" className="group card-modern p-6 hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl">🔴</span>
                  </div>
                  <div className="font-semibold text-white mb-1">Live</div>
                  <div className="text-sm text-white/60">Watch live broadcasts</div>
                </a>
                <a href="/music" className="group card-modern p-6 hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div className="font-semibold text-white mb-1">Music</div>
                  <div className="text-sm text-white/60">Listen to amazing collections</div>
                </a>
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
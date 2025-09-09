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
  Avatar,
  StatCard,
  PlaylistPlayer,
  PhotoGrid,
  FriendsList,
} from '@/components/ayinel';

// Page Components
function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
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
          <Sidebar active="Explore" />
          <main className="flex-1">
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

            <Section title="Trending Studios">
              <Grid>
                <VideoCard title="TheseInsights" channel="By username" />
                <VideoCard title="Gaming World" channel="By username" />
                <VideoCard title="Daily Vibes" channel="By username" />
              </Grid>
            </Section>

            <Section title="Popular Now">
              <Grid>
                {[
                  { title: 'Beyond the Galaxy', badge: 'BOOSTED' },
                  { title: 'The Future of AI' },
                  { title: 'Epic Adventure' },
                  { title: 'Conversation', live: true },
                  { title: 'Top 10 Gadgets' },
                  { title: 'Travel Tips' },
                ].map((video) => (
                  <VideoCard key={video.title} {...video} />
                ))}
              </Grid>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}

function TrendingPage() {
  const [activeFilter, setActiveFilter] = useState('Videos');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Trending" />
          <main className="flex-1">
            <div className="flex items-center gap-2">
              <Tag
                active={activeFilter === 'Videos'}
                onClick={() => setActiveFilter('Videos')}
              >
                Videos
              </Tag>
              <Tag
                active={activeFilter === 'Flips'}
                onClick={() => setActiveFilter('Flips')}
              >
                Flips
              </Tag>
              <Tag
                active={activeFilter === 'Broadcasts'}
                onClick={() => setActiveFilter('Broadcasts')}
              >
                Broadcasts
              </Tag>
            </div>

            <Section title="Top Boosted Videos">
              <Grid>
                <VideoCard title="Epic Fantasy Battle" badge="BOOSTED" />
                <VideoCard title="Speed Kart Tournament" />
                <VideoCard title="Live Music Performance" />
              </Grid>
            </Section>

            <Section title="Trending Flips">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Avatar label="Clara" sub="19.3K" />
                <Avatar label="Horizon" sub="19.1K" />
                <Avatar label="Wanderlust" sub="12.9K" />
                <Avatar label="Sam Lee" sub="10.4K" />
                <Avatar label="Sern Fei" sub="10.4K" />
              </div>
            </Section>

            <Section title="Trending Broadcasts">
              <Grid>
                <VideoCard title="Live DevOps" live />
                <VideoCard title="Dance Crew" live />
                <VideoCard title="Retro Gaming" live />
              </Grid>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}

function LivePage() {
  const [activeCategory, setActiveCategory] = useState('Gaming');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Live" />
          <main className="flex-1">
            <div className="mb-4 flex items-center gap-2">
              <Tag
                active={activeCategory === 'Gaming'}
                onClick={() => setActiveCategory('Gaming')}
              >
                Gaming
              </Tag>
              <Tag
                active={activeCategory === 'Music'}
                onClick={() => setActiveCategory('Music')}
              >
                Music
              </Tag>
              <Tag
                active={activeCategory === 'Education'}
                onClick={() => setActiveCategory('Education')}
              >
                Education
              </Tag>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <Grid>
                  <VideoCard title="Adventure Stream" live />
                  <VideoCard title="Live Podcast" live />
                  <VideoCard title="Digital Art Design" live />
                  <VideoCard title="The Workout Crew" live />
                </Grid>

                <Section title="Trending Broadcasts">
                  <Grid>
                    <VideoCard title="Night Coding" live />
                    <VideoCard title="Studio Jam" live />
                    <VideoCard title="Street Photography" live />
                  </Grid>
                </Section>
              </div>

              <aside className="sticky top-20 h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Tune‑In
                </h3>
                <div className="space-y-2">
                  {[
                    'Emma: Hello!',
                    'Jason: Amazing view!',
                    'Sofia: Thanks for watching.',
                    'Maya: Great stream! ✨',
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-white/5 p-2 text-sm text-white/80"
                    >
                      {m}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 outline-none"
                    placeholder="Send a message..."
                  />
                  <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                    Boost
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}

function MusicPage() {
  const [activeFilter, setActiveFilter] = useState('Playlists');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Music" />
          <main className="flex-1">
            <div className="mb-4 flex items-center gap-2">
              <Tag
                active={activeFilter === 'Playlists'}
                onClick={() => setActiveFilter('Playlists')}
              >
                Playlists
              </Tag>
              <Tag
                active={activeFilter === 'Collections'}
                onClick={() => setActiveFilter('Collections')}
              >
                Collections
              </Tag>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-700/40 to-indigo-700/30 p-6">
              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <div className="h-40 rounded-xl bg-[url('https://images.unsplash.com/photo-1507878866276-a947ef722fee?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center" />
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Chill Vibes
                  </h2>
                  <p className="text-white/70">Going Home</p>
                  <div className="mt-4">
                    <PlaylistPlayer />
                  </div>
                </div>
              </div>
            </div>

            <Section title="Featured Collections">
              <Grid>
                <VideoCard title="Synthwave" />
                <VideoCard title="Indie Mix" />
                <VideoCard title="Rap Essentials" />
              </Grid>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}

function VideosPage() {
  const [activeFilter, setActiveFilter] = useState('Flips');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Videos" />
          <main className="flex-1">
            <div className="mb-4 flex items-center gap-2">
              <Tag
                active={activeFilter === 'Flips'}
                onClick={() => setActiveFilter('Flips')}
              >
                Flips
              </Tag>
              <Tag
                active={activeFilter === 'Broadcasts'}
                onClick={() => setActiveFilter('Broadcasts')}
              >
                Broadcasts
              </Tag>
              <Tag
                active={activeFilter === 'Collections'}
                onClick={() => setActiveFilter('Collections')}
              >
                Collections
              </Tag>
            </div>

            <Grid>
              <VideoCard title="Flying Cars are Here" />
              <VideoCard title='"LIVE" Performance' live />
              <VideoCard title="Mountain Time" />
              <VideoCard title="Day in the Life" />
              <VideoCard title="My Cute Cat" />
              <VideoCard title="Concert Memories" />
            </Grid>
          </main>
        </div>
      </Container>
    </div>
  );
}

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('Flips');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="pt-6">
          {/* Cover + header */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="h-40 w-full bg-gradient-to-r from-indigo-800/60 via-purple-800/40 to-fuchsia-700/40" />
            <div className="-mt-8 px-6 pb-6">
              <div className="flex items-end gap-4">
                <div className="h-20 w-20 rounded-full border-4 border-[#0a0f14] bg-white/20" />
                <div className="mr-auto">
                  <h1 className="text-2xl font-bold">Emily Johnson</h1>
                  <div className="text-white/70">@emilyj</div>
                </div>
                <div className="flex gap-3">
                  <StatCard label="Crew" value="530" />
                  <StatCard label="Tune‑Ins" value="12K" />
                  <StatCard label="Boosts" value="3.4K" />
                </div>
              </div>
            </div>
          </div>

          {/* About + Music + Photos */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <Section title="About Me">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80">
                  Welcome to my profile! Web developer & designer. Love music,
                  photography, and creative vibes.
                </div>
              </Section>
              <Section title="Music">
                <PlaylistPlayer title="Chill Vibes" />
              </Section>
            </div>

            <div className="space-y-6">
              <Section
                title="Photo Album"
                right={
                  <button className="text-sm text-indigo-300">View All</button>
                }
              >
                <PhotoGrid />
              </Section>
            </div>
          </div>

          {/* Friends */}
          <Section title="Friends">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Avatar label="Sarah" sub="2 mutual friends" />
              <Avatar label="David" sub="2 mutual friends" />
              <Avatar label="Jessica" sub="2 mutual friends" />
              <Avatar label="Alex" sub="2 mutual friends" />
              <Avatar label="James" sub="2 mutual friends" />
              <Avatar label="Maya" sub="2 mutual friends" />
            </div>
          </Section>

          {/* Content tabs */}
          <div className="mt-2">
            <div className="mb-3 flex items-center gap-2">
              <Tag
                active={activeTab === 'Flips'}
                onClick={() => setActiveTab('Flips')}
              >
                Flips
              </Tag>
              <Tag
                active={activeTab === 'Broadcasts'}
                onClick={() => setActiveTab('Broadcasts')}
              >
                Broadcasts
              </Tag>
              <Tag
                active={activeTab === 'Collections'}
                onClick={() => setActiveTab('Collections')}
              >
                Collections
              </Tag>
            </div>
            <Grid>
              <VideoCard title="Behind the Scenes" />
              <VideoCard title="Travel Vlog" />
              <VideoCard title="Night Portraits" />
              <VideoCard title="Studio Session" />
            </Grid>
          </div>
        </div>
      </Container>
    </div>
  );
}

function StudioDashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="grid gap-6 pt-6 lg:grid-cols-[220px_1fr]">
          {/* Studio sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-sm font-semibold text-white/90">
              Studio
            </div>
            <div className="space-y-1">
              {['Dashboard', 'Profile', 'Security', 'Notifications'].map(
                (tab, i) => (
                  <div
                    key={tab}
                    className={`rounded-lg px-3 py-2 text-sm cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                )
              )}
            </div>
          </aside>

          {/* Main */}
          <main>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Free Views" value="5.2K" />
              <StatCard label="Crew" value="332" />
              <StatCard label="Creators" value="120" />
              <StatCard label="Earnings" value="$24K" />
            </div>

            <Section title="Analytics">
              <div className="h-40 w-full rounded-2xl border border-white/10 bg-[linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:24px_24px]">
                {/* placeholder chart area */}
                <div className="p-4 text-white/60">Chart placeholder</div>
              </div>
            </Section>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <Section title="Creations">
                <Grid>
                  <VideoCard title="PC Build, My Setup" />
                  <VideoCard title="Cinematic B‑roll" />
                  <VideoCard title="How I Edit" />
                </Grid>
              </Section>

              <aside>
                <Section title="Crew">
                  <FriendsList />
                </Section>
              </aside>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}

// Demo wrapper
const PAGES = [
  { key: 'Explore', component: ExplorePage },
  { key: 'Trending', component: TrendingPage },
  { key: 'Live', component: LivePage },
  { key: 'Music', component: MusicPage },
  { key: 'Videos', component: VideosPage },
  { key: 'User Profile', component: UserProfilePage },
  { key: 'Studio', component: StudioDashboardPage },
];

export default function AyinelLayoutsDemo() {
  const [view, setView] = useState('Explore');
  const Active = PAGES.find((p) => p.key === view)?.component ?? ExplorePage;

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* quick switcher for preview only */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/70 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => setView(p.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm text-white ${
                view === p.key
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              {p.key}
            </button>
          ))}
        </div>
      </div>

      {/* Render selected page */}
      <Active />

      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/50">
        Ayinel UI mockups • Replace placeholder data with live content • ©{' '}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}

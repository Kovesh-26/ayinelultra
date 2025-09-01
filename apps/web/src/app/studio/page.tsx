'use client';

import React, { useState } from 'react';
import {
  Container,
  Section,
  TopNav,
  Grid,
  VideoCard,
  StatCard,
  FriendsList
} from '@/components/ayinel';

export default function StudioDashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="grid gap-6 pt-6 lg:grid-cols-[220px_1fr]">
          {/* Studio sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-sm font-semibold text-white/90">Studio</div>
            <div className="space-y-1">
              {["Dashboard", "Profile", "Security", "Notifications"].map((tab, i) => (
                <div 
                  key={tab} 
                  className={`rounded-lg px-3 py-2 text-sm cursor-pointer ${
                    activeTab === tab ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
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

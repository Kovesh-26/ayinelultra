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
  Avatar
} from '@/components/ayinel';

export default function TrendingPage() {
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

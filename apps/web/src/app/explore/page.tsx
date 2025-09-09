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
} from '@/components/ayinel';

export default function ExplorePage() {
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

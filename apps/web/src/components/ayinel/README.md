# Ayinel UI Components

A comprehensive set of React components for building the Ayinel platform with a modern, dark theme design.

## Overview

This component library provides all the building blocks needed to create the Ayinel platform UI, featuring:

- **Modern Dark Theme**: Consistent dark color scheme with `#0a0f14` background
- **Ayinel Branding**: Uses brand terminology (Studio, Join, Tune-In, Boost, Crew, Flips, Broadcasts, Collections)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript Support**: Fully typed components with proper interfaces

## Components

### Layout Components

#### `Container`

Responsive container with consistent max-width and padding.

```tsx
import { Container } from '@/components/ayinel';

<Container className="additional-classes">{/* Your content */}</Container>;
```

#### `Section`

Section wrapper with title and optional right-side content.

```tsx
import { Section } from '@/components/ayinel';

<Section title="Section Title" right={<button>Action</button>}>
  {/* Section content */}
</Section>;
```

### Navigation Components

#### `TopNav`

Main navigation bar with Ayinel branding, search, and action buttons.

```tsx
import { TopNav } from '@/components/ayinel';

<TopNav />;
```

#### `Sidebar`

Left sidebar navigation with active state management.

```tsx
import { Sidebar } from '@/components/ayinel';

<Sidebar active="Explore" />;
```

### Content Components

#### `Grid`

Responsive grid layout for content cards.

```tsx
import { Grid } from '@/components/ayinel';

<Grid>{/* Grid items */}</Grid>;
```

#### `VideoCard`

Video content card with thumbnail, title, and metadata.

```tsx
import { VideoCard } from '@/components/ayinel';

<VideoCard
  title="Video Title"
  channel="Creator Name"
  duration="6:28"
  badge="BOOSTED"
  live={true}
  onClick={() => handleClick()}
/>;
```

#### `Avatar`

User avatar component with name and optional metadata.

```tsx
import { Avatar } from '@/components/ayinel';

<Avatar
  label="User Name"
  sub="Additional info"
  onClick={() => handleClick()}
/>;
```

#### `StatCard`

Statistics display card.

```tsx
import { StatCard } from '@/components/ayinel';

<StatCard label="Crew" value="530" />;
```

### Interactive Components

#### `Tag`

Filter/tag component with active states.

```tsx
import { Tag } from '@/components/ayinel';

<Tag active={isActive} onClick={() => handleClick()}>
  Tag Label
</Tag>;
```

#### `PlaylistPlayer`

Music player component with controls.

```tsx
import { PlaylistPlayer } from '@/components/ayinel';

<PlaylistPlayer title="Playlist Name" artist="Artist Name" progress={32} />;
```

### Utility Components

#### `PhotoGrid`

Photo gallery grid layout.

```tsx
import { PhotoGrid } from '@/components/ayinel';

<PhotoGrid count={6} />;
```

#### `FriendsList`

Friends/connections list component.

```tsx
import { FriendsList } from '@/components/ayinel';

<FriendsList friends={['Sarah', 'David', 'Jessica']} />;
```

## Usage Examples

### Basic Page Layout

```tsx
import {
  Container,
  Section,
  TopNav,
  Sidebar,
  Grid,
  VideoCard,
} from '@/components/ayinel';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      <TopNav />
      <Container>
        <div className="flex gap-6 pt-6">
          <Sidebar active="Home" />
          <main className="flex-1">
            <Section title="My Content">
              <Grid>
                <VideoCard title="My Video" />
                <VideoCard title="Another Video" />
              </Grid>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
}
```

### Interactive Filters

```tsx
import { useState } from 'react';
import { Tag } from '@/components/ayinel';

export function FilterExample() {
  const [activeFilter, setActiveFilter] = useState('Videos');

  return (
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
    </div>
  );
}
```

## Brand Terminology

The components use Ayinel's brand terminology throughout:

- **Channel** → **Studio**
- **Subscribe** → **Join**
- **Follow** → **Tune-In**
- **Like** → **Boost**
- **Comment** → **Chat**
- **Playlist** → **Collection**
- **Shorts** → **Flips**
- **Live** → **Broadcast**
- **Subscribers/Members** → **Crew**
- **Recommendations** → **For You Stream**

## Styling

All components use Tailwind CSS classes and follow the Ayinel design system:

- **Background**: `bg-[#0a0f14]` (dark theme)
- **Borders**: `border-white/10` (subtle borders)
- **Cards**: `bg-white/5` (semi-transparent cards)
- **Accents**: Indigo and fuchsia gradients
- **Typography**: White text with opacity variations

## Demo

Visit `/demo` to see all components in action with a page switcher for easy preview.

## Next Steps

1. Replace placeholder data with real API calls
2. Add proper routing and navigation
3. Implement authentication and user management
4. Connect to your backend API
5. Add real video streaming functionality
6. Implement live chat and broadcasting features

# 🎵 MUSIC PLAYER IMPLEMENTATION TODO

## 🎯 Overview
Implement a comprehensive music player with playlists, audio visualization, and music discovery for the Ayinel platform.

## 🔧 Required Endpoints

### 1. Music Library
```typescript
GET /api/v1/music/tracks
{
  "tracks": [
    {
      "id": string,
      "title": string,
      "artist": string,
      "album": string,
      "duration": number,
      "url": string,
      "thumbnailUrl": string,
      "genre": string,
      "releaseDate": string
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number
  }
}
```

### 2. Playlist Management
```typescript
POST /api/v1/music/playlists
{
  "name": string,
  "description": string,
  "isPublic": boolean,
  "tracks": string[] // track IDs
}

GET /api/v1/music/playlists/:id
{
  "id": string,
  "name": string,
  "description": string,
  "isPublic": boolean,
  "tracks": Track[],
  "createdBy": string,
  "createdAt": string
}
```

### 3. Search & Discovery
```typescript
GET /api/v1/music/search?q=:query&type=:type
{
  "tracks": Track[],
  "artists": Artist[],
  "albums": Album[],
  "playlists": Playlist[]
}
```

## 🗄️ Prisma Models Required

```prisma
model MusicTrack {
  id            String   @id @default(cuid())
  title         String
  artist        String
  album         String?
  duration      Int      // seconds
  url           String
  thumbnailUrl  String?
  genre         String?
  releaseDate   DateTime?
  playCount     Int      @default(0)
  isExplicit   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  playlists     PlaylistTrack[]
  userUploads   UserMusicUpload[]

  @@index([title])
  @@index([artist])
  @@index([genre])
}

model Playlist {
  id          String   @id @default(cuid())
  name        String
  description String?
  isPublic    Boolean  @default(true)
  createdBy   String
  coverUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  creator     User     @relation(fields: [createdBy], references: [id], onDelete: Cascade)
  tracks      PlaylistTrack[]

  @@index([createdBy])
  @@index([isPublic])
}

model PlaylistTrack {
  playlistId String
  trackId    String
  order      Int     @default(0)
  addedAt    DateTime @default(now())

  playlist Playlist   @relation(fields: [playlistId], references: [id], onDelete: Cascade)
  track    MusicTrack @relation(fields: [trackId], references: [id], onDelete: Cascade)

  @@id([playlistId, trackId])
  @@index([playlistId])
  @@index([order])
}

model UserMusicUpload {
  id        String   @id @default(cuid())
  userId    String
  trackId   String
  uploadedAt DateTime @default(now())

  user  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  track MusicTrack  @relation(fields: [trackId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([trackId])
}
```

## 🚀 Implementation Steps

1. **Install Dependencies**
   ```bash
   pnpm add howler wavesurfer.js @types/howler
   ```

2. **Create Music Service**
   - `apps/api/src/modules/music/music.service.ts`
   - Handle track management
   - Process playlists
   - Manage music library

3. **Create Music Controller**
   - `apps/api/src/modules/music/music.controller.ts`
   - Expose music endpoints
   - Handle search and discovery

4. **Frontend Integration**
   - Audio player component
   - Playlist management
   - Music visualization

## 🎵 Audio Player Library Choice

### Option 1: Howler.js (Recommended)
```typescript
import { Howl } from 'howler';

const sound = new Howl({
  src: ['audio.mp3'],
  html5: true,
  preload: true
});

// Playback controls
sound.play();
sound.pause();
sound.stop();
sound.volume(0.5);
```

### Option 2: Web Audio API
```typescript
// More control but complex
const audioContext = new AudioContext();
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
```

### Option 3: HTML5 Audio
```typescript
// Simple but limited
const audio = new Audio('audio.mp3');
audio.play();
audio.pause();
```

## 🎨 Audio Visualization

### WaveSurfer.js Integration
```typescript
import WaveSurfer from 'wavesurfer.js';

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  height: 100
});

wavesurfer.load('audio.mp3');
```

## 📱 Playlists from API

```typescript
// Fetch user playlists
const fetchPlaylists = async () => {
  const response = await fetch('/api/v1/music/playlists');
  const playlists = await response.json();
  return playlists;
};

// Create new playlist
const createPlaylist = async (playlistData) => {
  const response = await fetch('/api/v1/music/playlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData)
  });
  return response.json();
};
```

## 🔍 Search Implementation

```typescript
// Search tracks, artists, albums
const searchMusic = async (query: string, type?: string) => {
  const params = new URLSearchParams({ q: query });
  if (type) params.append('type', type);
  
  const response = await fetch(`/api/v1/music/search?${params}`);
  return response.json();
};
```

## 🎯 Features to Implement

1. **Audio Player**
   - Play/pause/stop controls
   - Volume control
   - Progress bar
   - Speed control
   - Equalizer

2. **Playlist Management**
   - Create/edit playlists
   - Add/remove tracks
   - Reorder tracks
   - Share playlists

3. **Music Discovery**
   - Genre-based browsing
   - Artist pages
   - Album collections
   - Trending tracks

4. **User Experience**
   - Audio visualization
   - Background playback
   - Offline support
   - Cross-device sync

## 🔐 Security Considerations

- Validate file uploads
- Rate limit API calls
- User authentication
- Content moderation
- Copyright compliance

## 📊 Analytics

- Play count tracking
- User listening habits
- Popular tracks/artists
- Playlist engagement
- Search analytics

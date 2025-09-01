# 🎥 LIVE BROADCASTING IMPLEMENTATION TODO

## 🎯 Overview
Implement live streaming capabilities with real-time chat, viewer stats, and stream management for the Ayinel platform.

## 🔧 Required Endpoints

### 1. Stream Management
```typescript
POST /api/v1/live/start
{
  "title": string,
  "description": string,
  "visibility": "PUBLIC" | "UNLISTED" | "PRIVATE",
  "quality": "720p" | "1080p" | "4K"
}

Response:
{
  "streamId": string,
  "rtmpUrl": string,
  "streamKey": string,
  "playbackUrl": string
}
```

### 2. Stream Status
```typescript
GET /api/v1/live/status/:streamId
{
  "streamId": string,
  "status": "live" | "offline" | "processing",
  "viewerCount": number,
  "startTime": string,
  "duration": number,
  "quality": string
}
```

### 3. Viewer Analytics
```typescript
GET /api/v1/live/analytics/:streamId
{
  "streamId": string,
  "peakViewers": number,
  "totalViews": number,
  "averageWatchTime": number,
  "topRegions": string[],
  "deviceTypes": object
}
```

## 🗄️ Prisma Models Required

```prisma
model LiveStream {
  id          String   @id @default(cuid())
  streamId    String   @unique
  userId      String
  title       String
  description String?
  status      StreamStatus @default(OFFLINE)
  visibility  Visibility @default(PUBLIC)
  quality     String   @default("720p")
  rtmpUrl     String?
  streamKey   String?
  playbackUrl String?
  startTime   DateTime?
  endTime     DateTime?
  peakViewers Int      @default(0)
  totalViews  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  chatMessages LiveChatMessage[]

  @@index([userId])
  @@index([status])
  @@index([streamId])
}

model LiveChatMessage {
  id         String   @id @default(cuid())
  streamId   String
  userId     String
  message    String
  timestamp  DateTime @default(now())
  isModerated Boolean @default(false)

  stream LiveStream @relation(fields: [streamId], references: [id], onDelete: Cascade)
  user   User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([streamId])
  @@index([timestamp])
}

enum StreamStatus {
  OFFLINE
  LIVE
  PROCESSING
  ENDED
}
```

## 🚀 Implementation Steps

1. **Install Dependencies**
   ```bash
   pnpm add @cloudflare/stream-client socket.io-client
   ```

2. **Create Live Service**
   - `apps/api/src/modules/live/live.service.ts`
   - Handle stream creation and management
   - Process viewer analytics
   - Manage stream lifecycle

3. **Create Live Controller**
   - `apps/api/src/modules/live/live.controller.ts`
   - Expose stream endpoints
   - Handle stream operations

4. **WebSocket Integration**
   - Real-time chat messaging
   - Live viewer count updates
   - Stream status notifications

5. **Frontend Integration**
   - Stream player component
   - Live chat interface
   - Viewer analytics dashboard

## 🔐 Security Considerations

- Validate stream ownership
- Rate limit chat messages
- Moderate inappropriate content
- Secure stream keys
- Prevent stream hijacking

## 📊 Monitoring

- Stream health metrics
- Viewer engagement
- Chat moderation
- Performance analytics
- Error tracking

## 🎯 Player API Integration

### Cloudflare Stream
```typescript
// Frontend integration
import { Player } from '@cloudflare/stream-react';

<Player
  src={playbackUrl}
  controls
  autoplay
  muted
/>
```

### Mux
```typescript
// Frontend integration
import { Player } from '@mux/mux-player-react';

<Player
  playbackId={playbackId}
  metadata={{
    video_title: title,
    player_name: 'Ayinel Player'
  }}
/>
```

## 💬 Chat via WebSocket

```typescript
// WebSocket connection
const socket = io('/live-chat');

socket.on('message', (message) => {
  // Handle incoming chat message
});

socket.emit('send-message', {
  streamId: 'stream-123',
  message: 'Hello everyone!'
});
```

## 📈 Viewer Stats Source

- **Real-time**: WebSocket connections
- **Analytics**: Stream processing events
- **Metrics**: Cloudflare/Mux webhooks
- **Storage**: PostgreSQL for historical data

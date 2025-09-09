# 📹 MEDIA PIPELINE IMPLEMENTATION TODO

## 🎯 Overview

Implement Cloudflare Stream or Mux integration for video uploads, processing, and delivery.

## 🔧 Required Endpoints

### 1. Direct Upload Endpoint

```typescript
POST /api/v1/media/upload/direct
{
  "fileName": string,
  "fileSize": number,
  "mimeType": string,
  "metadata": {
    "title": string,
    "description": string,
    "visibility": "PUBLIC" | "UNLISTED" | "PRIVATE"
  }
}

Response:
{
  "uploadUrl": string,
  "playbackId": string,
  "status": "ready_for_upload"
}
```

### 2. Upload Webhook Handler

```typescript
POST /api/v1/media/webhook/upload-complete
{
  "playbackId": string,
  "status": "ready" | "processing" | "failed",
  "duration": number,
  "thumbnailUrl": string,
  "metadata": object
}
```

### 3. Video Processing Status

```typescript
GET /api/v1/media/status/:playbackId
{
  "playbackId": string,
  "status": "uploading" | "processing" | "ready" | "failed",
  "progress": number,
  "thumbnailUrl": string,
  "duration": number
}
```

## 🗄️ Prisma Models Required

```prisma
model MediaUpload {
  id          String   @id @default(cuid())
  userId      String
  playbackId  String   @unique
  fileName    String
  fileSize    Int
  mimeType    String
  status      MediaStatus @default(UPLOADING)
  progress    Int      @default(0)
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  video Video? @relation(fields: [playbackId], references: [playbackId])

  @@index([userId])
  @@index([status])
}

enum MediaStatus {
  UPLOADING
  PROCESSING
  READY
  FAILED
}
```

## 🚀 Implementation Steps

1. **Install Dependencies**

   ```bash
   pnpm add @cloudflare/stream-client mux
   ```

2. **Create Media Service**
   - `apps/api/src/modules/media/media.service.ts`
   - Handle direct upload creation
   - Process webhooks
   - Update video status

3. **Create Media Controller**
   - `apps/api/src/modules/media/media.controller.ts`
   - Expose upload endpoints
   - Handle webhook verification

4. **Update Video Model**
   - Add `playbackId` field
   - Add `status` field
   - Add `thumbnailUrl` field

5. **Frontend Integration**
   - Upload component with progress
   - Video player integration
   - Status monitoring

## 🔐 Security Considerations

- Validate file types and sizes
- Implement rate limiting
- Verify webhook signatures
- Sanitize metadata
- User authentication required

## 📊 Monitoring

- Upload success/failure rates
- Processing times
- Storage usage
- Error tracking

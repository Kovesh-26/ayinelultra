# Test Image Upload for Copilot Agent

This document describes how to test the new image upload functionality for the copilot agent.

## New Features Added

### 1. Enhanced Message Model
- Added `attachmentUrl` field for image URLs
- Added `attachmentType` field to specify media type
- Added `replyToId` field for message threading
- Changed `content` to `text` field (optional)

### 2. Chat Image Upload
- **Endpoint**: `POST /api/v1/chat/rooms/{roomId}/messages/with-image`
- **Method**: Multipart form upload
- **Fields**:
  - `file`: Image file (JPEG, PNG, GIF, WebP, max 10MB)
  - `text`: Optional caption text
  - `replyToId`: Optional reply reference

### 3. AI Copilot Image Support
- **Endpoint**: `POST /api/v1/ai/ask-with-image`
- **Method**: Multipart form upload
- **Fields**:
  - `image`: Image file
  - `query`: Question/prompt text
  - `context`: Optional context

### 4. Direct Image Upload
- **Endpoint**: `POST /api/v1/uploads/chat/image`
- **Method**: Multipart form upload
- **Returns**: `{ url: "/uploads/chat/filename.jpg" }`

## Testing Steps

### Test 1: Direct Image Upload
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg" \
  http://localhost:3001/api/v1/uploads/chat/image
```

Expected Response:
```json
{
  "url": "/uploads/chat/1234567890-abc123.jpg"
}
```

### Test 2: Send Image in Chat
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg" \
  -F "text=Check out this image!" \
  http://localhost:3001/api/v1/chat/rooms/ROOM_ID/messages/with-image
```

### Test 3: Ask AI with Image
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "query=What can you tell me about this image?" \
  http://localhost:3001/api/v1/ai/ask-with-image
```

Expected Response:
```json
{
  "answer": "I can see you've shared an image with me! While I can't analyze the actual image content yet, I can help you with...",
  "suggestions": [
    "How do I share images in chat?",
    "What image formats are supported?",
    "How do I delete an uploaded image?",
    "Are there size limits for images?"
  ],
  "relatedTutorials": ["image-upload", "chat-features"]
}
```

## Image Processing Features

1. **Automatic Resizing**: Images larger than 1200x1200 are resized
2. **Compression**: JPEG quality set to 85% for optimal file size
3. **Format Support**: JPEG, PNG, GIF, WebP
4. **Size Limits**: Maximum 10MB upload size
5. **Security**: File type validation and secure file names

## Database Changes Required

Before testing, run the database migration:

```sql
-- Add new fields to messages table
ALTER TABLE messages 
ADD COLUMN text TEXT,
ADD COLUMN attachment_url TEXT,
ADD COLUMN attachment_type TEXT,
ADD COLUMN reply_to_id TEXT;

-- Update existing content to text field
UPDATE messages SET text = content WHERE content IS NOT NULL;

-- Drop old content column (optional)
-- ALTER TABLE messages DROP COLUMN content;

-- Add foreign key for replies
ALTER TABLE messages 
ADD CONSTRAINT fk_message_reply 
FOREIGN KEY (reply_to_id) REFERENCES messages(id);
```

## Error Handling

The system handles various error cases:

1. **File Too Large**: Returns 400 with "File size too large" message
2. **Invalid File Type**: Returns 400 with supported formats list
3. **No File Uploaded**: Returns 400 with "No file uploaded" message
4. **Processing Error**: Returns 400 with "Failed to process image upload" message

## Security Considerations

1. **File Type Validation**: Only allows image formats
2. **Size Limits**: Prevents large file uploads
3. **Secure File Names**: Generated names prevent path traversal
4. **Image Processing**: Uses Sharp library for secure image handling
5. **Authentication**: All endpoints require valid JWT tokens
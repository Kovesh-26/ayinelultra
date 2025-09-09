# User Status Feature Documentation

## Overview
The user status feature allows users to set a custom status message (similar to "What are you currently doing?"). This feature adds social engagement by letting users share what they're up to with their followers and friends.

## Implementation Details

### Database Changes
- Added `status` field to the `User` model in Prisma schema
- Field type: `String?` (optional text field)
- Migration: `20240909_add_user_status_field`

### API Endpoints

#### Update User Status
```http
PATCH /users/:id/status
Content-Type: application/json

{
  "status": "Currently working on something awesome! 🚀"
}
```

**Response:**
```json
{
  "id": "user-id",
  "username": "johndoe",
  "displayName": "John Doe",
  "status": "Currently working on something awesome! 🚀",
  "avatarUrl": "https://example.com/avatar.jpg",
  "updatedAt": "2024-09-09T15:30:00.000Z"
}
```

#### Update Full Profile (including status)
```http
PATCH /users/:id
Content-Type: application/json

{
  "displayName": "John Doe",
  "bio": "Creator and developer",
  "status": "Building the future of content creation"
}
```

#### Get User Profile (includes status)
```http
GET /users/:id
```

**Response includes the status field:**
```json
{
  "id": "user-id",
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": "Creator and developer",
  "status": "Building the future of content creation",
  "avatarUrl": "https://example.com/avatar.jpg",
  // ... other user fields
}
```

### Validation Rules

- **Optional**: Status can be null or empty string to clear the status
- **Max Length**: 140 characters (similar to Twitter's character limit)
- **Type**: String
- **Sanitization**: Basic string validation to prevent malicious input

### DTOs Added

1. **UpdateStatusDto** - Dedicated DTO for status-only updates
   - Validates status field with max length constraint
   - Used for the dedicated status endpoint

2. **UpdateProfileDto** - Enhanced to include status field
   - Allows updating status along with other profile fields
   - Maintains backward compatibility

### Service Methods

1. **updateStatus(id: string, dto: UpdateStatusDto)** 
   - Dedicated method for updating just the status
   - Returns minimal user data for efficiency
   - Optimized for real-time status updates

2. **update(id: string, dto: UpdateProfileDto)**
   - Enhanced to support status updates
   - Returns full user profile data
   - Used for comprehensive profile updates

## Usage Examples

### Setting a Status
```bash
curl -X PATCH http://localhost:3001/users/user123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Working on AYINEL features! 🎨"}'
```

### Clearing a Status
```bash
curl -X PATCH http://localhost:3001/users/user123/status \
  -H "Content-Type: application/json" \
  -d '{"status": ""}'
```

### Updating Profile with Status
```bash
curl -X PATCH http://localhost:3001/users/user123 \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "John Creator",
    "bio": "Content creator on AYINEL",
    "status": "Live streaming now! 🔴"
  }'
```

## Frontend Integration Ideas

The status feature can be integrated into the frontend with:

1. **Status Input Field**: Add to user profile editing forms
2. **Status Display**: Show user status in:
   - Profile pages
   - User cards/thumbnails
   - Friend lists
   - Comments/interactions
3. **Quick Status Updates**: Add a quick status update widget in the dashboard
4. **Status History**: Optionally store status history for activity feeds

## Error Handling

- **404 Not Found**: When user ID doesn't exist
- **400 Bad Request**: When status exceeds 140 characters
- **422 Unprocessable Entity**: When validation fails

## Security Considerations

- Status updates should respect user privacy settings
- Consider rate limiting for status updates to prevent spam
- Sanitize status text to prevent XSS attacks
- Validate user permissions before allowing status updates

## Future Enhancements

1. **Status Reactions**: Allow other users to react to statuses
2. **Status Types**: Add predefined status types (Working, Available, Busy, etc.)
3. **Rich Statuses**: Support emojis, mentions, or hashtags
4. **Status Expiration**: Auto-clear statuses after a certain time
5. **Status Privacy**: Control who can see your status
6. **Status Notifications**: Notify followers when status changes

## Testing

The feature includes unit tests for the service layer:
- Status update functionality
- Status clearing functionality
- Error handling scenarios

To run tests:
```bash
npm test -- --testPathPattern=users.service.spec.ts
```

## Migration Notes

When deploying this feature:
1. Apply the database migration to add the status field
2. Restart the API server to load the new code
3. The feature is backward compatible - existing API calls will continue to work
4. Frontend applications can start using the new status endpoints immediately
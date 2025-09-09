# 👤 PROFILE CUSTOMIZATION IMPLEMENTATION TODO

## 🎯 Overview

Implement Myspace-style profile customization with banners, music playlists, friends system, and social features for the Ayinel platform.

## 🔧 Required Endpoints

### 1. Profile Management

```typescript
GET /api/v1/profile/:handle
{
  "profile": {
    "id": string,
    "handle": string,
    "displayName": string,
    "bio": string,
    "avatarUrl": string,
    "bannerUrl": string,
    "customization": {
      "theme": string,
      "layout": string,
      "musicPlaylist": string,
      "wallpaper": string
    },
    "stats": {
      "followerCount": number,
      "followingCount": number,
      "videoCount": number,
      "viewCount": number
    }
  }
}

PUT /api/v1/profile/:handle
{
  "displayName": string,
  "bio": string,
  "customization": {
    "theme": string,
    "layout": string,
    "musicPlaylist": string,
    "wallpaper": string
  }
}
```

### 2. Profile Customization

```typescript
POST /api/v1/profile/:handle/banner
{
  "bannerFile": File,
  "position": "center" | "left" | "right"
}

POST /api/v1/profile/:handle/avatar
{
  "avatarFile": File,
  "crop": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  }
}

POST /api/v1/profile/:handle/music
{
  "playlistId": string,
  "autoPlay": boolean
}
```

### 3. Friends System

```typescript
GET /api/v1/profile/:handle/friends
{
  "friends": [
    {
      "id": string,
      "handle": string,
      "displayName": string,
      "avatarUrl": string,
      "mutualFriends": number,
      "friendshipStatus": "FRIENDS" | "PENDING" | "BLOCKED"
    }
  ]
}

POST /api/v1/profile/:handle/friends
{
  "targetHandle": string,
  "action": "ADD" | "REMOVE" | "BLOCK"
}
```

## 🗄️ Prisma Models Required

```prisma
model UserProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  handle        String   @unique
  displayName   String
  bio           String?
  avatarUrl     String?
  bannerUrl     String?
  wallpaperUrl  String?
  theme         String   @default("default")
  layout        String   @default("standard")
  musicPlaylistId String?
  autoPlayMusic Boolean  @default(false)
  customCSS     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  musicPlaylist Playlist? @relation(fields: [musicPlaylistId], references: [id])
  friends       Friendship[]
  followers     Follow[]
  following     Follow[]

  @@index([handle])
  @@index([displayName])
}

model Friendship {
  id        String           @id @default(cuid())
  userId    String
  friendId  String
  status    FriendshipStatus @default(PENDING)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  user      UserProfile      @relation(fields: [userId], references: [id], onDelete: Cascade)
  friend    UserProfile      @relation(fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
  @@index([userId])
  @@index([friendId])
  @@index([status])
}

model Follow {
  id         String   @id @default(cuid())
  followerId String
  followingId String
  createdAt  DateTime @default(now())

  follower   UserProfile @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  following  UserProfile @relation("following", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model ProfileCustomization {
  id            String   @id @default(cuid())
  userId        String   @unique
  bannerUrl     String?
  bannerPosition string  @default("center")
  avatarUrl     String?
  avatarCrop    Json?
  wallpaperUrl  String?
  theme         String   @default("default")
  layout        String   @default("standard")
  customCSS     String?
  musicPlaylistId String?
  autoPlayMusic Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  musicPlaylist Playlist? @relation(fields: [musicPlaylistId], references: [id])

  @@index([userId])
}

enum FriendshipStatus {
  PENDING
  ACCEPTED
  BLOCKED
  REMOVED
}
```

## 🚀 Implementation Steps

1. **Create Profile Service**
   - `apps/api/src/modules/profile/profile.service.ts`
   - Handle profile customization
   - Manage friends system
   - Process profile updates

2. **Create Profile Controller**
   - `apps/api/src/modules/profile/profile.controller.ts`
   - Expose profile endpoints
   - Handle customization requests

3. **Frontend Integration**
   - Profile editor component
   - Customization panels
   - Friends management
   - Social interactions

## 🎨 Banner Customization

```typescript
// Banner upload and positioning
const BannerCustomizer = () => {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [position, setPosition] = useState<'center' | 'left' | 'right'>('center');
  const [preview, setPreview] = useState<string>('');

  const handleBannerUpload = async () => {
    if (!bannerFile) return;

    const formData = new FormData();
    formData.append('bannerFile', bannerFile);
    formData.append('position', position);

    try {
      const response = await fetch(`/api/v1/profile/${handle}/banner`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Refresh profile data
        router.refresh();
      }
    } catch (error) {
      console.error('Banner upload failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
          className="flex-1"
        />
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value as any)}
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>

      {bannerFile && (
        <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Banner preview"
            className={`w-full h-full object-cover object-${position}`}
          />
        </div>
      )}

      <button
        onClick={handleBannerUpload}
        disabled={!bannerFile}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
      >
        Upload Banner
      </button>
    </div>
  );
};
```

## 🎵 Music Integration

```typescript
// Music playlist selector
const MusicCustomizer = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    // Fetch user's playlists
    fetchPlaylists().then(setPlaylists);
  }, []);

  const handleMusicUpdate = async () => {
    try {
      const response = await fetch(`/api/v1/profile/${handle}/music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistId: selectedPlaylist,
          autoPlay
        })
      });

      if (response.ok) {
        // Update profile
        router.refresh();
      }
    } catch (error) {
      console.error('Music update failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Music Playlist</label>
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">No Music</option>
          {playlists.map(playlist => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoPlay"
          checked={autoPlay}
          onChange={(e) => setAutoPlay(e.target.checked)}
        />
        <label htmlFor="autoPlay">Auto-play music on profile visit</label>
      </div>

      <button
        onClick={handleMusicUpdate}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg"
      >
        Update Music
      </button>
    </div>
  );
};
```

## 👥 Friends System

```typescript
// Friends management component
const FriendsManager = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch friends and pending requests
    fetchFriends().then(setFriends);
    fetchPendingRequests().then(setPendingRequests);
  }, []);

  const handleFriendAction = async (friendId: string, action: string) => {
    try {
      const response = await fetch(`/api/v1/profile/${handle}/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetHandle: friendId, action })
      });

      if (response.ok) {
        // Refresh friends list
        router.refresh();
      }
    } catch (error) {
      console.error('Friend action failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search for new friends */}
      <div>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Pending friend requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Pending Requests</h3>
          <div className="space-y-2">
            {pendingRequests.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{friend.displayName}</div>
                    <div className="text-sm opacity-70">@{friend.handle}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFriendAction(friend.handle, 'ADD')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleFriendAction(friend.handle, 'REMOVE')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current friends */}
      <div>
        <h3 className="font-medium mb-3">Friends ({friends.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {friends.map(friend => (
            <div key={friend.id} className="text-center">
              <img
                src={friend.avatarUrl}
                alt={friend.displayName}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <div className="text-sm font-medium">{friend.displayName}</div>
              <div className="text-xs opacity-70">@{friend.handle}</div>
              <button
                onClick={() => handleFriendAction(friend.handle, 'REMOVE')}
                className="text-xs text-red-500 mt-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## 🎨 Theme Customization

```typescript
// Theme selector component
const ThemeCustomizer = () => {
  const [theme, setTheme] = useState('default');
  const [layout, setLayout] = useState('standard');
  const [customCSS, setCustomCSS] = useState('');

  const themes = [
    { id: 'default', name: 'Default', preview: 'bg-white text-black' },
    { id: 'dark', name: 'Dark Mode', preview: 'bg-gray-900 text-white' },
    { id: 'colorful', name: 'Colorful', preview: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-gray-50 text-gray-900' }
  ];

  const layouts = [
    { id: 'standard', name: 'Standard', description: 'Classic profile layout' },
    { id: 'compact', name: 'Compact', description: 'Space-efficient design' },
    { id: 'featured', name: 'Featured', description: 'Highlight important content' },
    { id: 'grid', name: 'Grid', description: 'Grid-based organization' }
  ];

  const handleThemeUpdate = async () => {
    try {
      const response = await fetch(`/api/v1/profile/${handle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customization: {
            theme,
            layout,
            customCSS
          }
        })
      });

      if (response.ok) {
        // Apply theme changes
        applyTheme(theme, layout, customCSS);
      }
    } catch (error) {
      console.error('Theme update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Theme</label>
        <div className="grid grid-cols-2 gap-3">
          {themes.map(themeOption => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`p-4 rounded-lg border-2 ${
                theme === themeOption.id
                  ? 'border-blue-500'
                  : 'border-gray-200'
              } ${themeOption.preview}`}
            >
              <div className="font-medium">{themeOption.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Layout</label>
        <div className="space-y-2">
          {layouts.map(layoutOption => (
            <button
              key={layoutOption.id}
              onClick={() => setLayout(layoutOption.id)}
              className={`w-full text-left p-3 rounded-lg border ${
                layout === layoutOption.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="font-medium">{layoutOption.name}</div>
              <div className="text-sm opacity-70">{layoutOption.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <div>
        <label className="block text-sm font-medium mb-2">Custom CSS</label>
        <textarea
          value={customCSS}
          onChange={(e) => setCustomCSS(e.target.value)}
          placeholder="Add custom CSS styles..."
          className="w-full h-32 border rounded-lg px-3 py-2 font-mono text-sm"
        />
      </div>

      <button
        onClick={handleThemeUpdate}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Apply Theme
      </button>
    </div>
  );
};
```

## 🔐 Security Considerations

- Validate file uploads (images only)
- Rate limit profile updates
- User authentication required
- Content moderation for custom CSS
- Prevent XSS in custom fields

## 📊 Features to Implement

1. **Profile Customization**
   - Banner and avatar uploads
   - Theme selection
   - Layout options
   - Custom CSS support

2. **Music Integration**
   - Playlist selection
   - Auto-play settings
   - Background music

3. **Friends System**
   - Friend requests
   - Mutual friends
   - Friend management
   - Social interactions

4. **Social Features**
   - Activity feed
   - Status updates
   - Friend suggestions
   - Privacy settings

# 🎬 VIDEO GRID IMPLEMENTATION TODO

## 🎯 Overview

Implement a comprehensive video browsing experience with grid layout, advanced filtering, search, and infinite scroll for the Ayinel platform.

## 🔧 Required Endpoints

### 1. Video Discovery

```typescript
GET /api/v1/videos
{
  "videos": [
    {
      "id": string,
      "title": string,
      "description": string,
      "thumbnailUrl": string,
      "duration": number,
      "viewCount": number,
      "createdAt": string,
      "creator": {
        "id": string,
        "name": string,
        "handle": string,
        "avatarUrl": string
      },
      "category": string,
      "tags": string[]
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "hasMore": boolean
  }
}
```

### 2. Video Search & Filters

```typescript
GET /api/v1/videos/search?q=:query&category=:category&duration=:duration&sort=:sort
{
  "videos": Video[],
  "filters": {
    "categories": string[],
    "durations": string[],
    "sortOptions": string[]
  },
  "pagination": Pagination
}
```

### 3. Video Categories

```typescript
GET /api/v1/videos/categories
{
  "categories": [
    {
      "id": string,
      "name": string,
      "slug": string,
      "description": string,
      "videoCount": number,
      "thumbnailUrl": string
    }
  ]
}
```

## 🗄️ Prisma Models Required

```prisma
model Video {
  id            String   @id @default(cuid())
  title         String
  description   String?
  thumbnailUrl  String?
  duration      Int      // seconds
  viewCount     Int      @default(0)
  likeCount     Int      @default(0)
  categoryId    String?
  tags          String[]
  visibility    Visibility @default(PUBLIC)
  isProcessed   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  creator       User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  creatorId     String
  category      Category? @relation(fields: [categoryId], references: [id])
  likes         VideoLike[]
  comments      VideoComment[]
  views         VideoView[]

  @@index([creatorId])
  @@index([categoryId])
  @@index([visibility])
  @@index([createdAt])
  @@index([viewCount])
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  thumbnailUrl String?
  videoCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  videos      Video[]

  @@index([slug])
}

model VideoView {
  id        String   @id @default(cuid())
  videoId   String
  userId    String?
  ipAddress String?
  userAgent String?
  viewedAt  DateTime @default(now())

  video     Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user      User?    @relation(fields: [userId], references: [id])

  @@index([videoId])
  @@index([viewedAt])
  @@index([userId])
}

model VideoLike {
  id        String   @id @default(cuid())
  videoId   String
  userId    String
  createdAt DateTime @default(now())

  video     Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([videoId, userId])
  @@index([videoId])
  @@index([userId])
}
```

## 🚀 Implementation Steps

1. **Create Video Service**
   - `apps/api/src/modules/videos/video.service.ts`
   - Handle video discovery
   - Process search queries
   - Manage video analytics

2. **Create Video Controller**
   - `apps/api/src/modules/videos/video.controller.ts`
   - Expose video endpoints
   - Handle filtering and search

3. **Frontend Integration**
   - Video grid component
   - Filter sidebar
   - Search functionality
   - Infinite scroll

## 📱 Grid Data Source

```typescript
// Fetch videos with pagination
const fetchVideos = async (page: number = 1, filters?: VideoFilters) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '20',
  });

  if (filters?.category) params.append('category', filters.category);
  if (filters?.duration) params.append('duration', filters.duration);
  if (filters?.sort) params.append('sort', filters.sort);

  const response = await fetch(`/api/v1/videos?${params}`);
  return response.json();
};

// Video filters interface
interface VideoFilters {
  category?: string;
  duration?: string;
  sort?: 'newest' | 'popular' | 'trending';
  tags?: string[];
}
```

## 🔍 Advanced Filters

```typescript
// Filter component
const FilterSidebar = () => {
  const [filters, setFilters] = useState<VideoFilters>({});

  return (
    <aside className="w-64 space-y-4">
      {/* Category Filter */}
      <div>
        <h3 className="font-medium mb-2">Category</h3>
        <select
          value={filters.category || ''}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Duration Filter */}
      <div>
        <h3 className="font-medium mb-2">Duration</h3>
        <select
          value={filters.duration || ''}
          onChange={(e) => setFilters({...filters, duration: e.target.value})}
        >
          <option value="">Any Duration</option>
          <option value="short">Under 4 minutes</option>
          <option value="medium">4-20 minutes</option>
          <option value="long">Over 20 minutes</option>
        </select>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-medium mb-2">Sort By</h3>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => setFilters({...filters, sort: e.target.value})}
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="trending">Trending</option>
        </select>
      </div>
    </aside>
  );
};
```

## ♾️ Infinite Scroll Implementation

```typescript
// Infinite scroll hook
const useInfiniteScroll = (fetchFunction: Function, filters?: VideoFilters) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetchFunction(page, filters);
      const newVideos = response.videos;

      setVideos(prev => [...prev, ...newVideos]);
      setHasMore(response.pagination.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, loading, hasMore, fetchFunction]);

  // Intersection Observer for infinite scroll
  const observerRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.observe(node);
  }, [loading, hasMore, loadMore]);

  return { videos, loading, hasMore, observerRef };
};

// Usage in component
const VideoGrid = () => {
  const { videos, loading, hasMore, observerRef } = useInfiniteScroll(fetchVideos);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} />
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="col-span-full flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && <div ref={observerRef} className="h-4" />}
    </div>
  );
};
```

## 🎨 Video Card Component

```typescript
const VideoCard = ({ video }: { video: Video }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <article className="rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-zinc-900">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium line-clamp-2 text-sm">{video.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={video.creator.avatarUrl}
            alt={video.creator.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs opacity-70">{video.creator.name}</span>
        </div>
        <div className="text-xs opacity-70 mt-1">
          {formatViewCount(video.viewCount)} views · {formatTimeAgo(video.createdAt)}
        </div>
      </div>
    </article>
  );
};
```

## 🔍 Search Implementation

```typescript
// Search with debouncing
const useSearch = (searchFunction: Function, delay: number = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Video[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setSearching(true);
        try {
          const response = await searchFunction(query);
          setResults(response.videos);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setSearching(false);
        }
      } else {
        setResults([]);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, searchFunction, delay]);

  return { query, setQuery, results, searching };
};
```

## 📊 Performance Optimization

1. **Virtual Scrolling**: For large video lists
2. **Image Lazy Loading**: Progressive image loading
3. **Debounced Search**: Reduce API calls
4. **Caching**: Redis for search results
5. **CDN**: Fast thumbnail delivery

## 🎯 Features to Implement

1. **Grid Layout**
   - Responsive grid system
   - Masonry layout option
   - List view toggle

2. **Advanced Filtering**
   - Date range filters
   - Tag-based filtering
   - Creator filtering
   - Quality filters

3. **Search & Discovery**
   - Full-text search
   - Auto-complete
   - Search suggestions
   - Recent searches

4. **User Experience**
   - Keyboard navigation
   - Video preview on hover
   - Quick actions menu
   - Bulk operations

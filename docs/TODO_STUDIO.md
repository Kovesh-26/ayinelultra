# 🎬 CREATOR STUDIO IMPLEMENTATION TODO

## 🎯 Overview

Implement a comprehensive creator dashboard with analytics, content management, upload status tracking, and revenue insights for the Ayinel platform.

## 🔧 Required Endpoints

### 1. Dashboard Analytics

```typescript
GET /api/v1/studio/dashboard
{
  "analytics": {
    "views": {
      "total": number,
      "last7Days": number,
      "last30Days": number,
      "trend": number // percentage change
    },
    "watchTime": {
      "total": number, // minutes
      "average": number,
      "trend": number
    },
    "audience": {
      "totalFollowers": number,
      "newFollowers": number,
      "engagementRate": number
    },
    "revenue": {
      "total": number,
      "thisMonth": number,
      "trend": number
    }
  },
  "recentActivity": Activity[],
  "quickActions": QuickAction[]
}
```

### 2. Content Management

```typescript
GET /api/v1/studio/content
{
  "content": [
    {
      "id": string,
      "title": string,
      "type": "VIDEO" | "LIVE" | "SHORT",
      "status": "PROCESSING" | "READY" | "PUBLISHED" | "FAILED",
      "thumbnailUrl": string,
      "viewCount": number,
      "likeCount": number,
      "createdAt": string,
      "publishedAt": string?,
      "processingProgress": number?,
      "errorMessage": string?
    }
  ],
  "pagination": Pagination
}

POST /api/v1/studio/content/:id/publish
{
  "title": string,
  "description": string,
  "visibility": "PUBLIC" | "UNLISTED" | "PRIVATE",
  "tags": string[],
  "category": string
}
```

### 3. Upload Management

```typescript
POST /api/v1/studio/upload
{
  "file": File,
  "title": string,
  "description": string,
  "category": string,
  "tags": string[]
}

Response:
{
  "uploadId": string,
  "status": "UPLOADING" | "PROCESSING" | "COMPLETED" | "FAILED",
  "progress": number,
  "estimatedTime": number
}

GET /api/v1/studio/upload/:id/status
{
  "uploadId": string,
  "status": UploadStatus,
  "progress": number,
  "currentStep": string,
  "estimatedTime": number,
  "errorMessage": string?
}
```

## 🗄️ Prisma Models Required

```prisma
model CreatorDashboard {
  id            String   @id @default(cuid())
  userId        String   @unique
  totalViews    Int      @default(0)
  totalWatchTime Int     @default(0) // minutes
  totalRevenue  Decimal  @default(0)
  lastUpdated   DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  analytics     CreatorAnalytics[]
  content       CreatorContent[]

  @@index([userId])
}

model CreatorAnalytics {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime
  views         Int      @default(0)
  watchTime     Int      @default(0)
  newFollowers  Int      @default(0)
  revenue       Decimal  @default(0)
  engagementRate Decimal @default(0)

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([date])
}

model CreatorContent {
  id                String        @id @default(cuid())
  userId            String
  title             String
  description       String?
  type              ContentType
  status            ContentStatus @default(DRAFT)
  thumbnailUrl      String?
  viewCount         Int           @default(0)
  likeCount         Int           @default(0)
  commentCount      Int           @default(0)
  shareCount        Int           @default(0)
  processingProgress Int?         @default(0)
  errorMessage      String?
  publishedAt       DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  uploads           ContentUpload[]
  analytics         ContentAnalytics[]

  @@index([userId])
  @@index([status])
  @@index([type])
  @@index([publishedAt])
}

model ContentUpload {
  id              String      @id @default(cuid())
  contentId       String
  fileName        String
  fileSize        Int
  fileType        String
  uploadUrl       String?
  status          UploadStatus @default(PENDING)
  progress        Int         @default(0)
  currentStep     String?
  estimatedTime   Int?        // seconds
  errorMessage    String?
  startedAt       DateTime    @default(now())
  completedAt     DateTime?
  failedAt        DateTime?

  content         CreatorContent @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@index([contentId])
  @@index([status])
}

model ContentAnalytics {
  id            String   @id @default(cuid())
  contentId     String
  date          DateTime
  views         Int      @default(0)
  watchTime     Int      @default(0)
  likes         Int      @default(0)
  comments      Int      @default(0)
  shares        Int      @default(0)
  revenue       Decimal  @default(0)

  content       CreatorContent @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@index([contentId])
  @@index([date])
}

enum ContentType {
  VIDEO
  LIVE
  SHORT
  PODCAST
  ARTICLE
}

enum ContentStatus {
  DRAFT
  PROCESSING
  READY
  PUBLISHED
  FAILED
  ARCHIVED
}

enum UploadStatus {
  PENDING
  UPLOADING
  PROCESSING
  COMPLETED
  FAILED
}
```

## 🚀 Implementation Steps

1. **Create Studio Service**
   - `apps/api/src/modules/studio/studio.service.ts`
   - Handle analytics calculation
   - Manage content lifecycle
   - Process uploads

2. **Create Studio Controller**
   - `apps/api/src/modules/studio/studio.controller.ts`
   - Expose studio endpoints
   - Handle dashboard requests

3. **Frontend Integration**
   - Dashboard components
   - Analytics charts
   - Content management
   - Upload interface

## 📊 Analytics Metrics

```typescript
// Analytics calculation service
class AnalyticsService {
  async calculateCreatorMetrics(
    userId: string,
    timeRange: '7d' | '30d' | '90d'
  ) {
    const startDate = this.getStartDate(timeRange);

    const metrics = await prisma.creatorAnalytics.aggregate({
      where: {
        userId,
        date: { gte: startDate },
      },
      _sum: {
        views: true,
        watchTime: true,
        newFollowers: true,
        revenue: true,
      },
      _avg: {
        engagementRate: true,
      },
    });

    return {
      totalViews: metrics._sum.views || 0,
      totalWatchTime: metrics._sum.watchTime || 0,
      newFollowers: metrics._sum.newFollowers || 0,
      totalRevenue: metrics._sum.revenue || 0,
      averageEngagement: metrics._avg.engagementRate || 0,
    };
  }

  async getTrendingMetrics(userId: string) {
    const currentPeriod = await this.calculateCreatorMetrics(userId, '7d');
    const previousPeriod = await this.calculateCreatorMetrics(
      userId,
      '7d',
      true
    );

    return {
      views: this.calculateTrend(
        currentPeriod.totalViews,
        previousPeriod.totalViews
      ),
      watchTime: this.calculateTrend(
        currentPeriod.totalWatchTime,
        previousPeriod.totalWatchTime
      ),
      followers: this.calculateTrend(
        currentPeriod.newFollowers,
        previousPeriod.newFollowers
      ),
      revenue: this.calculateTrend(
        currentPeriod.totalRevenue,
        previousPeriod.totalRevenue
      ),
    };
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}
```

## 📈 Dashboard Components

```typescript
// Analytics dashboard component
const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchDashboardMetrics(timeRange).then(setMetrics);
  }, [timeRange]);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range as any)}
            className={`px-4 py-2 rounded-lg ${
              timeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Last {range}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Views"
          value={metrics.views.total}
          trend={metrics.views.trend}
          format="number"
        />
        <MetricCard
          title="Watch Time"
          value={metrics.watchTime.total}
          trend={metrics.watchTime.trend}
          format="duration"
        />
        <MetricCard
          title="New Followers"
          value={metrics.audience.newFollowers}
          trend={metrics.audience.trend}
          format="number"
        />
        <MetricCard
          title="Revenue"
          value={metrics.revenue.total}
          trend={metrics.revenue.trend}
          format="currency"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ViewsChart data={metrics.views.chartData} />
        <AudienceChart data={metrics.audience.chartData} />
      </div>
    </div>
  );
};

// Metric card component
const MetricCard = ({ title, value, trend, format }: MetricCardProps) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val);
      case 'duration':
        return `${Math.floor(val / 60)}h ${val % 60}m`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      default:
        return val.toString();
    }
  };

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{formatValue(value)}</div>
      {trend !== undefined && (
        <div className={`text-sm mt-1 ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  );
};
```

## 📤 Upload Status Tracking

```typescript
// Upload status component
const UploadStatus = ({ uploadId }: { uploadId: string }) => {
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/v1/studio/upload/${uploadId}/status`);
        const uploadStatus = await response.json();

        setStatus(uploadStatus);
        setProgress(uploadStatus.progress);

        if (uploadStatus.status === 'PROCESSING' || uploadStatus.status === 'UPLOADING') {
          // Continue polling
          setTimeout(pollStatus, 2000);
        }
      } catch (error) {
        console.error('Failed to fetch upload status:', error);
      }
    };

    pollStatus();
  }, [uploadId]);

  if (!status) return <div>Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'FAILED': return 'text-red-600';
      case 'PROCESSING': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✓';
      case 'FAILED': return '✗';
      case 'PROCESSING': return '⟳';
      default: return '⏳';
    }
  };

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-lg ${getStatusColor(status.status)}`}>
          {getStatusIcon(status.status)}
        </span>
        <div>
          <div className="font-medium">Upload Status</div>
          <div className={`text-sm ${getStatusColor(status.status)}`}>
            {status.currentStep || status.status}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-sm text-gray-600">
        {progress}% complete
        {status.estimatedTime && (
          <span className="ml-2">
            • ~{Math.ceil(status.estimatedTime / 60)} minutes remaining
          </span>
        )}
      </div>

      {status.errorMessage && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">{status.errorMessage}</div>
        </div>
      )}
    </div>
  );
};
```

## 💰 Revenue Insights

```typescript
// Revenue analytics component
const RevenueInsights = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

  useEffect(() => {
    fetchRevenueData().then(setRevenueData);
  }, []);

  if (!revenueData) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Revenue Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-sm opacity-70">This Month</div>
          <div className="text-xl font-semibold">
            ${revenueData.thisMonth.toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm opacity-70">Last Month</div>
          <div className="text-xl font-semibold">
            ${revenueData.lastMonth.toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm opacity-70">Growth</div>
          <div className={`text-xl font-semibold ${
            revenueData.growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {revenueData.growth >= 0 ? '+' : ''}{revenueData.growth.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="rounded-xl border p-4">
        <h3 className="font-medium mb-3">Revenue Sources</h3>
        <div className="space-y-3">
          {revenueData.sources.map(source => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-sm">{source.name}</span>
              </div>
              <div className="text-sm font-medium">
                ${source.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border p-4">
        <h3 className="font-medium mb-3">Revenue Trend</h3>
        <RevenueChart data={revenueData.trend} />
      </div>
    </div>
  );
};
```

## 🔐 Security Considerations

- User authentication required
- Validate file uploads
- Rate limit API calls
- Secure file storage
- Content moderation

## 📊 Features to Implement

1. **Analytics Dashboard**
   - Real-time metrics
   - Trend analysis
   - Performance insights
   - Audience demographics

2. **Content Management**
   - Upload status tracking
   - Content scheduling
   - Bulk operations
   - Content optimization

3. **Revenue Tracking**
   - Payment processing
   - Revenue analytics
   - Payout management
   - Tax reporting

4. **Creator Tools**
   - Thumbnail generator
   - Title optimizer
   - Tag suggestions
   - SEO insights

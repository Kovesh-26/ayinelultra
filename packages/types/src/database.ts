// Database Types for AYINEL Platform

// Re-export Prisma types with aliases to avoid conflicts
export type {
  User as PrismaUser,
  Studio as PrismaStudio,
  Video as PrismaVideo,
  AudioTrack as PrismaAudioTrack,
  LiveStream as PrismaLiveStream,
  Collection as PrismaCollection,
  Comment as PrismaComment,
  Reaction as PrismaReaction,
  Follow as PrismaFollow,
  Message as PrismaMessage,
  Room as PrismaRoom,
  RoomMember as PrismaRoomMember,
  RoomMessage as PrismaRoomMessage,
  Product as PrismaProduct,
  Payment as PrismaPayment,
  Subscription as PrismaSubscription,
  MembershipTier as PrismaMembershipTier,
  Membership as PrismaMembership,
  Tip as PrismaTip,
  Order as PrismaOrder,
  Payout as PrismaPayout,
  Notification as PrismaNotification,
  AIJob as PrismaAIJob,
  ParentalControl as PrismaParentalControl,
} from '@prisma/client';

// Database connection types
export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// Migration types
export interface Migration {
  id: string;
  checksum: string;
  finished_at: string;
  migration_name: string;
  logs?: string;
  rolled_back_at?: string;
  started_at: string;
  applied_steps_count: number;
}

// Query types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  include?: Record<string, boolean>;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Transaction types
export interface TransactionOptions {
  timeout?: number;
  isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
}

// Database event types
export interface DatabaseEvent {
  type: 'create' | 'update' | 'delete';
  table: string;
  recordId: string;
  data?: any;
  timestamp: string;
}

// Backup types
export interface BackupConfig {
  schedule: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
}

export interface BackupResult {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  status: 'success' | 'failed';
  error?: string;
}

// Performance types
export interface QueryPerformance {
  query: string;
  duration: number;
  timestamp: string;
  table?: string;
  operation?: string;
}

export interface DatabaseStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  queryCount: number;
  averageQueryTime: number;
  slowQueries: number;
  uptime: number;
}

// Index types
export interface IndexInfo {
  name: string;
  table: string;
  columns: string[];
  type: string;
  size: number;
  usage: number;
}

// Constraint types
export interface ConstraintInfo {
  name: string;
  table: string;
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK' | 'NOT NULL';
  columns: string[];
  referencedTable?: string;
  referencedColumns?: string[];
}

// Schema types
export interface TableSchema {
  name: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  constraints: ConstraintInfo[];
  rowCount: number;
  size: number;
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  isPrimary: boolean;
  isUnique: boolean;
  isIndexed: boolean;
}

// Replication types
export interface ReplicationConfig {
  enabled: boolean;
  master: DatabaseConfig;
  slaves: DatabaseConfig[];
  lagThreshold: number;
  autoFailover: boolean;
}

export interface ReplicationStatus {
  master: {
    connected: boolean;
    lag: number;
    lastSync: string;
  };
  slaves: Array<{
    id: string;
    connected: boolean;
    lag: number;
    lastSync: string;
    status: 'active' | 'inactive' | 'error';
  }>;
}

// Connection pool types
export interface ConnectionPoolConfig {
  min: number;
  max: number;
  acquireTimeout: number;
  idleTimeout: number;
  reapInterval: number;
}

export interface ConnectionPoolStats {
  total: number;
  idle: number;
  active: number;
  waiting: number;
  max: number;
}

// Database health types
export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    connection: boolean;
    replication: boolean;
    performance: boolean;
    disk: boolean;
  };
  lastCheck: string;
  uptime: number;
  version: string;
}

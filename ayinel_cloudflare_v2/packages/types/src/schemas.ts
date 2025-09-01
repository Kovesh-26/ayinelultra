import { z } from 'zod';

// User schemas
export const UserRoleSchema = z.enum(['user', 'creator', 'admin', 'owner']);
export const UserStatusSchema = z.enum(['active', 'suspended', 'banned']);

export const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  displayName: z.string().min(1).max(50),
  isKid: z.boolean().default(false),
});

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  role: UserRoleSchema.optional(),
  isKid: z.boolean().optional(),
});

// Profile schemas
export const ProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  fonts: z.string().optional(),
  palette: z.string().optional(),
  wallpaperUrl: z.string().url().optional(),
  musicUrl: z.string().url().optional(),
  photoAlbums: z.record(z.any()).optional(),
  links: z.record(z.any()).optional(),
  history: z.record(z.any()).optional(),
});

// Studio schemas
export const CreateStudioSchema = z.object({
  name: z.string().min(1).max(100),
  handle: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  about: z.string().max(1000).optional(),
  bannerUrl: z.string().url().optional(),
});

export const UpdateStudioSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  about: z.string().max(1000).optional(),
  bannerUrl: z.string().url().optional(),
});

// Video schemas
export const VideoVisibilitySchema = z.enum(['public', 'crew', 'private']);
export const VideoStatusSchema = z.enum(['draft', 'processing', 'ready', 'blocked']);

export const CreateVideoSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  visibility: VideoVisibilitySchema.default('public'),
  tags: z.array(z.string()).max(10).optional(),
});

export const UpdateVideoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  visibility: VideoVisibilitySchema.optional(),
  tags: z.array(z.string()).max(10).optional(),
});

// Wallet schemas
export const TransactionTypeSchema = z.enum([
  'purchase',
  'tip',
  'boost',
  'store',
  'membership',
  'payout',
  'bonus',
  'refund'
]);

export const CreateTransactionSchema = z.object({
  type: TransactionTypeSchema,
  amountTokens: z.number().positive(),
  amountUSD: z.number().positive().optional(),
  targetType: z.string().optional(),
  targetId: z.string().optional(),
});

// Store schemas
export const CreateProductSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priceTokens: z.number().positive(),
  mediaUrl: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
});

// Chat schemas
export const ConversationTypeSchema = z.enum(['dm', 'group', 'kid']);
export const MessageSchema = z.object({
  text: z.string().max(1000).optional(),
  mediaUrl: z.string().url().optional(),
});

// KidZone schemas
export const KidProfileSchema = z.object({
  nickName: z.string().min(1).max(30),
  guardianEmail: z.string().email(),
  age: z.number().int().min(0).max(17),
  learningPrefs: z.record(z.any()).optional(),
  safeContacts: z.array(z.string()).optional(),
});

// Admin schemas
export const ReportReasonSchema = z.enum([
  'spam',
  'inappropriate',
  'harassment',
  'copyright',
  'violence',
  'other'
]);

export const CreateReportSchema = z.object({
  targetType: z.string(),
  targetId: z.string(),
  reason: ReportReasonSchema,
  detail: z.string().max(500).optional(),
});

// Feature flags
export const FeatureFlagSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
});

// Token packages
export const TokenPackageSchema = z.object({
  title: z.string().min(1).max(100),
  tokens: z.number().positive(),
  priceUSD: z.number().positive(),
  isActive: z.boolean().default(true),
});

// Export all schemas
export const schemas = {
  user: {
    role: UserRoleSchema,
    status: UserStatusSchema,
    create: CreateUserSchema,
    update: UpdateUserSchema,
  },
  profile: ProfileSchema,
  studio: {
    create: CreateStudioSchema,
    update: UpdateStudioSchema,
  },
  video: {
    visibility: VideoVisibilitySchema,
    status: VideoStatusSchema,
    create: CreateVideoSchema,
    update: UpdateVideoSchema,
  },
  wallet: {
    transactionType: TransactionTypeSchema,
    createTransaction: CreateTransactionSchema,
  },
  store: {
    createProduct: CreateProductSchema,
  },
  chat: {
    conversationType: ConversationTypeSchema,
    message: MessageSchema,
  },
  kidzone: {
    profile: KidProfileSchema,
  },
  admin: {
    reportReason: ReportReasonSchema,
    createReport: CreateReportSchema,
  },
  featureFlag: FeatureFlagSchema,
  tokenPackage: TokenPackageSchema,
};

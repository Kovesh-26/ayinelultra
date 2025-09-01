// Validation Schemas for AYINEL Platform

import { z } from 'zod';

// Base schemas
export const idSchema = z.string().cuid();
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).max(128);
export const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/);
export const handleSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/);
export const urlSchema = z.string().url().optional();

// User schemas
export const createUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  handle: handleSchema,
  displayName: z.string().min(1).max(100),
  password: passwordSchema,
  bio: z.string().max(500).optional(),
  country: z.string().max(100).optional(),
  language: z.string().default('en'),
});

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: urlSchema,
  bannerUrl: urlSchema,
  country: z.string().max(100).optional(),
  language: z.string().optional(),
  theme: z.record(z.any()).optional(),
  musicUrl: urlSchema,
  links: z.record(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Studio schemas
export const createStudioSchema = z.object({
  name: z.string().min(1).max(100),
  handle: handleSchema,
  description: z.string().max(1000).optional(),
});

export const updateStudioSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  logoUrl: urlSchema,
  bannerUrl: urlSchema,
  branding: z.record(z.any()).optional(),
  musicUrl: urlSchema,
  links: z.record(z.string()).optional(),
});

// Video schemas
export const createVideoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  studioId: idSchema,
  rating: z.enum(['GENERAL', 'PG', 'PG13', 'MATURE']).default('GENERAL'),
  kidSafe: z.boolean().default(false),
});

export const updateVideoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  thumbnail: urlSchema,
  status: z.enum(['DRAFT', 'PROCESSING', 'PUBLISHED', 'PRIVATE']).optional(),
  rating: z.enum(['GENERAL', 'PG', 'PG13', 'MATURE']).optional(),
  kidSafe: z.boolean().optional(),
});

// Audio schemas
export const createAudioSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  studioId: idSchema,
  rating: z.enum(['GENERAL', 'PG', 'PG13', 'MATURE']).default('GENERAL'),
  kidSafe: z.boolean().default(false),
});

export const updateAudioSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  artist: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  rating: z.enum(['GENERAL', 'PG', 'PG13', 'MATURE']).optional(),
  kidSafe: z.boolean().optional(),
});

// Live stream schemas
export const createLiveStreamSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  studioId: idSchema,
  scheduledAt: z.date().optional(),
});

export const updateLiveStreamSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['SCHEDULED', 'LIVE', 'ENDED']).optional(),
});

// Collection schemas
export const createCollectionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  studioId: idSchema,
  isPublic: z.boolean().default(true),
});

export const updateCollectionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  thumbnail: urlSchema,
  isPublic: z.boolean().optional(),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  videoId: idSchema.optional(),
  audioTrackId: idSchema.optional(),
  parentId: idSchema.optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

// Reaction schemas
export const createReactionSchema = z.object({
  kind: z.enum(['BOOST', 'LOVE', 'LAUGH', 'WOW', 'SAD', 'ANGRY']),
  videoId: idSchema.optional(),
  audioTrackId: idSchema.optional(),
});

// Follow schemas
export const createFollowSchema = z.object({
  followingId: idSchema.optional(),
  studioId: idSchema.optional(),
});

// Message schemas
export const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  receiverId: idSchema,
  attachments: z.array(z.any()).optional(),
});

// Room schemas
export const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  topic: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
});

export const updateRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  topic: z.string().max(500).optional(),
  isPrivate: z.boolean().optional(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  currency: z.string().default('USD'),
  type: z.enum(['DIGITAL', 'PHYSICAL', 'AFFILIATE']).default('DIGITAL'),
  sku: z.string().max(100).optional(),
  stock: z.number().int().positive().optional(),
  externalLink: urlSchema,
  studioId: idSchema.optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  type: z.enum(['DIGITAL', 'PHYSICAL', 'AFFILIATE']).optional(),
  sku: z.string().max(100).optional(),
  stock: z.number().int().positive().optional(),
  externalLink: urlSchema,
  isActive: z.boolean().optional(),
});

// Payment schemas
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  productId: idSchema.optional(),
  description: z.string().max(200).optional(),
});

// Subscription schemas
export const createSubscriptionSchema = z.object({
  tierId: idSchema,
});

// Tip schemas
export const createTipSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  method: z.enum(['CASHAPP', 'PAYPAL', 'STRIPE']).default('CASHAPP'),
  message: z.string().max(200).optional(),
  toStudioId: idSchema.optional(),
  toUserId: idSchema.optional(),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  type: z.enum(['video', 'audio', 'studio', 'user']).optional(),
  filters: z.record(z.any()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Upload schemas
export const uploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(100),
  fileSize: z.number().positive().max(1073741824), // 1GB max
  purpose: z.enum(['video', 'audio', 'image', 'thumbnail']),
});

// AI Job schemas
export const createAIJobSchema = z.object({
  type: z.enum(['CAPTIONS', 'CHAPTERS', 'THUMBNAILS', 'TITLE_SUGGESTION', 'TAG_GENERATION', 'MODERATION', 'SEMANTIC_SEARCH']),
  input: z.record(z.any()),
});

// Notification schemas
export const createNotificationSchema = z.object({
  type: z.enum(['NEW_FOLLOWER', 'NEW_COMMENT', 'NEW_REACTION', 'NEW_MESSAGE', 'PAYMENT_RECEIVED', 'SUBSCRIPTION_RENEWED', 'SYSTEM_UPDATE']),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  payload: z.record(z.any()).optional(),
  userId: idSchema,
});

// Parental Control schemas
export const createParentalControlSchema = z.object({
  pin: z.string().min(4).max(8),
  allowedRatings: z.array(z.enum(['GENERAL', 'PG', 'PG13', 'MATURE'])),
  timeLimits: z.record(z.any()).optional(),
  blockedTopics: z.array(z.string().max(100)).optional(),
});

export const updateParentalControlSchema = z.object({
  pin: z.string().min(4).max(8).optional(),
  allowedRatings: z.array(z.enum(['GENERAL', 'PG', 'PG13', 'MATURE'])).optional(),
  timeLimits: z.record(z.any()).optional(),
  blockedTopics: z.array(z.string().max(100)).optional(),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Query filter schemas
export const videoFilterSchema = z.object({
  status: z.enum(['DRAFT', 'PROCESSING', 'PUBLISHED', 'PRIVATE']).optional(),
  rating: z.enum(['GENERAL', 'PG', 'PG13', 'MATURE']).optional(),
  kidSafe: z.boolean().optional(),
  studioId: idSchema.optional(),
  creatorId: idSchema.optional(),
  tags: z.array(z.string()).optional(),
  duration: z.object({
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
  }).optional(),
  views: z.object({
    min: z.number().int().positive().optional(),
    max: z.number().int().positive().optional(),
  }).optional(),
  createdAt: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
});

export const studioFilterSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
  isPublic: z.boolean().optional(),
  hasVideos: z.boolean().optional(),
  hasLiveStreams: z.boolean().optional(),
  followerCount: z.object({
    min: z.number().int().positive().optional(),
    max: z.number().int().positive().optional(),
  }).optional(),
});

// Webhook schemas
export const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  timestamp: z.string(),
  signature: z.string().optional(),
});

// Socket message schemas
export const socketMessageSchema = z.object({
  type: z.string(),
  payload: z.any(),
  timestamp: z.string(),
});

// Chat message schemas
export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  attachments: z.array(z.any()).optional(),
});

// Export all schemas
export const schemas = {
  // User
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  login: loginSchema,
  
  // Studio
  createStudio: createStudioSchema,
  updateStudio: updateStudioSchema,
  
  // Video
  createVideo: createVideoSchema,
  updateVideo: updateVideoSchema,
  
  // Audio
  createAudio: createAudioSchema,
  updateAudio: updateAudioSchema,
  
  // Live Stream
  createLiveStream: createLiveStreamSchema,
  updateLiveStream: updateLiveStreamSchema,
  
  // Collection
  createCollection: createCollectionSchema,
  updateCollection: updateCollectionSchema,
  
  // Social
  createComment: createCommentSchema,
  updateComment: updateCommentSchema,
  createReaction: createReactionSchema,
  createFollow: createFollowSchema,
  
  // Messaging
  createMessage: createMessageSchema,
  createRoom: createRoomSchema,
  updateRoom: updateRoomSchema,
  
  // Commerce
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  createPaymentIntent: createPaymentIntentSchema,
  createSubscription: createSubscriptionSchema,
  createTip: createTipSchema,
  
  // Search & Upload
  search: searchSchema,
  uploadUrl: uploadUrlSchema,
  
  // AI & Notifications
  createAIJob: createAIJobSchema,
  createNotification: createNotificationSchema,
  
  // Parental Controls
  createParentalControl: createParentalControlSchema,
  updateParentalControl: updateParentalControlSchema,
  
  // Utilities
  pagination: paginationSchema,
  videoFilter: videoFilterSchema,
  studioFilter: studioFilterSchema,
  webhook: webhookSchema,
  socketMessage: socketMessageSchema,
  chatMessage: chatMessageSchema,
};

// AYINEL Platform Core Types

export interface User {
  id: string;
  email: string;
  username: string;
  handle: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isCreator: boolean;
  isActive: boolean;
  role: UserRole;
  language: string;
  country?: string;
  theme?: Record<string, any>;
  musicUrl?: string;
  links?: Record<string, string>;
  bannerUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Studio {
  id: string;
  name: string;
  handle: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isActive: boolean;
  isPublic: boolean;
  status: StudioStatus;
  branding?: Record<string, any>;
  musicUrl?: string;
  links?: Record<string, string>;
  ownerId: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  thumbnail?: string;
  videoUrl: string;
  duration: number;
  views: number;
  status: VideoStatus;
  isPublished: boolean;
  isLive: boolean;
  kidSafe: boolean;
  rating: ContentRating;
  aiCaptionsUrl?: string;
  aiChapters?: Record<string, any>;
  aiThumbnails: string[];
  studioId: string;
  studio: Studio;
  creatorId: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  description?: string;
  audioUrl: string;
  duration: number;
  plays: number;
  status: AudioStatus;
  isPublished: boolean;
  kidSafe: boolean;
  rating: ContentRating;
  studioId: string;
  studio: Studio;
  creatorId: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  status: LiveStatus;
  rtmpKey?: string;
  playbackId?: string;
  hlsUrl?: string;
  concurrentViewers: number;
  startedAt?: Date;
  endedAt?: Date;
  studioId: string;
  studio: Studio;
  creatorId: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isPublic: boolean;
  studioId: string;
  studio: Studio;
  ownerId: string;
  owner: User;
  videos: Video[];
  audioTracks: AudioTrack[];
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum StudioStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum VideoStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  PUBLISHED = 'PUBLISHED',
  PRIVATE = 'PRIVATE',
  DELETED = 'DELETED',
}

export enum AudioStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  PUBLISHED = 'PUBLISHED',
  PRIVATE = 'PRIVATE',
  DELETED = 'DELETED',
}

export enum LiveStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
}

export enum ContentRating {
  GENERAL = 'GENERAL',
  PG = 'PG',
  PG13 = 'PG13',
  MATURE = 'MATURE',
}

// Social Features
export interface Comment {
  id: string;
  content: string;
  videoId?: string;
  video?: Video;
  audioTrackId?: string;
  audioTrack?: AudioTrack;
  userId: string;
  user: User;
  parentId?: string;
  parent?: Comment;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reaction {
  id: string;
  kind: ReactionKind;
  videoId?: string;
  video?: Video;
  audioTrackId?: string;
  audioTrack?: AudioTrack;
  userId: string;
  user: User;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  follower: User;
  followingId: string;
  following: User;
  studioId?: string;
  studio?: Studio;
  createdAt: Date;
}

export enum ReactionKind {
  BOOST = 'BOOST',
  LOVE = 'LOVE',
  LAUGH = 'LAUGH',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
}

// Messaging & Rooms
export interface Message {
  id: string;
  content: string;
  attachments?: Record<string, any>;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  topic?: string;
  isPrivate: boolean;
  ownerId: string;
  owner: User;
  members: RoomMember[];
  messages: RoomMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomMember {
  id: string;
  role: RoomRole;
  roomId: string;
  room: Room;
  userId: string;
  user: User;
  joinedAt: Date;
}

export interface RoomMessage {
  id: string;
  content: string;
  attachments?: Record<string, any>;
  roomId: string;
  room: Room;
  senderId: string;
  sender: User;
  createdAt: Date;
}

export enum RoomRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

// Monetization
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image?: string;
  type: ProductType;
  sku?: string;
  stock?: number;
  externalLink?: string;
  isActive: boolean;
  studioId?: string;
  studio?: Studio;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  userId: string;
  user: User;
  productId?: string;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  userId: string;
  user: User;
  tierId: string;
  tier: MembershipTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: BillingInterval;
  perks?: Record<string, any>;
  isActive: boolean;
  studioId: string;
  studio: Studio;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  user: User;
  tierId: string;
  tier: MembershipTier;
  joinedAt: Date;
}

export interface Tip {
  id: string;
  amount: number;
  currency: string;
  method: TipMethod;
  message?: string;
  fromUserId: string;
  fromUser: User;
  toStudioId: string;
  toStudio: Studio;
  toUserId?: string;
  toUser?: User;
  createdAt: Date;
}

export interface Order {
  id: string;
  quantity: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  receiptUrl?: string;
  buyerId: string;
  buyer: User;
  productId: string;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  stripeTransferId?: string;
  periodStart: Date;
  periodEnd: Date;
  studioId: string;
  studio: Studio;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductType {
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL',
  AFFILIATE = 'AFFILIATE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
}

export enum BillingInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum TipMethod {
  CASHAPP = 'CASHAPP',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Notifications & AI
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  payload?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  userId: string;
  user: User;
  createdAt: Date;
}

export interface AIJob {
  id: string;
  type: AIJobType;
  status: AIJobStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_COMMENT = 'NEW_COMMENT',
  NEW_REACTION = 'NEW_REACTION',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SUBSCRIPTION_RENEWED = 'SUBSCRIPTION_RENEWED',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
}

export enum AIJobType {
  CAPTIONS = 'CAPTIONS',
  CHAPTERS = 'CHAPTERS',
  THUMBNAILS = 'THUMBNAILS',
  TITLE_SUGGESTION = 'TITLE_SUGGESTION',
  TAG_GENERATION = 'TAG_GENERATION',
  MODERATION = 'MODERATION',
  SEMANTIC_SEARCH = 'SEMANTIC_SEARCH',
}

export enum AIJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// KidZone
export interface ParentalControl {
  id: string;
  pinHash: string;
  allowedRatings: ContentRating[];
  timeLimits?: Record<string, any>;
  blockedTopics: string[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

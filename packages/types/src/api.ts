// API Types for AYINEL Platform

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  handle: string;
  displayName: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

// Studio API Types
export interface CreateStudioRequest {
  name: string;
  handle: string;
  description?: string;
}

export interface UpdateStudioRequest {
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  branding?: Record<string, any>;
}

// Video API Types
export interface CreateVideoRequest {
  title: string;
  description?: string;
  tags?: string[];
  studioId: string;
  rating?: string;
  kidSafe?: boolean;
}

export interface UpdateVideoRequest {
  title?: string;
  description?: string;
  tags?: string[];
  thumbnail?: string;
  status?: string;
  rating?: string;
  kidSafe?: boolean;
}

// Upload API Types
export interface UploadUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  purpose: 'video' | 'audio' | 'image' | 'thumbnail';
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileId: string;
  expiresAt: string;
}

// Social API Types
export interface CreateCommentRequest {
  content: string;
  videoId?: string;
  audioTrackId?: string;
  parentId?: string;
}

export interface CreateReactionRequest {
  kind: string;
  videoId?: string;
  audioTrackId?: string;
}

// Payment API Types
export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  productId?: string;
  description?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// AI API Types
export interface CreateAIJobRequest {
  type: string;
  input: Record<string, any>;
}

export interface AIJobResponse {
  jobId: string;
  status: string;
  estimatedCompletion?: string;
}

// Search API Types
export interface SearchRequest {
  query: string;
  type?: 'video' | 'audio' | 'studio' | 'user';
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

// Notification API Types
export interface CreateNotificationRequest {
  type: string;
  title: string;
  message: string;
  payload?: Record<string, any>;
  userId: string;
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  signature?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Socket.IO Types
export interface SocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  attachments?: any[];
}

// Real-time Types
export interface LiveStreamEvent {
  type: 'start' | 'end' | 'viewer_count' | 'chat_message';
  data: any;
  timestamp: string;
}

export interface NotificationEvent {
  type: string;
  title: string;
  message: string;
  payload?: any;
  timestamp: string;
}

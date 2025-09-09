import { Injectable, Logger } from '@nestjs/common';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests per window
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly store = new Map<string, { count: number; resetTime: number }>();

  constructor() {
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param key - Unique identifier for the rate limit (e.g., IP address, user ID)
   * @param config - Rate limit configuration
   * @returns Rate limit information
   */
  checkRateLimit(key: string, config: RateLimitConfig): RateLimitInfo {
    const now = Date.now();

    // Get or create entry for this key
    let entry = this.store.get(key);
    
    if (!entry || entry.resetTime <= now) {
      // Create new entry or reset expired one
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      };
      this.store.set(key, entry);
    }

    // Increment request count
    entry.count++;

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const reset = new Date(entry.resetTime);
    const retryAfter = entry.count > config.maxRequests ? 
      Math.ceil((entry.resetTime - now) / 1000) : undefined;

    return {
      limit: config.maxRequests,
      remaining,
      reset,
      retryAfter
    };
  }

  /**
   * Check if a request exceeds the rate limit
   * @param key - Unique identifier for the rate limit
   * @param config - Rate limit configuration
   * @returns true if rate limited, false otherwise
   */
  isRateLimited(key: string, config: RateLimitConfig): boolean {
    const info = this.checkRateLimit(key, config);
    return info.remaining === 0 && info.retryAfter !== undefined;
  }

  /**
   * Reset rate limit for a specific key
   * @param key - Unique identifier to reset
   */
  resetRateLimit(key: string): void {
    this.store.delete(key);
    this.logger.log(`Rate limit reset for key: ${key}`);
  }

  /**
   * Get current rate limit status without incrementing
   * @param key - Unique identifier
   * @param config - Rate limit configuration
   * @returns Current rate limit information
   */
  getRateLimitStatus(key: string, config: RateLimitConfig): RateLimitInfo {
    const now = Date.now();
    const entry = this.store.get(key);
    
    if (!entry || entry.resetTime <= now) {
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests,
        reset: new Date(now + config.windowMs)
      };
    }

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const reset = new Date(entry.resetTime);
    const retryAfter = entry.count >= config.maxRequests ? 
      Math.ceil((entry.resetTime - now) / 1000) : undefined;

    return {
      limit: config.maxRequests,
      remaining,
      reset,
      retryAfter
    };
  }

  /**
   * Get statistics about current rate limit state
   */
  getStatistics() {
    const now = Date.now();
    let activeEntries = 0;
    let totalRequests = 0;

    for (const [, entry] of this.store.entries()) {
      if (entry.resetTime > now) {
        activeEntries++;
        totalRequests += entry.count;
      }
    }

    return {
      activeEntries,
      totalRequests,
      totalKeys: this.store.size,
      timestamp: new Date()
    };
  }

  /**
   * Clean up expired entries from the store
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [entryKey, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(entryKey);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired rate limit entries`);
    }
  }
}
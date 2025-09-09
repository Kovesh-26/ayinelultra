import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async handleMuxWebhook(payload: any) {
    this.logger.log('Processing Mux webhook', payload);

    try {
      const { type, data } = payload;

      switch (type) {
        case 'video.asset.ready':
          await this.handleVideoAssetReady(data);
          break;
        case 'video.asset.errored':
          await this.handleVideoAssetErrored(data);
          break;
        case 'video.asset.deleted':
          await this.handleVideoAssetDeleted(data);
          break;
        default:
          this.logger.warn(`Unhandled Mux webhook type: ${type}`);
      }
    } catch (error) {
      this.logger.error('Error processing Mux webhook', error);
      throw error;
    }
  }

  async handleCloudflareStreamWebhook(payload: any) {
    this.logger.log('Processing Cloudflare Stream webhook', payload);

    try {
      const { type, data } = payload;

      switch (type) {
        case 'video.ready':
          await this.handleStreamVideoReady(data);
          break;
        case 'video.error':
          await this.handleStreamVideoError(data);
          break;
        default:
          this.logger.warn(`Unhandled Cloudflare Stream webhook type: ${type}`);
      }
    } catch (error) {
      this.logger.error('Error processing Cloudflare Stream webhook', error);
      throw error;
    }
  }

  async handleStripeWebhook(payload: any) {
    this.logger.log('Processing Stripe webhook', payload);

    try {
      const { type, data } = payload;

      switch (type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(data);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(data);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(data);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(data);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(data);
          break;
        case 'account.updated':
          await this.handleAccountUpdated(data);
          break;
        default:
          this.logger.warn(`Unhandled Stripe webhook type: ${type}`);
      }
    } catch (error) {
      this.logger.error('Error processing Stripe webhook', error);
      throw error;
    }
  }

  private async handleVideoAssetReady(data: any) {
    const { id: assetId, playback_ids, thumbnails } = data;

    // Find video by Mux asset ID
    const video = await this.prisma.video.findFirst({
      where: {
        playbackId: assetId,
      },
    });

    if (!video) {
      this.logger.warn(`Video not found for Mux asset ID: ${assetId}`);
      return;
    }

    // Update video with playback URLs and thumbnails
    const hlsUrl = playback_ids?.find((p: any) => p.policy === 'public')?.id;
    const dashUrl = playback_ids?.find((p: any) => p.policy === 'public')?.id;
    const thumbUrl = thumbnails?.[0]?.url;

    await this.prisma.video.update({
      where: { id: video.id },
      data: {
        hlsUrl: hlsUrl ? `https://stream.mux.com/${hlsUrl}.m3u8` : null,
        dashUrl: dashUrl ? `https://stream.mux.com/${dashUrl}.mpd` : null,
        thumbUrl,
        // Set as published if it was pending
        publishedAt: video.publishedAt || new Date(),
      },
    });

    this.logger.log(`Updated video ${video.id} with Mux URLs`);
  }

  private async handleVideoAssetErrored(data: any) {
    const { id: assetId, errors } = data;

    const video = await this.prisma.video.findFirst({
      where: {
        playbackId: assetId,
      },
    });

    if (!video) {
      this.logger.warn(`Video not found for Mux asset ID: ${assetId}`);
      return;
    }

    // Update video status to indicate error
    await this.prisma.video.update({
      where: { id: video.id },
      data: {
        // You might want to add an error field to the Video model
        // error: JSON.stringify(errors)
      },
    });

    this.logger.error(`Video ${video.id} processing failed:`, errors);
  }

  private async handleVideoAssetDeleted(data: any) {
    const { id: assetId } = data;

    const video = await this.prisma.video.findFirst({
      where: {
        playbackId: assetId,
      },
    });

    if (!video) {
      this.logger.warn(`Video not found for Mux asset ID: ${assetId}`);
      return;
    }

    // Mark video as deleted or update status
    await this.prisma.video.update({
      where: { id: video.id },
      data: {
        // You might want to add a status field
        // status: 'DELETED'
      },
    });

    this.logger.log(`Marked video ${video.id} as deleted`);
  }

  private async handleStreamVideoReady(data: any) {
    const { uid, thumbnail, status } = data;

    const video = await this.prisma.video.findFirst({
      where: {
        playbackId: uid,
      },
    });

    if (!video) {
      this.logger.warn(`Video not found for Cloudflare Stream UID: ${uid}`);
      return;
    }

    await this.prisma.video.update({
      where: { id: video.id },
      data: {
        hlsUrl: `https://customer-${process.env.CF_STREAM_ACCOUNT_ID}.cloudflarestream.com/${uid}/manifest/video.m3u8`,
        dashUrl: `https://customer-${process.env.CF_STREAM_ACCOUNT_ID}.cloudflarestream.com/${uid}/manifest/video.mpd`,
        thumbUrl: thumbnail,
        publishedAt: video.publishedAt || new Date(),
      },
    });

    this.logger.log(`Updated video ${video.id} with Cloudflare Stream URLs`);
  }

  private async handleStreamVideoError(data: any) {
    const { uid, error } = data;

    const video = await this.prisma.video.findFirst({
      where: {
        playbackId: uid,
      },
    });

    if (!video) {
      this.logger.warn(`Video not found for Cloudflare Stream UID: ${uid}`);
      return;
    }

    this.logger.error(`Video ${video.id} processing failed:`, error);
  }

  private async handleSubscriptionCreated(data: any) {
    const { object: subscription } = data;

    // Find user by Stripe customer ID
    const user = await this.prisma.user.findFirst({
      where: {
        // You'll need to add stripeCustomerId field to User model
        // stripeCustomerId: subscription.customer
      },
    });

    if (!user) {
      this.logger.warn(
        `User not found for Stripe customer: ${subscription.customer}`
      );
      return;
    }

    // Create or update subscription record
    // You'll need to add a Subscription model
    this.logger.log(`Subscription created for user ${user.id}`);
  }

  private async handleSubscriptionUpdated(data: any) {
    const { object: subscription } = data;
    this.logger.log(`Subscription updated: ${subscription.id}`);
  }

  private async handleSubscriptionDeleted(data: any) {
    const { object: subscription } = data;
    this.logger.log(`Subscription deleted: ${subscription.id}`);
  }

  private async handlePaymentSucceeded(data: any) {
    const { object: invoice } = data;
    this.logger.log(`Payment succeeded for invoice: ${invoice.id}`);
  }

  private async handlePaymentFailed(data: any) {
    const { object: invoice } = data;
    this.logger.log(`Payment failed for invoice: ${invoice.id}`);
  }

  private async handleAccountUpdated(data: any) {
    const { object: account } = data;
    this.logger.log(`Stripe Connect account updated: ${account.id}`);
  }
}

import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  HttpCode, 
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('mux')
  @HttpCode(HttpStatus.OK)
  async handleMuxWebhook(
    @Body() payload: any,
    @Headers('mux-signature') signature: string
  ) {
    // TODO: Verify Mux webhook signature
    // if (!this.verifyMuxSignature(payload, signature)) {
    //   throw new BadRequestException('Invalid Mux signature');
    // }

    await this.webhooksService.handleMuxWebhook(payload);
    return { received: true };
  }

  @Post('cloudflare-stream')
  @HttpCode(HttpStatus.OK)
  async handleCloudflareStreamWebhook(
    @Body() payload: any,
    @Headers('cf-webhook-signature') signature: string
  ) {
    // TODO: Verify Cloudflare Stream webhook signature
    // if (!this.verifyCloudflareSignature(payload, signature)) {
    //   throw new BadRequestException('Invalid Cloudflare signature');
    // }

    await this.webhooksService.handleCloudflareStreamWebhook(payload);
    return { received: true };
  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string
  ) {
    // TODO: Verify Stripe webhook signature
    // if (!this.verifyStripeSignature(payload, signature)) {
    //   throw new BadRequestException('Invalid Stripe signature');
    // }

    await this.webhooksService.handleStripeWebhook(payload);
    return { received: true };
  }

  // Helper methods for signature verification (implement based on your needs)
  private verifyMuxSignature(payload: any, signature: string): boolean {
    // Implement Mux signature verification
    return true; // Placeholder
  }

  private verifyCloudflareSignature(payload: any, signature: string): boolean {
    // Implement Cloudflare signature verification
    return true; // Placeholder
  }

  private verifyStripeSignature(payload: any, signature: string): boolean {
    // Implement Stripe signature verification
    return true; // Placeholder
  }
}

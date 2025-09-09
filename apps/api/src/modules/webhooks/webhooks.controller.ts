import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  HttpCode, 
  HttpStatus,
  BadRequestException,
  RawBodyRequest,
  Req
} from '@nestjs/common';
import { Request } from 'express';
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
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    const payload = req.rawBody || req.body;
    
    if (!this.webhooksService.verifyStripeSignature(payload, signature)) {
      throw new BadRequestException('Invalid Stripe signature');
    }

    await this.webhooksService.handleStripeWebhook(JSON.parse(payload.toString()));
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

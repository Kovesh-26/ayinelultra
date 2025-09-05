import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { BillingService, CreatePaymentIntentDto, CreateSubscriptionDto } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('payment-intent')
  async createPaymentIntent(@Request() req, @Body() dto: CreatePaymentIntentDto) {
    const userId = req.user.id;
    return this.billingService.createPaymentIntent(dto);
  }

  @Post('subscription')
  async createSubscription(@Request() req, @Body() dto: CreateSubscriptionDto) {
    const userId = req.user.id;
    return this.billingService.createSubscription(dto);
  }

  @Get('payment-methods')
  async getSupportedPaymentMethods() {
    return this.billingService.getSupportedPaymentMethods();
  }

  @Get('payment-methods/:method/config')
  async getPaymentMethodConfig(@Param('method') method: string) {
    return this.billingService.getPaymentMethodConfig(method);
  }

  @Post('webhook/:gateway')
  async handleWebhook(
    @Param('gateway') gateway: string,
    @Body() webhookData: any,
    @Request() req: any
  ) {
    // TODO: Verify webhook signatures for security
    // This endpoint handles webhooks from payment gateways
    
    try {
      switch (gateway) {
        case 'stripe':
          // Handle Stripe webhook
          if (webhookData.type === 'payment_intent.succeeded') {
            return this.billingService.processPaymentConfirmation(
              webhookData.data.object.id,
              'stripe',
              webhookData
            );
          }
          break;

        case 'paypal':
          // Handle PayPal webhook
          if (webhookData.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            return this.billingService.processPaymentConfirmation(
              webhookData.resource.id,
              'paypal',
              webhookData
            );
          }
          break;

        case 'cashapp':
          // Handle Cash App webhook
          if (webhookData.type === 'payment.completed') {
            return this.billingService.processPaymentConfirmation(
              webhookData.payment_id,
              'cashapp',
              webhookData
            );
          }
          break;

        case 'googlepay':
          // Handle Google Pay webhook
          if (webhookData.status === 'SUCCESS') {
            return this.billingService.processPaymentConfirmation(
              webhookData.payment_id,
              'googlepay',
              webhookData
            );
          }
          break;

        case 'applepay':
          // Handle Apple Pay webhook
          if (webhookData.status === 'SUCCESS') {
            return this.billingService.processPaymentConfirmation(
              webhookData.payment_id,
              'applepay',
              webhookData
            );
          }
          break;

        case 'venmo':
          // Handle Venmo webhook
          if (webhookData.status === 'COMPLETED') {
            return this.billingService.processPaymentConfirmation(
              webhookData.payment_id,
              'venmo',
              webhookData
            );
          }
          break;

        default:
          throw new Error(`Unsupported gateway: ${gateway}`);
      }

      return { received: true };
    } catch (error) {
      // Log webhook processing errors
      console.error(`Webhook processing error for ${gateway}:`, error);
      return { error: error.message };
    }
  }

  @Get('customer/:customerId/balance')
  async getCustomerBalance(@Param('customerId') customerId: string) {
    return this.billingService.getCustomerBalance(customerId);
  }

  @Post('payout')
  async processPayout(@Request() req, @Body() payoutData: { amount: number }) {
    const userId = req.user.id;
    return this.billingService.processPayout(userId, payoutData.amount);
  }

  @Get('analytics')
  async getRevenueAnalytics(
    @Request() req,
    @Query('timeRange') timeRange: '7d' | '30d' | '90d' = '30d'
  ) {
    const userId = req.user.id;
    return this.billingService.getRevenueAnalytics(userId, timeRange);
  }
}

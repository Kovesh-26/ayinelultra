# 💳 BILLING & PAYMENT IMPLEMENTATION TODO

## 🎯 Overview
Implement Stripe Connect integration for creator monetization, subscriptions, and payment processing.

## 🔧 Required Endpoints

### 1. Stripe Connect Onboarding
```typescript
POST /api/v1/billing/connect/onboard
{
  "country": string,
  "businessType": "individual" | "company",
  "email": string
}

Response:
{
  "accountId": string,
  "onboardingUrl": string,
  "status": "pending" | "complete"
}
```

### 2. Create Payment Intent
```typescript
POST /api/v1/billing/payment-intent
{
  "amount": number, // cents
  "currency": string,
  "paymentMethodTypes": string[],
  "metadata": {
    "productId": string,
    "userId": string
  }
}

Response:
{
  "clientSecret": string,
  "paymentIntentId": string
}
```

### 3. Create Subscription
```typescript
POST /api/v1/billing/subscriptions
{
  "priceId": string,
  "customerId": string,
  "metadata": {
    "userId": string,
    "planType": string
  }
}

Response:
{
  "subscriptionId": string,
  "status": "active" | "incomplete" | "past_due",
  "currentPeriodEnd": string
}
```

### 4. Webhook Handler
```typescript
POST /api/v1/billing/webhooks/stripe
{
  "type": "payment_intent.succeeded" | "invoice.payment_succeeded" | "customer.subscription.updated",
  "data": {
    "object": object
  }
}
```

## 🗄️ Prisma Models Required

```prisma
model StripeAccount {
  id              String   @id @default(cuid())
  userId          String   @unique
  accountId       String   @unique // Stripe Connect account ID
  chargesEnabled  Boolean  @default(false)
  payoutsEnabled  Boolean  @default(false)
  requirements    Json?    // Stripe requirements object
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments Payment[]
  subscriptions Subscription[]

  @@index([accountId])
}

model Payment {
  id                String   @id @default(cuid())
  userId            String
  stripeAccountId   String?
  paymentIntentId   String   @unique
  amount            Int      // cents
  currency          String   @default("USD")
  status            PaymentStatus @default(PENDING)
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  stripeAccount StripeAccount? @relation(fields: [stripeAccountId], references: [id])

  @@index([userId])
  @@index([status])
}

model Subscription {
  id                String   @id @default(cuid())
  userId            String
  stripeAccountId   String?
  subscriptionId    String   @unique
  priceId           String
  status            SubscriptionStatus @default(ACTIVE)
  currentPeriodEnd  DateTime
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  stripeAccount StripeAccount? @relation(fields: [stripeAccountId], references: [id])

  @@index([userId])
  @@index([status])
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  CANCELLED
}

enum SubscriptionStatus {
  ACTIVE
  INCOMPLETE
  INCOMPLETE_EXPIRED
  PAST_DUE
  CANCELLED
  UNPAID
}
```

## 🚀 Implementation Steps

1. **Install Dependencies**
   ```bash
   pnpm add stripe @types/stripe
   ```

2. **Create Billing Service**
   - `apps/api/src/modules/billing/billing.service.ts`
   - Handle Stripe Connect onboarding
   - Create payment intents
   - Manage subscriptions

3. **Create Billing Controller**
   - `apps/api/src/modules/billing/billing.controller.ts`
   - Expose billing endpoints
   - Handle webhook verification

4. **Create Webhook Handler**
   - `apps/api/src/modules/billing/webhooks.controller.ts`
   - Process Stripe webhooks
   - Update payment/subscription status

5. **Frontend Integration**
   - Payment form with Stripe Elements
   - Subscription management
   - Payment history

## 🔐 Security Considerations

- Verify webhook signatures
- Validate user permissions
- Implement rate limiting
- Sanitize metadata
- Use Stripe test keys in development

## 📊 Monitoring

- Payment success/failure rates
- Subscription churn
- Revenue tracking
- Webhook delivery status
- Error tracking

## 💰 Revenue Models

1. **Creator Subscriptions**
   - Monthly/yearly creator plans
   - Premium features access
   - Revenue sharing

2. **Product Sales**
   - Physical/digital products
   - Commission structure
   - Order fulfillment

3. **Tips & Donations**
   - One-time payments
   - Recurring support
   - Platform fee structure

import { SubscriptionService } from '../billing/SubscriptionService';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;

  beforeEach(() => {
    subscriptionService = new SubscriptionService();
  });

  describe('getTierPricing', () => {
    it('should return correct pricing for STARTER tier', () => {
      const pricing = subscriptionService.getTierPricing('STARTER');

      expect(pricing.tier).toBe('STARTER');
      expect(pricing.monthlyPrice).toBe(49);
      expect(pricing.limits.videosPerMonth).toBe(10);
      expect(pricing.limits.resolution).toBe('1080p');
    });

    it('should return correct pricing for ENTERPRISE tier', () => {
      const pricing = subscriptionService.getTierPricing('ENTERPRISE');

      expect(pricing.tier).toBe('ENTERPRISE');
      expect(pricing.monthlyPrice).toBe(999);
      expect(pricing.limits.videosPerMonth).toBe(-1); // unlimited
      expect(pricing.limits.resolution).toBe('8K');
    });
  });

  describe('createSubscription', () => {
    it('should create subscription with trial when no payment method', async () => {
      const subscription = await subscriptionService.createSubscription(
        'tenant_123',
        'PROFESSIONAL'
      );

      expect(subscription.tenantId).toBe('tenant_123');
      expect(subscription.tier).toBe('PROFESSIONAL');
      expect(subscription.status).toBe('TRIALING');
      expect(subscription.trialEnd).toBeDefined();
      expect(subscription.monthlyPrice).toBe(199);
    });

    it('should create active subscription with payment method', async () => {
      const subscription = await subscriptionService.createSubscription(
        'tenant_456',
        'ENTERPRISE',
        'pm_test123'
      );

      expect(subscription.status).toBe('ACTIVE');
      expect(subscription.stripeSubscriptionId).toBeDefined();
      expect(subscription.trialEnd).toBeUndefined();
    });
  });

  describe('updateSubscriptionTier', () => {
    it('should upgrade subscription tier and update price', async () => {
      const subscription = await subscriptionService.createSubscription(
        'tenant_789',
        'STARTER'
      );

      const updated = await subscriptionService.updateSubscriptionTier(
        subscription.id,
        'PROFESSIONAL'
      );

      expect(updated.tier).toBe('PROFESSIONAL');
      expect(updated.monthlyPrice).toBe(199);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      const subscription = await subscriptionService.createSubscription(
        'tenant_cancel',
        'PROFESSIONAL'
      );

      const canceled = await subscriptionService.cancelSubscription(
        subscription.id,
        false
      );

      expect(canceled.cancelAtPeriodEnd).toBe(true);
      expect(canceled.status).not.toBe('CANCELED');
    });

    it('should cancel subscription immediately', async () => {
      const subscription = await subscriptionService.createSubscription(
        'tenant_cancel_now',
        'PROFESSIONAL'
      );

      const canceled = await subscriptionService.cancelSubscription(
        subscription.id,
        true
      );

      expect(canceled.status).toBe('CANCELED');
    });
  });

  describe('trackUsage', () => {
    it('should track usage metrics', async () => {
      await subscriptionService.trackUsage('tenant_usage', {
        type: 'videos',
        quantity: 1,
        timestamp: new Date(),
      });

      await subscriptionService.trackUsage('tenant_usage', {
        type: 'api_calls',
        quantity: 100,
        timestamp: new Date(),
      });

      const periodStart = new Date();
      periodStart.setDate(1);
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const usage = await subscriptionService.getCurrentUsage(
        'tenant_usage',
        periodStart,
        periodEnd
      );

      expect(usage.videos).toBe(1);
      expect(usage.api_calls).toBe(100);
    });
  });
});

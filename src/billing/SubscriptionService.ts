/**
 * Subscription Service
 * Manages billing subscriptions and tiers using Stripe
 */

export type Tier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'ENTERPRISE_PLUS';

export interface Subscription {
  id: string;
  tenantId: string;
  tier: Tier;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  monthlyPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierPricing {
  tier: Tier;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    videosPerMonth: number;
    resolution: string;
    storageGB: number;
    apiCallsPerDay: number;
    support: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'DRAFT' | 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE';
  dueDate: Date;
  paidAt?: Date;
  invoiceUrl?: string;
  createdAt: Date;
}

export interface UsageMetric {
  type: 'videos' | 'api_calls' | 'storage' | 'ai_credits';
  quantity: number;
  timestamp: Date;
}

export class SubscriptionService {
  private subscriptions: Map<string, Subscription> = new Map();
  private paymentMethods: Map<string, PaymentMethod[]> = new Map();
  private invoices: Invoice[] = [];
  private usageMetrics: Map<string, UsageMetric[]> = new Map();

  /**
   * Get tier pricing
   */
  getTierPricing(tier: Tier): TierPricing {
    const pricing: Record<Tier, TierPricing> = {
      STARTER: {
        tier: 'STARTER',
        monthlyPrice: 49,
        yearlyPrice: 490, // 2 months free
        features: [
          '10 videos/month',
          '1080p max resolution',
          '5GB storage',
          'Community support',
          'ScrollSoul co-branding',
        ],
        limits: {
          videosPerMonth: 10,
          resolution: '1080p',
          storageGB: 5,
          apiCallsPerDay: 100,
          support: '48h response time',
        },
      },
      PROFESSIONAL: {
        tier: 'PROFESSIONAL',
        monthlyPrice: 199,
        yearlyPrice: 1990,
        features: [
          '50 videos/month',
          '4K resolution',
          '50GB storage',
          'Priority support (24h)',
          'White-label option',
          'Custom domain',
          'API access (1000 calls/day)',
        ],
        limits: {
          videosPerMonth: 50,
          resolution: '4K',
          storageGB: 50,
          apiCallsPerDay: 1000,
          support: '24h response time',
        },
      },
      ENTERPRISE: {
        tier: 'ENTERPRISE',
        monthlyPrice: 999,
        yearlyPrice: 9990,
        features: [
          'Unlimited videos',
          '8K resolution',
          '500GB storage',
          'Dedicated account manager',
          '24/7 phone support',
          'SSO integration',
          'Custom AI model fine-tuning',
          'SLA guarantees',
          'Unlimited API calls',
        ],
        limits: {
          videosPerMonth: -1, // unlimited
          resolution: '8K',
          storageGB: 500,
          apiCallsPerDay: -1, // unlimited
          support: '24/7 phone',
        },
      },
      ENTERPRISE_PLUS: {
        tier: 'ENTERPRISE_PLUS',
        monthlyPrice: 0, // Custom pricing
        yearlyPrice: 0,
        features: [
          'Everything in ENTERPRISE',
          'On-premise deployment option',
          'Custom feature development',
          'Legal/compliance assistance',
          'Multi-region data residency',
          'Dedicated infrastructure',
        ],
        limits: {
          videosPerMonth: -1,
          resolution: '8K+',
          storageGB: -1,
          apiCallsPerDay: -1,
          support: 'White-glove',
        },
      },
    };

    return pricing[tier];
  }

  /**
   * Create new subscription
   */
  async createSubscription(tenantId: string, tier: Tier, paymentMethodId?: string): Promise<Subscription> {
    const pricing = this.getTierPricing(tier);

    const subscription: Subscription = {
      id: this.generateId(),
      tenantId,
      tier,
      status: paymentMethodId ? 'ACTIVE' : 'TRIALING',
      currentPeriodStart: new Date(),
      currentPeriodEnd: this.getNextPeriodEnd(new Date()),
      cancelAtPeriodEnd: false,
      trialEnd: paymentMethodId ? undefined : this.getTrialEnd(new Date()),
      monthlyPrice: pricing.monthlyPrice,
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In production, this would create a Stripe subscription
    if (paymentMethodId) {
      subscription.stripeSubscriptionId = `sub_${Math.random().toString(36).substr(2, 16)}`;
    }

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  /**
   * Update subscription tier
   */
  async updateSubscriptionTier(subscriptionId: string, newTier: Tier): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const pricing = this.getTierPricing(newTier);

    subscription.tier = newTier;
    subscription.monthlyPrice = pricing.monthlyPrice;
    subscription.updatedAt = new Date();

    // In production, this would update the Stripe subscription
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (immediately) {
      subscription.status = 'CANCELED';
      subscription.currentPeriodEnd = new Date();
    } else {
      subscription.cancelAtPeriodEnd = true;
    }

    subscription.updatedAt = new Date();

    // In production, this would cancel the Stripe subscription
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  /**
   * Track usage metric
   */
  async trackUsage(tenantId: string, metric: UsageMetric): Promise<void> {
    const metrics = this.usageMetrics.get(tenantId) || [];
    metrics.push(metric);
    this.usageMetrics.set(tenantId, metrics);
  }

  /**
   * Get current usage for tenant
   */
  async getCurrentUsage(tenantId: string, periodStart: Date, periodEnd: Date): Promise<Record<string, number>> {
    const metrics = this.usageMetrics.get(tenantId) || [];

    const periodMetrics = metrics.filter(
      (m) => m.timestamp >= periodStart && m.timestamp <= periodEnd
    );

    const usage: Record<string, number> = {
      videos: 0,
      api_calls: 0,
      storage: 0,
      ai_credits: 0,
    };

    periodMetrics.forEach((metric) => {
      usage[metric.type] += metric.quantity;
    });

    return usage;
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(tenantId: string, method: PaymentMethod): Promise<void> {
    const methods = this.paymentMethods.get(tenantId) || [];

    // If this is the first payment method, make it default
    if (methods.length === 0) {
      method.isDefault = true;
    }

    // If marked as default, unset other defaults
    if (method.isDefault) {
      methods.forEach((m) => (m.isDefault = false));
    }

    methods.push(method);
    this.paymentMethods.set(tenantId, methods);

    // In production, this would add the payment method to Stripe
  }

  /**
   * Generate invoice
   */
  async generateInvoice(tenantId: string, subscriptionId: string, amount: number): Promise<Invoice> {
    const invoice: Invoice = {
      id: this.generateId(),
      tenantId,
      subscriptionId,
      amount,
      currency: 'USD',
      status: 'OPEN',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      createdAt: new Date(),
    };

    this.invoices.push(invoice);

    // In production, this would create a Stripe invoice
    invoice.invoiceUrl = `https://invoice.scrollsoul.app/${invoice.id}`;

    return invoice;
  }

  /**
   * Issue credit to tenant
   */
  async issueCredit(tenantId: string, amount: number, reason: string): Promise<void> {
    // In production, this would create a credit note in Stripe
    console.log(`Issued $${amount} credit to tenant ${tenantId}: ${reason}`);
  }

  /**
   * Get subscription for tenant
   */
  async getSubscription(tenantId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find((sub) => sub.tenantId === tenantId);
  }

  /**
   * Get all invoices for tenant
   */
  async getInvoices(tenantId: string): Promise<Invoice[]> {
    return this.invoices.filter((inv) => inv.tenantId === tenantId);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNextPeriodEnd(start: Date): Date {
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return end;
  }

  private getTrialEnd(start: Date): Date {
    const end = new Date(start);
    end.setDate(end.getDate() + 14); // 14-day trial
    return end;
  }
}

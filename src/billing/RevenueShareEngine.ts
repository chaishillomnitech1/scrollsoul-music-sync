import { v4 as uuidv4 } from 'uuid';

/**
 * Revenue model types
 */
export enum RevenueModel {
  SAAS = 'SAAS', // Subscription-based
  REVENUE_SHARE = 'REVENUE_SHARE', // Percentage of client revenue
  HYBRID = 'HYBRID', // Combination of subscription + revenue share
  USAGE_BASED = 'USAGE_BASED', // Pay per API call/usage
}

/**
 * Payment method
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  ACH = 'ACH',
  WIRE = 'WIRE',
  CRYPTO = 'CRYPTO',
}

/**
 * Currency types
 */
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
  ETH = 'ETH',
  USDC = 'USDC',
}

/**
 * Invoice status
 */
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

/**
 * Billing plan
 */
export interface BillingPlan {
  id: string;
  companyId: string;
  revenueModel: RevenueModel;
  baseSubscription?: number;
  revenueSharePercentage?: number;
  usageRatePerCall?: number;
  currency: Currency;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  paymentMethod: PaymentMethod;
  autoCharge: boolean;
  createdAt: Date;
}

/**
 * Invoice
 */
export interface Invoice {
  id: string;
  companyId: string;
  billingPlanId: string;
  invoiceNumber: string;
  amount: number;
  currency: Currency;
  dueDate: Date;
  paidDate?: Date;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  taxAmount: number;
  totalAmount: number;
  createdAt: Date;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
}

/**
 * Invoice line item
 */
export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

/**
 * Usage metrics
 */
export interface UsageMetrics {
  id: string;
  companyId: string;
  period: Date;
  apiCalls: number;
  dataTransferGB: number;
  activeUsers: number;
  storageGB: number;
}

/**
 * Revenue share distribution
 */
export interface RevenueShareDistribution {
  id: string;
  companyId: string;
  period: Date;
  clientRevenue: number;
  sharePercentage: number;
  shareAmount: number;
  invoiceId?: string;
  distributedAt?: Date;
}

/**
 * Affiliate commission
 */
export interface AffiliateCommission {
  id: string;
  affiliateId: string;
  referredCompanyId: string;
  commissionPercentage: number;
  amount: number;
  paidOut: boolean;
  paidAt?: Date;
  createdAt: Date;
}

/**
 * Revenue Share & Billing Engine
 * Sophisticated payment and billing system
 */
export class RevenueShareEngine {
  private billingPlans: Map<string, BillingPlan> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private usageMetrics: Map<string, UsageMetrics> = new Map();
  private revenueShares: Map<string, RevenueShareDistribution> = new Map();
  private affiliateCommissions: Map<string, AffiliateCommission> = new Map();

  private invoiceCounter = 1000;

  // Exchange rates (simplified - would use real-time rates in production)
  private exchangeRates: Map<string, number> = new Map([
    ['USD_TO_EUR', 0.92],
    ['USD_TO_GBP', 0.79],
    ['USD_TO_BTC', 0.000025],
    ['USD_TO_ETH', 0.00041],
    ['USD_TO_USDC', 1.0],
  ]);

  /**
   * Create billing plan
   */
  createBillingPlan(
    companyId: string,
    revenueModel: RevenueModel,
    config: {
      baseSubscription?: number;
      revenueSharePercentage?: number;
      usageRatePerCall?: number;
      billingCycle: BillingPlan['billingCycle'];
      currency?: Currency;
      paymentMethod?: PaymentMethod;
      autoCharge?: boolean;
    }
  ): BillingPlan {
    const plan: BillingPlan = {
      id: uuidv4(),
      companyId,
      revenueModel,
      baseSubscription: config.baseSubscription,
      revenueSharePercentage: config.revenueSharePercentage,
      usageRatePerCall: config.usageRatePerCall,
      currency: config.currency || Currency.USD,
      billingCycle: config.billingCycle,
      paymentMethod: config.paymentMethod || PaymentMethod.CREDIT_CARD,
      autoCharge: config.autoCharge ?? true,
      createdAt: new Date(),
    };

    this.billingPlans.set(plan.id, plan);
    return plan;
  }

  /**
   * Record usage metrics
   */
  recordUsage(
    companyId: string,
    period: Date,
    metrics: Omit<UsageMetrics, 'id' | 'companyId' | 'period'>
  ): UsageMetrics {
    const usage: UsageMetrics = {
      id: uuidv4(),
      companyId,
      period,
      ...metrics,
    };

    this.usageMetrics.set(usage.id, usage);
    return usage;
  }

  /**
   * Generate invoice
   */
  generateInvoice(
    companyId: string,
    billingPlanId: string,
    period: Date,
    clientRevenue?: number
  ): Invoice {
    const plan = this.billingPlans.get(billingPlanId);
    if (!plan) {
      throw new Error(`Billing plan not found: ${billingPlanId}`);
    }

    const lineItems: InvoiceLineItem[] = [];
    let subtotal = 0;

    // Add subscription fee
    if (plan.baseSubscription && (plan.revenueModel === RevenueModel.SAAS || plan.revenueModel === RevenueModel.HYBRID)) {
      lineItems.push({
        description: `${plan.billingCycle} Subscription`,
        quantity: 1,
        unitPrice: plan.baseSubscription,
        amount: plan.baseSubscription,
      });
      subtotal += plan.baseSubscription;
    }

    // Add revenue share
    if (plan.revenueSharePercentage && clientRevenue && (plan.revenueModel === RevenueModel.REVENUE_SHARE || plan.revenueModel === RevenueModel.HYBRID)) {
      const shareAmount = clientRevenue * (plan.revenueSharePercentage / 100);
      lineItems.push({
        description: `Revenue Share (${plan.revenueSharePercentage}% of $${clientRevenue.toLocaleString()})`,
        quantity: 1,
        unitPrice: shareAmount,
        amount: shareAmount,
      });
      subtotal += shareAmount;
    }

    // Add usage-based charges
    if (plan.usageRatePerCall && plan.revenueModel === RevenueModel.USAGE_BASED) {
      const usage = this.getUsageForPeriod(companyId, period);
      if (usage) {
        const usageCharge = usage.apiCalls * plan.usageRatePerCall;
        lineItems.push({
          description: `API Usage (${usage.apiCalls.toLocaleString()} calls @ $${plan.usageRatePerCall})`,
          quantity: usage.apiCalls,
          unitPrice: plan.usageRatePerCall,
          amount: usageCharge,
        });
        subtotal += usageCharge;
      }
    }

    // Calculate tax (simplified - 8% sales tax)
    const taxAmount = subtotal * 0.08;
    const totalAmount = subtotal + taxAmount;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Net 30

    const invoice: Invoice = {
      id: uuidv4(),
      companyId,
      billingPlanId,
      invoiceNumber: `INV-${this.invoiceCounter++}`,
      amount: subtotal,
      currency: plan.currency,
      dueDate,
      status: InvoiceStatus.DRAFT,
      lineItems,
      taxAmount,
      totalAmount,
      createdAt: new Date(),
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  /**
   * Get usage for period
   */
  private getUsageForPeriod(companyId: string, period: Date): UsageMetrics | undefined {
    return Array.from(this.usageMetrics.values()).find(
      (u) => u.companyId === companyId && this.isSamePeriod(u.period, period)
    );
  }

  /**
   * Check if two dates are in the same billing period
   */
  private isSamePeriod(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  }

  /**
   * Send invoice
   */
  sendInvoice(invoiceId: string): Invoice | undefined {
    const invoice = this.invoices.get(invoiceId);
    if (invoice) {
      invoice.status = InvoiceStatus.SENT;
    }
    return invoice;
  }

  /**
   * Process payment
   */
  processPayment(
    invoiceId: string,
    paymentMethod: PaymentMethod,
    transactionId: string
  ): Invoice | undefined {
    const invoice = this.invoices.get(invoiceId);
    if (invoice) {
      invoice.status = InvoiceStatus.PAID;
      invoice.paidDate = new Date();
      invoice.paymentMethod = paymentMethod;
      invoice.transactionId = transactionId;
    }
    return invoice;
  }

  /**
   * Convert currency
   */
  convertCurrency(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;

    const rateKey = `${from}_TO_${to}`;
    const rate = this.exchangeRates.get(rateKey);
    if (!rate) {
      // Try reverse rate
      const reverseKey = `${to}_TO_${from}`;
      const reverseRate = this.exchangeRates.get(reverseKey);
      if (reverseRate) {
        return amount / reverseRate;
      }
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }

    return amount * rate;
  }

  /**
   * Process crypto payment
   */
  processCryptoPayment(
    invoiceId: string,
    cryptoCurrency: Currency,
    walletAddress: string
  ): {
    success: boolean;
    paymentAddress: string;
    amount: number;
    currency: Currency;
  } {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice not found: ${invoiceId}`);
    }

    // Convert invoice amount to crypto
    const cryptoAmount = this.convertCurrency(
      invoice.totalAmount,
      invoice.currency,
      cryptoCurrency
    );

    // Generate payment address (mock - would use real crypto wallet in production)
    const paymentAddress = `crypto_${uuidv4().replace(/-/g, '').substring(0, 40)}`;

    return {
      success: true,
      paymentAddress,
      amount: cryptoAmount,
      currency: cryptoCurrency,
    };
  }

  /**
   * Distribute revenue share
   */
  distributeRevenueShare(
    companyId: string,
    period: Date,
    clientRevenue: number
  ): RevenueShareDistribution {
    const plan = Array.from(this.billingPlans.values()).find(
      (p) => p.companyId === companyId
    );

    if (!plan || !plan.revenueSharePercentage) {
      throw new Error('Revenue share not configured for this company');
    }

    const shareAmount = clientRevenue * (plan.revenueSharePercentage / 100);

    const distribution: RevenueShareDistribution = {
      id: uuidv4(),
      companyId,
      period,
      clientRevenue,
      sharePercentage: plan.revenueSharePercentage,
      shareAmount,
      distributedAt: new Date(),
    };

    this.revenueShares.set(distribution.id, distribution);
    return distribution;
  }

  /**
   * Track affiliate commission
   */
  trackAffiliateCommission(
    affiliateId: string,
    referredCompanyId: string,
    commissionPercentage: number,
    amount: number
  ): AffiliateCommission {
    const commission: AffiliateCommission = {
      id: uuidv4(),
      affiliateId,
      referredCompanyId,
      commissionPercentage,
      amount,
      paidOut: false,
      createdAt: new Date(),
    };

    this.affiliateCommissions.set(commission.id, commission);
    return commission;
  }

  /**
   * Pay affiliate commission
   */
  payAffiliateCommission(commissionId: string): AffiliateCommission | undefined {
    const commission = this.affiliateCommissions.get(commissionId);
    if (commission) {
      commission.paidOut = true;
      commission.paidAt = new Date();
    }
    return commission;
  }

  /**
   * Get invoices for company
   */
  getInvoicesByCompany(companyId: string): Invoice[] {
    return Array.from(this.invoices.values())
      .filter((i) => i.companyId === companyId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get overdue invoices
   */
  getOverdueInvoices(): Invoice[] {
    const now = new Date();
    return Array.from(this.invoices.values()).filter((i) => {
      if (i.status === InvoiceStatus.PAID || i.status === InvoiceStatus.CANCELLED) {
        return false;
      }
      return i.dueDate < now;
    });
  }

  /**
   * Get affiliate commissions
   */
  getAffiliateCommissions(affiliateId: string): AffiliateCommission[] {
    return Array.from(this.affiliateCommissions.values()).filter(
      (c) => c.affiliateId === affiliateId
    );
  }

  /**
   * Get revenue statistics
   */
  getStats() {
    const invoices = Array.from(this.invoices.values());
    const paidInvoices = invoices.filter((i) => i.status === InvoiceStatus.PAID);
    const commissions = Array.from(this.affiliateCommissions.values());

    return {
      totalInvoices: invoices.length,
      paidInvoices: paidInvoices.length,
      overdueInvoices: this.getOverdueInvoices().length,
      totalRevenue: paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
      totalOutstanding: invoices
        .filter((i) => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE)
        .reduce((sum, i) => sum + i.totalAmount, 0),
      totalCommissionsPaid: commissions
        .filter((c) => c.paidOut)
        .reduce((sum, c) => sum + c.amount, 0),
      totalCommissionsPending: commissions
        .filter((c) => !c.paidOut)
        .reduce((sum, c) => sum + c.amount, 0),
      activeBillingPlans: this.billingPlans.size,
    };
  }
}

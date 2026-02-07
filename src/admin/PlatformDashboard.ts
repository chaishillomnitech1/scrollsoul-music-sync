/**
 * Platform Admin Dashboard
 * Platform-wide analytics and tenant management
 */

export interface PlatformMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeTenants: number;
  totalTenants: number;
  totalUsers: number;
  apiRequestsPerSecond: number;
  videoGenerations: {
    total: number;
    successful: number;
    failed: number;
    averageTimeSeconds: number;
  };
  costs: {
    aiApiCosts: number;
    infrastructure: number;
    totalCosts: number;
  };
  userAcquisition: {
    cac: number; // Customer Acquisition Cost
    ltv: number; // Lifetime Value
    churnRate: number; // percentage
  };
}

export interface TenantMetrics {
  tenantId: string;
  companyName: string;
  tier: string;
  mrr: number; // Monthly Recurring Revenue
  activeUsers: number;
  apiUsage: {
    requestsToday: number;
    limit: number;
  };
  videosGenerated: number;
  storageUsedGB: number;
  lastActiveAt: Date;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  userId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tenantIds?: string[]; // If specified, only these tenants have access
  percentage?: number; // Gradual rollout percentage
}

export class PlatformDashboard {
  private tenantMetrics: Map<string, TenantMetrics> = new Map();
  private supportTickets: SupportTicket[] = [];
  private featureFlags: Map<string, FeatureFlag> = new Map();

  /**
   * Get platform-wide metrics
   */
  async getPlatformMetrics(): Promise<PlatformMetrics> {
    const tenants = Array.from(this.tenantMetrics.values());
    const activeTenants = tenants.filter((t) => {
      const daysSinceActive = (Date.now() - t.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActive <= 30;
    });

    const totalRevenue = tenants.reduce((sum, t) => sum + t.mrr, 0) * 12;
    const mrr = tenants.reduce((sum, t) => sum + t.mrr, 0);

    return {
      totalRevenue,
      monthlyRecurringRevenue: mrr,
      activeTenants: activeTenants.length,
      totalTenants: tenants.length,
      totalUsers: tenants.reduce((sum, t) => sum + t.activeUsers, 0),
      apiRequestsPerSecond: Math.random() * 100, // Mock value
      videoGenerations: {
        total: tenants.reduce((sum, t) => sum + t.videosGenerated, 0),
        successful: Math.floor(tenants.reduce((sum, t) => sum + t.videosGenerated, 0) * 0.95),
        failed: Math.floor(tenants.reduce((sum, t) => sum + t.videosGenerated, 0) * 0.05),
        averageTimeSeconds: 45,
      },
      costs: {
        aiApiCosts: mrr * 0.3, // 30% of revenue
        infrastructure: mrr * 0.2, // 20% of revenue
        totalCosts: mrr * 0.5, // 50% of revenue
      },
      userAcquisition: {
        cac: 150, // $150 per customer
        ltv: 2400, // $2400 lifetime value
        churnRate: 3.5, // 3.5% monthly churn
      },
    };
  }

  /**
   * Get metrics for specific tenant
   */
  async getTenantMetrics(tenantId: string): Promise<TenantMetrics | undefined> {
    return this.tenantMetrics.get(tenantId);
  }

  /**
   * Update tenant metrics
   */
  async updateTenantMetrics(metrics: TenantMetrics): Promise<void> {
    this.tenantMetrics.set(metrics.tenantId, metrics);
  }

  /**
   * Get all tenant metrics with filters
   */
  async getAllTenantMetrics(filters?: {
    tier?: string;
    minMrr?: number;
    sortBy?: 'mrr' | 'users' | 'videos';
  }): Promise<TenantMetrics[]> {
    let tenants = Array.from(this.tenantMetrics.values());

    if (filters?.tier) {
      tenants = tenants.filter((t) => t.tier === filters.tier);
    }

    if (filters?.minMrr) {
      tenants = tenants.filter((t) => t.mrr >= filters.minMrr!);
    }

    if (filters?.sortBy) {
      tenants.sort((a, b) => {
        switch (filters.sortBy) {
          case 'mrr':
            return b.mrr - a.mrr;
          case 'users':
            return b.activeUsers - a.activeUsers;
          case 'videos':
            return b.videosGenerated - a.videosGenerated;
          default:
            return 0;
        }
      });
    }

    return tenants;
  }

  /**
   * Create support ticket
   */
  async createSupportTicket(
    ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>
  ): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: this.generateId(),
      ...ticket,
      status: 'OPEN',
      createdAt: new Date(),
    };

    this.supportTickets.push(newTicket);
    return newTicket;
  }

  /**
   * Update support ticket
   */
  async updateSupportTicket(
    ticketId: string,
    updates: {
      status?: SupportTicket['status'];
      priority?: SupportTicket['priority'];
      assignedTo?: string;
    }
  ): Promise<SupportTicket> {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) {
      throw new Error('Support ticket not found');
    }

    if (updates.status) ticket.status = updates.status;
    if (updates.priority) ticket.priority = updates.priority;
    if (updates.assignedTo !== undefined) ticket.assignedTo = updates.assignedTo;

    if (updates.status === 'RESOLVED' || updates.status === 'CLOSED') {
      ticket.resolvedAt = new Date();
    }

    return ticket;
  }

  /**
   * Get support tickets
   */
  async getSupportTickets(filters?: {
    tenantId?: string;
    status?: SupportTicket['status'];
    priority?: SupportTicket['priority'];
  }): Promise<SupportTicket[]> {
    let tickets = this.supportTickets;

    if (filters?.tenantId) {
      tickets = tickets.filter((t) => t.tenantId === filters.tenantId);
    }

    if (filters?.status) {
      tickets = tickets.filter((t) => t.status === filters.status);
    }

    if (filters?.priority) {
      tickets = tickets.filter((t) => t.priority === filters.priority);
    }

    return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Create feature flag
   */
  async createFeatureFlag(flag: Omit<FeatureFlag, 'id'>): Promise<FeatureFlag> {
    const newFlag: FeatureFlag = {
      id: this.generateId(),
      ...flag,
    };

    this.featureFlags.set(newFlag.id, newFlag);
    return newFlag;
  }

  /**
   * Update feature flag
   */
  async updateFeatureFlag(flagId: string, updates: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const flag = this.featureFlags.get(flagId);
    if (!flag) {
      throw new Error('Feature flag not found');
    }

    Object.assign(flag, updates);
    this.featureFlags.set(flagId, flag);
    return flag;
  }

  /**
   * Check if feature is enabled for tenant
   */
  async isFeatureEnabled(featureName: string, tenantId: string): Promise<boolean> {
    const flag = Array.from(this.featureFlags.values()).find((f) => f.name === featureName);

    if (!flag) {
      return false; // Feature flag doesn't exist
    }

    if (!flag.enabled) {
      return false; // Feature is globally disabled
    }

    // Check tenant-specific access
    if (flag.tenantIds && flag.tenantIds.length > 0) {
      return flag.tenantIds.includes(tenantId);
    }

    // Check percentage rollout
    if (flag.percentage !== undefined) {
      const hash = this.hashString(`${featureName}_${tenantId}`);
      return (hash % 100) < flag.percentage;
    }

    return true; // Feature is enabled for all
  }

  /**
   * Get all feature flags
   */
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return Array.from(this.featureFlags.values());
  }

  /**
   * Manually override tenant limits
   */
  async overrideTenantLimits(
    tenantId: string,
    limits: {
      videosPerMonth?: number;
      apiCallsPerDay?: number;
      storageGB?: number;
    }
  ): Promise<void> {
    const metrics = this.tenantMetrics.get(tenantId);
    if (!metrics) {
      throw new Error('Tenant not found');
    }

    // In production, this would update the tenant's limits in the database
    console.log(`Overriding limits for tenant ${tenantId}:`, limits);
  }

  /**
   * Apply credit to tenant account
   */
  async applyCredit(
    tenantId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    const metrics = this.tenantMetrics.get(tenantId);
    if (!metrics) {
      throw new Error('Tenant not found');
    }

    // In production, this would integrate with Stripe to apply credit
    console.log(`Applied $${amount} credit to tenant ${tenantId}: ${reason}`);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

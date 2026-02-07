/**
 * Tenant Service - Multi-tenant architecture implementation
 * Manages tenant isolation, configuration, and resource limits
 */

export type TenantTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'ENTERPRISE_PLUS';

export interface BrandingConfig {
  logo: string; // URL to logo
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  watermark?: string;
  emailTemplate?: string;
}

export interface UsageLimits {
  videosPerMonth: number;
  aiCreditsPerMonth: number;
  storageGB: number;
  apiCallsPerDay: number;
  teamMembers: number;
}

export interface APIKey {
  id: string;
  key: string;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

export interface TenantUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  permissions: string[];
  createdAt: Date;
}

export interface BillingConfig {
  stripeCustomerId?: string;
  subscriptionId?: string;
  billingEmail: string;
  paymentMethod?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface Tenant {
  id: string;
  companyName: string;
  tier: TenantTier;
  customDomain?: string; // e.g., acme.scrollsoul.app
  branding: BrandingConfig;
  limits: UsageLimits;
  billingInfo: BillingConfig;
  users: TenantUser[];
  apiKeys: APIKey[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export class TenantService {
  private tenants: Map<string, Tenant> = new Map();

  /**
   * Get default usage limits based on tier
   */
  private getDefaultLimits(tier: TenantTier): UsageLimits {
    switch (tier) {
      case 'STARTER':
        return {
          videosPerMonth: 10,
          aiCreditsPerMonth: 1000,
          storageGB: 5,
          apiCallsPerDay: 100,
          teamMembers: 1,
        };
      case 'PROFESSIONAL':
        return {
          videosPerMonth: 50,
          aiCreditsPerMonth: 5000,
          storageGB: 50,
          apiCallsPerDay: 1000,
          teamMembers: 5,
        };
      case 'ENTERPRISE':
        return {
          videosPerMonth: -1, // unlimited
          aiCreditsPerMonth: 50000,
          storageGB: 500,
          apiCallsPerDay: -1, // unlimited
          teamMembers: 50,
        };
      case 'ENTERPRISE_PLUS':
        return {
          videosPerMonth: -1, // unlimited
          aiCreditsPerMonth: -1, // unlimited
          storageGB: -1, // unlimited
          apiCallsPerDay: -1, // unlimited
          teamMembers: -1, // unlimited
        };
    }
  }

  /**
   * Create a new tenant
   */
  async createTenant(data: {
    companyName: string;
    tier: TenantTier;
    adminEmail: string;
    billingEmail: string;
  }): Promise<Tenant> {
    const tenant: Tenant = {
      id: this.generateId(),
      companyName: data.companyName,
      tier: data.tier,
      branding: {
        logo: '',
        primaryColor: '#1a73e8',
        secondaryColor: '#34a853',
        fontFamily: 'Inter, sans-serif',
      },
      limits: this.getDefaultLimits(data.tier),
      billingInfo: {
        billingEmail: data.billingEmail,
      },
      users: [
        {
          id: this.generateId(),
          email: data.adminEmail,
          role: 'ADMIN',
          permissions: ['*'],
          createdAt: new Date(),
        },
      ],
      apiKeys: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string): Promise<Tenant | undefined> {
    return this.tenants.get(tenantId);
  }

  /**
   * Update tenant tier
   */
  async updateTenantTier(tenantId: string, newTier: TenantTier): Promise<Tenant> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    tenant.tier = newTier;
    tenant.limits = this.getDefaultLimits(newTier);
    tenant.updatedAt = new Date();

    this.tenants.set(tenantId, tenant);
    return tenant;
  }

  /**
   * Update tenant branding
   */
  async updateBranding(tenantId: string, branding: Partial<BrandingConfig>): Promise<Tenant> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    tenant.branding = { ...tenant.branding, ...branding };
    tenant.updatedAt = new Date();

    this.tenants.set(tenantId, tenant);
    return tenant;
  }

  /**
   * Create API key for tenant
   */
  async createAPIKey(tenantId: string, name: string): Promise<APIKey> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const apiKey: APIKey = {
      id: this.generateId(),
      key: this.generateAPIKey(),
      name,
      createdAt: new Date(),
      isActive: true,
    };

    tenant.apiKeys.push(apiKey);
    tenant.updatedAt = new Date();

    this.tenants.set(tenantId, tenant);
    return apiKey;
  }

  /**
   * Check if tenant is within usage limits
   */
  async checkUsageLimits(tenantId: string, metric: keyof UsageLimits, currentUsage: number): Promise<boolean> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const limit = tenant.limits[metric];
    if (limit === -1) {
      return true; // unlimited
    }

    return currentUsage < limit;
  }

  /**
   * List all tenants
   */
  async listTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  /**
   * Deactivate tenant
   */
  async deactivateTenant(tenantId: string): Promise<void> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    tenant.isActive = false;
    tenant.updatedAt = new Date();
    this.tenants.set(tenantId, tenant);
  }

  private generateId(): string {
    return `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAPIKey(): string {
    return `sk_${Math.random().toString(36).substr(2, 32)}`;
  }
}

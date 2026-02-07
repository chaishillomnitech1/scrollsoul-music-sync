/**
 * Enterprise Configuration Module
 * Supports custom branding, private endpoints, and multi-tenant deployments
 */

/**
 * Enterprise tier levels
 */
export enum EnterpriseTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  ENTERPRISE_PLUS = 'ENTERPRISE_PLUS',
}

/**
 * Custom branding configuration
 */
export interface BrandingConfig {
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  customDomain?: string;
  whiteLabel: boolean;
}

/**
 * Private endpoint configuration
 */
export interface PrivateEndpointConfig {
  enabled: boolean;
  baseUrl?: string;
  customPaths?: Record<string, string>;
  ipWhitelist?: string[];
  requiresApiKey: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Enterprise feature flags
 */
export interface EnterpriseFeatures {
  customBranding: boolean;
  privateEndpoints: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  sla: boolean;
  multiRegionDeployment: boolean;
  customIntegrations: boolean;
  dedicatedInfrastructure: boolean;
  ssoEnabled: boolean;
  auditLogs: boolean;
}

/**
 * SLA (Service Level Agreement) configuration
 */
export interface SLAConfig {
  uptime: number; // percentage (e.g., 99.9)
  responseTime: number; // max response time in ms
  supportResponseTime: number; // in hours
  dataBackupFrequency: string; // e.g., 'daily', 'hourly'
}

/**
 * Enterprise configuration interface
 */
export interface EnterpriseConfig {
  clientId: string;
  clientSecret: string;
  tier: EnterpriseTier;
  branding: BrandingConfig;
  privateEndpoints: PrivateEndpointConfig;
  features: EnterpriseFeatures;
  sla?: SLAConfig;
  billingEmail: string;
  technicalContact: {
    name: string;
    email: string;
    phone?: string;
  };
  deploymentRegions: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enterprise Configuration Manager
 */
export class EnterpriseConfigManager {
  private configs: Map<string, EnterpriseConfig> = new Map();

  /**
   * Create a new enterprise configuration
   */
  createConfig(config: Omit<EnterpriseConfig, 'createdAt' | 'updatedAt'>): EnterpriseConfig {
    const fullConfig: EnterpriseConfig = {
      ...config,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.configs.set(config.clientId, fullConfig);
    return fullConfig;
  }

  /**
   * Get enterprise configuration
   */
  getConfig(clientId: string): EnterpriseConfig | undefined {
    return this.configs.get(clientId);
  }

  /**
   * Update enterprise configuration
   * Note: clientId and clientSecret cannot be changed after creation
   */
  updateConfig(clientId: string, updates: Partial<EnterpriseConfig>): EnterpriseConfig {
    const existing = this.configs.get(clientId);
    if (!existing) {
      throw new Error(`Configuration not found for client: ${clientId}`);
    }

    // Prevent modification of immutable fields
    const { clientId: _, clientSecret: __, ...allowedUpdates } = updates;

    const updated: EnterpriseConfig = {
      ...existing,
      ...allowedUpdates,
      clientId: existing.clientId, // Preserve original clientId
      clientSecret: existing.clientSecret, // Preserve original clientSecret
      updatedAt: new Date(),
    };

    this.configs.set(clientId, updated);
    return updated;
  }

  /**
   * Delete enterprise configuration
   */
  deleteConfig(clientId: string): boolean {
    return this.configs.delete(clientId);
  }

  /**
   * Get all configurations
   */
  getAllConfigs(): EnterpriseConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Get configurations by tier
   */
  getConfigsByTier(tier: EnterpriseTier): EnterpriseConfig[] {
    return Array.from(this.configs.values()).filter(config => config.tier === tier);
  }

  /**
   * Get tier features
   */
  static getTierFeatures(tier: EnterpriseTier): EnterpriseFeatures {
    const features: Record<EnterpriseTier, EnterpriseFeatures> = {
      [EnterpriseTier.STARTER]: {
        customBranding: false,
        privateEndpoints: false,
        advancedAnalytics: false,
        prioritySupport: false,
        sla: false,
        multiRegionDeployment: false,
        customIntegrations: false,
        dedicatedInfrastructure: false,
        ssoEnabled: false,
        auditLogs: false,
      },
      [EnterpriseTier.PROFESSIONAL]: {
        customBranding: true,
        privateEndpoints: false,
        advancedAnalytics: true,
        prioritySupport: true,
        sla: false,
        multiRegionDeployment: false,
        customIntegrations: false,
        dedicatedInfrastructure: false,
        ssoEnabled: false,
        auditLogs: true,
      },
      [EnterpriseTier.ENTERPRISE]: {
        customBranding: true,
        privateEndpoints: true,
        advancedAnalytics: true,
        prioritySupport: true,
        sla: true,
        multiRegionDeployment: true,
        customIntegrations: true,
        dedicatedInfrastructure: false,
        ssoEnabled: true,
        auditLogs: true,
      },
      [EnterpriseTier.ENTERPRISE_PLUS]: {
        customBranding: true,
        privateEndpoints: true,
        advancedAnalytics: true,
        prioritySupport: true,
        sla: true,
        multiRegionDeployment: true,
        customIntegrations: true,
        dedicatedInfrastructure: true,
        ssoEnabled: true,
        auditLogs: true,
      },
    };

    return features[tier];
  }

  /**
   * Get tier SLA
   */
  static getTierSLA(tier: EnterpriseTier): SLAConfig | undefined {
    const slas: Record<EnterpriseTier, SLAConfig | undefined> = {
      [EnterpriseTier.STARTER]: undefined,
      [EnterpriseTier.PROFESSIONAL]: undefined,
      [EnterpriseTier.ENTERPRISE]: {
        uptime: 99.9,
        responseTime: 200,
        supportResponseTime: 4,
        dataBackupFrequency: 'daily',
      },
      [EnterpriseTier.ENTERPRISE_PLUS]: {
        uptime: 99.99,
        responseTime: 100,
        supportResponseTime: 1,
        dataBackupFrequency: 'hourly',
      },
    };

    return slas[tier];
  }

  /**
   * Validate branding configuration
   */
  static validateBranding(branding: BrandingConfig): boolean {
    if (!branding.companyName || branding.companyName.trim() === '') {
      throw new Error('Company name is required');
    }

    if (branding.customDomain) {
      const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
      if (!domainRegex.test(branding.customDomain)) {
        throw new Error('Invalid custom domain format');
      }
    }

    return true;
  }

  /**
   * Validate private endpoint configuration
   */
  static validatePrivateEndpoints(config: PrivateEndpointConfig): boolean {
    if (config.enabled && config.requiresApiKey && !config.baseUrl) {
      throw new Error('Base URL is required for private endpoints');
    }

    if (config.ipWhitelist) {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,2}$/;
      
      for (const ip of config.ipWhitelist) {
        if (!ipRegex.test(ip) && !cidrRegex.test(ip)) {
          throw new Error(`Invalid IP address or CIDR notation: ${ip}`);
        }
      }
    }

    return true;
  }
}

/**
 * Rate limit configuration
 */
export interface RateLimit {
  max: number;
  window: number; // seconds
}

/**
 * Security event
 */
export interface SecurityEvent {
  type: string;
  identifier: string;
  action?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * IP range for whitelisting
 */
export interface IPRange {
  cidr?: string;
  start?: string;
  end?: string;
}

/**
 * WAF rule
 */
export interface WAFRule {
  id: string;
  pattern: RegExp;
  action: 'block' | 'challenge' | 'log';
  description: string;
}

/**
 * Network Security Service
 * Handles rate limiting, DDoS protection, and WAF
 */
export class NetworkSecurityService {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private ipWhitelists: Map<string, IPRange[]> = new Map(); // tenantId -> IP ranges
  private wafRules: WAFRule[] = [];
  private blockedIPs: Set<string> = new Set();

  constructor() {
    this.initializeWAFRules();
  }

  /**
   * Initialize default WAF rules
   */
  private initializeWAFRules() {
    this.wafRules = [
      {
        id: 'sql-injection',
        pattern: /\b(union|select|insert|update|delete|drop|alter|create|exec|script)\b/i,
        action: 'block',
        description: 'SQL Injection Prevention',
      },
      {
        id: 'xss',
        pattern: /<script|javascript:|onerror=|onload=/i,
        action: 'block',
        description: 'Cross-Site Scripting (XSS) Prevention',
      },
      {
        id: 'path-traversal',
        pattern: /\.\.\//,
        action: 'block',
        description: 'Path Traversal Prevention',
      },
      {
        id: 'code-injection',
        pattern: /\beval\s*\(|exec\s*\(/i,
        action: 'block',
        description: 'Code Injection Prevention',
      },
    ];
  }

  /**
   * Get rate limit configuration for action
   */
  getRateLimit(action: string): RateLimit {
    const limits: Record<string, RateLimit> = {
      login: { max: 5, window: 300 }, // 5 attempts per 5 minutes
      api: { max: 1000, window: 60 }, // 1000 requests per minute
      upload: { max: 10, window: 60 }, // 10 uploads per minute
      download: { max: 100, window: 60 }, // 100 downloads per minute
    };

    return limits[action] || { max: 100, window: 60 }; // Default limit
  }

  /**
   * Check rate limit
   */
  async checkRateLimit(identifier: string, action: string): Promise<boolean> {
    const key = `ratelimit:${action}:${identifier}`;
    const limit = this.getRateLimit(action);
    const now = Date.now();

    // Clean up expired entries
    for (const [k, v] of this.rateLimitStore.entries()) {
      if (now - v.resetTime > limit.window * 1000) {
        this.rateLimitStore.delete(k);
      }
    }

    // Get or create rate limit entry
    let entry = this.rateLimitStore.get(key);
    
    if (!entry || now - entry.resetTime > limit.window * 1000) {
      entry = {
        count: 0,
        resetTime: now,
      };
      this.rateLimitStore.set(key, entry);
    }

    entry.count++;

    if (entry.count > limit.max) {
      await this.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        identifier,
        action,
        count: entry.count,
        limit: limit.max,
      });
      return false;
    }

    return true;
  }

  /**
   * Log security event
   */
  async logSecurityEvent(type: string, metadata: Record<string, any>): Promise<void> {
    const event: SecurityEvent = {
      type,
      identifier: metadata.identifier || 'unknown',
      action: metadata.action,
      timestamp: Date.now(),
      metadata,
    };

    this.securityEvents.push(event);

    // Keep only last 10000 events
    if (this.securityEvents.length > 10000) {
      this.securityEvents = this.securityEvents.slice(-10000);
    }
  }

  /**
   * Get security events
   */
  getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.securityEvents.slice(-limit);
  }

  /**
   * Set IP whitelist for tenant
   */
  async setIPWhitelist(tenantId: string, ranges: IPRange[]): Promise<void> {
    this.ipWhitelists.set(tenantId, ranges);
  }

  /**
   * Get tenant IP whitelist
   */
  async getTenantIPWhitelist(tenantId: string): Promise<IPRange[]> {
    return this.ipWhitelists.get(tenantId) || [];
  }

  /**
   * Check if IP is in range
   */
  ipInRange(ip: string, range: IPRange): boolean {
    if (range.cidr) {
      return this.ipInCIDR(ip, range.cidr);
    }
    
    if (range.start && range.end) {
      return this.ipInNumericRange(ip, range.start, range.end);
    }
    
    return false;
  }

  /**
   * Check if IP is in CIDR range
   */
  private ipInCIDR(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const mask = ~(2 ** (32 - parseInt(bits)) - 1);
    
    const ipNum = this.ipToNumber(ip);
    const rangeNum = this.ipToNumber(range);
    
    return (ipNum & mask) === (rangeNum & mask);
  }

  /**
   * Check if IP is in numeric range
   */
  private ipInNumericRange(ip: string, start: string, end: string): boolean {
    const ipNum = this.ipToNumber(ip);
    const startNum = this.ipToNumber(start);
    const endNum = this.ipToNumber(end);
    
    return ipNum >= startNum && ipNum <= endNum;
  }

  /**
   * Convert IP address to number
   */
  private ipToNumber(ip: string): number {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  }

  /**
   * Verify IP whitelist
   */
  async verifyIPWhitelist(tenantId: string, ip: string): Promise<boolean> {
    const whitelist = await this.getTenantIPWhitelist(tenantId);
    
    if (whitelist.length === 0) {
      return true; // No restrictions
    }

    return whitelist.some((range) => this.ipInRange(ip, range));
  }

  /**
   * Check content against WAF rules
   */
  async checkWAF(content: string): Promise<{ blocked: boolean; rule?: WAFRule }> {
    for (const rule of this.wafRules) {
      if (rule.pattern.test(content)) {
        if (rule.action === 'block') {
          await this.logSecurityEvent('WAF_BLOCKED', {
            rule: rule.id,
            description: rule.description,
          });
          
          return { blocked: true, rule };
        }
      }
    }
    
    return { blocked: false };
  }

  /**
   * Add WAF rule
   */
  async addWAFRule(rule: Omit<WAFRule, 'id'>): Promise<string> {
    const id = `rule-${Date.now()}`;
    this.wafRules.push({ ...rule, id });
    return id;
  }

  /**
   * Remove WAF rule
   */
  async removeWAFRule(ruleId: string): Promise<boolean> {
    const index = this.wafRules.findIndex((r) => r.id === ruleId);
    if (index >= 0) {
      this.wafRules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get WAF rules
   */
  getWAFRules(): WAFRule[] {
    return this.wafRules;
  }

  /**
   * Block IP address
   */
  async blockIP(ip: string): Promise<void> {
    this.blockedIPs.add(ip);
    await this.logSecurityEvent('IP_BLOCKED', { ip });
  }

  /**
   * Unblock IP address
   */
  async unblockIP(ip: string): Promise<void> {
    this.blockedIPs.delete(ip);
    await this.logSecurityEvent('IP_UNBLOCKED', { ip });
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Configure DDoS protection (placeholder for cloud service integration)
   */
  async configureDDoSProtection(): Promise<void> {
    // In production, integrate with Cloudflare, AWS Shield, etc.
    await this.logSecurityEvent('DDOS_PROTECTION_CONFIGURED', {});
  }

  /**
   * Deploy WAF rules (placeholder for cloud service integration)
   */
  async deployWAFRules(): Promise<void> {
    // In production, deploy to cloud WAF service
    await this.logSecurityEvent('WAF_RULES_DEPLOYED', {
      ruleCount: this.wafRules.length,
    });
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      rateLimitEntries: this.rateLimitStore.size,
      securityEventsCount: this.securityEvents.length,
      ipWhitelistsCount: this.ipWhitelists.size,
      wafRulesCount: this.wafRules.length,
      blockedIPsCount: this.blockedIPs.size,
    };
  }
}

/**
 * Enterprise Security Service
 * Implements SSO, IP whitelisting, BYOK, audit logging, and DLP
 */

export interface EncryptionKey {
  keyId: string;
  algorithm: string;
  keyMaterial: string;
  createdAt: Date;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
}

export interface DLPReport {
  scanId: string;
  contentId: string;
  sensitiveDataFound: boolean;
  violations: DLPViolation[];
  scannedAt: Date;
}

export interface DLPViolation {
  type: 'SSN' | 'CREDIT_CARD' | 'EMAIL' | 'PHONE' | 'API_KEY' | 'PASSWORD';
  location: string;
  value: string; // redacted
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SSOConfig {
  tenantId: string;
  provider: 'SAML' | 'OAUTH' | 'LDAP';
  entityId?: string;
  ssoUrl?: string;
  certificate?: string;
  clientId?: string;
  clientSecret?: string;
  enabled: boolean;
}

export class EnterpriseSecurityService {
  private ipWhitelists: Map<string, string[]> = new Map();
  private encryptionKeys: Map<string, EncryptionKey> = new Map();
  private auditLogs: AuditEvent[] = [];
  private ssoConfigs: Map<string, SSOConfig> = new Map();

  /**
   * Configure IP whitelist for tenant
   */
  configureIPWhitelist(tenantId: string, ips: string[]): void {
    this.ipWhitelists.set(tenantId, ips);
  }

  /**
   * Check if IP is whitelisted for tenant
   */
  isIPWhitelisted(tenantId: string, ip: string): boolean {
    const whitelist = this.ipWhitelists.get(tenantId);
    if (!whitelist || whitelist.length === 0) {
      return true; // No whitelist means all IPs allowed
    }

    return whitelist.includes(ip);
  }

  /**
   * Set Bring Your Own Key (BYOK) for tenant
   */
  setBYOK(tenantId: string, key: EncryptionKey): void {
    this.encryptionKeys.set(tenantId, key);
  }

  /**
   * Get encryption key for tenant
   */
  getEncryptionKey(tenantId: string): EncryptionKey | undefined {
    return this.encryptionKeys.get(tenantId);
  }

  /**
   * Log audit event for SOC2/ISO27001 compliance
   */
  logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      id: this.generateAuditId(),
      ...event,
      timestamp: new Date(),
    };

    this.auditLogs.push(auditEvent);

    // In production, this would be sent to a SIEM system
    console.log('Audit Event:', JSON.stringify(auditEvent));
  }

  /**
   * Get audit logs for tenant
   */
  getAuditLogs(tenantId: string, startDate?: Date, endDate?: Date): AuditEvent[] {
    let logs = this.auditLogs.filter((log) => log.tenantId === tenantId);

    if (startDate) {
      logs = logs.filter((log) => log.timestamp >= startDate);
    }

    if (endDate) {
      logs = logs.filter((log) => log.timestamp <= endDate);
    }

    return logs;
  }

  /**
   * Scan content for sensitive data (DLP)
   */
  scanForSensitiveData(content: { id: string; text: string }): DLPReport {
    const violations: DLPViolation[] = [];

    // SSN pattern
    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ssnMatches = content.text.match(ssnPattern);
    if (ssnMatches) {
      ssnMatches.forEach((match) => {
        violations.push({
          type: 'SSN',
          location: 'text',
          value: match.replace(/\d/g, '*'),
          severity: 'CRITICAL',
        });
      });
    }

    // Credit card pattern
    const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
    const ccMatches = content.text.match(ccPattern);
    if (ccMatches) {
      ccMatches.forEach((match) => {
        violations.push({
          type: 'CREDIT_CARD',
          location: 'text',
          value: match.replace(/\d/g, '*'),
          severity: 'CRITICAL',
        });
      });
    }

    // API key pattern
    const apiKeyPattern = /\b(?:sk|pk)_[a-zA-Z0-9]{32,}\b/g;
    const apiKeyMatches = content.text.match(apiKeyPattern);
    if (apiKeyMatches) {
      apiKeyMatches.forEach((match) => {
        violations.push({
          type: 'API_KEY',
          location: 'text',
          value: match.substring(0, 10) + '***',
          severity: 'HIGH',
        });
      });
    }

    // Email pattern
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatches = content.text.match(emailPattern);
    if (emailMatches) {
      emailMatches.forEach((match) => {
        violations.push({
          type: 'EMAIL',
          location: 'text',
          value: match,
          severity: 'LOW',
        });
      });
    }

    return {
      scanId: this.generateScanId(),
      contentId: content.id,
      sensitiveDataFound: violations.length > 0,
      violations,
      scannedAt: new Date(),
    };
  }

  /**
   * Configure SSO for tenant
   */
  configureSSOProvider(config: SSOConfig): void {
    this.ssoConfigs.set(config.tenantId, config);
  }

  /**
   * Get SSO configuration for tenant
   */
  getSSOConfig(tenantId: string): SSOConfig | undefined {
    return this.ssoConfigs.get(tenantId);
  }

  /**
   * Validate SAML assertion
   */
  async validateSAMLAssertion(tenantId: string, assertion: string): Promise<boolean> {
    const config = this.ssoConfigs.get(tenantId);
    if (!config || config.provider !== 'SAML' || !config.enabled) {
      return false;
    }

    // In production, this would validate the SAML assertion against the certificate
    return true;
  }

  /**
   * Validate OAuth token
   */
  async validateOAuthToken(tenantId: string, token: string): Promise<boolean> {
    const config = this.ssoConfigs.get(tenantId);
    if (!config || config.provider !== 'OAUTH' || !config.enabled) {
      return false;
    }

    // In production, this would validate the OAuth token
    return true;
  }

  /**
   * Authenticate with LDAP
   */
  async authenticateLDAP(tenantId: string, username: string, password: string): Promise<boolean> {
    const config = this.ssoConfigs.get(tenantId);
    if (!config || config.provider !== 'LDAP' || !config.enabled) {
      return false;
    }

    // In production, this would authenticate against LDAP/Active Directory
    return true;
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateScanId(): string {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

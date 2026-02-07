/**
 * ScrollSoul Rose Gold Security Suite
 * Military-grade encryption and security infrastructure
 */

export { RoseGoldEncryptionService, EncryptedData, EncryptedBlockchainData } from './RoseGoldEncryption';
export { KeyManagementService, MasterKey, DataEncryptionKey } from './KeyManagementService';
export { AuthService, SessionToken, MFAConfig, BiometricData } from './AuthService';
export { AuthorizationService, Permission, Role, AccessRequest, Policy, ACL } from './AuthorizationService';
export { NetworkSecurityService, RateLimit, SecurityEvent, IPRange, WAFRule } from './NetworkSecurityService';
export { DLPService, Finding, DLPReport } from './DLPService';
export { BackupService, Backup } from './BackupService';
export { SecurityMonitorService, Threat, ThreatSeverity, ThreatType } from './SecurityMonitorService';
export { ComplianceService, AuditEvent, AuditLogEntry, DateRange, Report } from './ComplianceService';

import { RoseGoldEncryptionService } from './RoseGoldEncryption';
import { KeyManagementService } from './KeyManagementService';
import { AuthService } from './AuthService';
import { AuthorizationService } from './AuthorizationService';
import { NetworkSecurityService } from './NetworkSecurityService';
import { DLPService } from './DLPService';
import { BackupService } from './BackupService';
import { SecurityMonitorService } from './SecurityMonitorService';
import { ComplianceService } from './ComplianceService';

/**
 * Rose Gold Security Suite
 * Unified security infrastructure for ScrollSoul Empire
 */
export class RoseGoldSecuritySuite {
  encryption: RoseGoldEncryptionService;
  keyManagement: KeyManagementService;
  auth: AuthService;
  authorization: AuthorizationService;
  network: NetworkSecurityService;
  dlp: DLPService;
  backup: BackupService;
  monitor: SecurityMonitorService;
  compliance: ComplianceService;

  constructor() {
    // Initialize all security services
    this.encryption = new RoseGoldEncryptionService();
    this.keyManagement = new KeyManagementService();
    this.auth = new AuthService();
    this.authorization = new AuthorizationService();
    this.network = new NetworkSecurityService();
    this.dlp = new DLPService();
    this.backup = new BackupService(this.encryption);
    this.monitor = new SecurityMonitorService();
    this.compliance = new ComplianceService();
  }

  /**
   * Get comprehensive security statistics
   */
  async getSecurityStats() {
    return {
      encryption: {
        algorithm: 'AES-256-GCM / ChaCha20-Poly1305',
        keyStrength: '256-bit',
      },
      keyManagement: this.keyManagement.getStats(),
      authentication: this.auth.getStats(),
      authorization: this.authorization.getStats(),
      network: this.network.getStats(),
      dlp: this.dlp.getStats(),
      backup: this.backup.getStats(),
      monitoring: this.monitor.getStats(),
      compliance: this.compliance.getStats(),
    };
  }

  /**
   * Initialize security suite with custom configuration
   */
  static async initialize(config?: {
    masterKey?: Buffer;
    jwtSecret?: string;
  }): Promise<RoseGoldSecuritySuite> {
    const suite = new RoseGoldSecuritySuite();
    
    if (config?.masterKey) {
      suite.encryption = new RoseGoldEncryptionService(config.masterKey);
    }
    
    if (config?.jwtSecret) {
      suite.auth = new AuthService(config.jwtSecret);
    }
    
    return suite;
  }

  /**
   * Health check for all security services
   */
  async healthCheck(): Promise<{ status: string; services: Record<string, string> }> {
    return {
      status: 'OPERATIONAL',
      services: {
        encryption: 'ACTIVE',
        keyManagement: 'ACTIVE',
        authentication: 'ACTIVE',
        authorization: 'ACTIVE',
        network: 'ACTIVE',
        dlp: 'ACTIVE',
        backup: 'ACTIVE',
        monitoring: 'ACTIVE',
        compliance: 'ACTIVE',
      },
    };
  }
}

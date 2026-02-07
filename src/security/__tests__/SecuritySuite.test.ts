import { RoseGoldSecuritySuite } from '../index';
import { AuthService } from '../AuthService';
import { AuthorizationService } from '../AuthorizationService';
import { NetworkSecurityService } from '../NetworkSecurityService';
import { DLPService } from '../DLPService';

describe('Rose Gold Security Suite', () => {
  let suite: RoseGoldSecuritySuite;

  beforeEach(() => {
    suite = new RoseGoldSecuritySuite();
  });

  describe('Authentication', () => {
    test('should create and verify session tokens', async () => {
      const userId = 'user-123';
      
      const session = await suite.auth.createSession(userId);
      
      expect(session.accessToken).toBeTruthy();
      expect(session.refreshToken).toBeTruthy();
      expect(session.expiresIn).toBe(15 * 60); // 15 minutes

      const verifiedUserId = await suite.auth.verifyAccessToken(session.accessToken);
      expect(verifiedUserId).toBe(userId);
    });

    test('should enable and verify TOTP MFA', async () => {
      const userId = 'user-123';
      
      const mfaConfig = await suite.auth.enableMFA(userId, 'totp');
      
      expect(mfaConfig.method).toBe('totp');
      expect(mfaConfig.secret).toBeTruthy();
      expect(mfaConfig.qrCode).toBeTruthy();
    });

    test('should implement brute force protection', async () => {
      const userId = 'user-123';
      
      // Simulate failed login attempts
      for (let i = 0; i < 5; i++) {
        suite.auth.recordFailedLogin(userId);
      }
      
      expect(suite.auth.isAccountLocked(userId)).toBe(true);
      
      await expect(suite.auth.login(userId, 'password')).rejects.toThrow('ACCOUNT_LOCKED');
    });

    test('should refresh tokens and revoke old ones', async () => {
      const userId = 'user-123';
      
      const session1 = await suite.auth.createSession(userId);
      const session2 = await suite.auth.refreshSession(session1.refreshToken);
      
      expect(session2).toBeTruthy();
      expect(session2?.refreshToken).not.toBe(session1.refreshToken);
      
      // Old refresh token should be invalid
      const session3 = await suite.auth.refreshSession(session1.refreshToken);
      expect(session3).toBeNull();
    });
  });

  describe('Authorization', () => {
    test('should check RBAC permissions', async () => {
      const userId = 'user-123';
      
      await suite.authorization.assignRole(userId, 'admin');
      
      const hasPermission = await suite.authorization.checkPermission(
        userId,
        'track',
        'delete'
      );
      
      expect(hasPermission).toBe(true);
    });

    test('should enforce resource-level permissions', async () => {
      const userId = 'user-123';
      const resourceId = 'track-456';
      
      await suite.authorization.grantResourceAccess(userId, resourceId, ['read', 'write']);
      
      const canRead = await suite.authorization.checkResourceAccess(userId, resourceId, 'read');
      const canDelete = await suite.authorization.checkResourceAccess(userId, resourceId, 'delete');
      
      expect(canRead).toBe(true);
      expect(canDelete).toBe(false);
    });

    test('should evaluate ABAC policies', async () => {
      const resource = 'sensitive-data';
      
      await suite.authorization.setPolicy(resource, [
        { type: 'role', operator: 'in', value: ['admin'] },
        { type: 'ip', operator: 'equals', value: '192.168.1.1' },
      ]);
      
      const allowed = await suite.authorization.checkPolicy({
        user: { id: 'user-123', roles: ['admin'] },
        resource,
        action: 'read',
        ip: '192.168.1.1',
      });
      
      expect(allowed).toBe(true);
    });
  });

  describe('Network Security', () => {
    test('should enforce rate limiting', async () => {
      const identifier = '192.168.1.1';
      const action = 'login';
      
      // Make requests up to limit
      for (let i = 0; i < 5; i++) {
        const allowed = await suite.network.checkRateLimit(identifier, action);
        expect(allowed).toBe(true);
      }
      
      // Exceed rate limit
      const exceeded = await suite.network.checkRateLimit(identifier, action);
      expect(exceeded).toBe(false);
    });

    test('should detect SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      const result = await suite.network.checkWAF(maliciousInput);
      
      expect(result.blocked).toBe(true);
      expect(result.rule?.id).toBe('sql-injection');
    });

    test('should detect XSS attempts', async () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      
      const result = await suite.network.checkWAF(maliciousInput);
      
      expect(result.blocked).toBe(true);
      expect(result.rule?.id).toBe('xss');
    });

    test('should verify IP whitelists', async () => {
      const tenantId = 'tenant-123';
      
      await suite.network.setIPWhitelist(tenantId, [
        { cidr: '192.168.1.0/24' },
      ]);
      
      const allowed = await suite.network.verifyIPWhitelist(tenantId, '192.168.1.50');
      const blocked = await suite.network.verifyIPWhitelist(tenantId, '10.0.0.1');
      
      expect(allowed).toBe(true);
      expect(blocked).toBe(false);
    });

    test('should block and unblock IPs', async () => {
      const ip = '1.2.3.4';
      
      await suite.network.blockIP(ip);
      expect(suite.network.isIPBlocked(ip)).toBe(true);
      
      await suite.network.unblockIP(ip);
      expect(suite.network.isIPBlocked(ip)).toBe(false);
    });
  });

  describe('Data Loss Prevention', () => {
    test('should detect credit card numbers', async () => {
      const content = 'My card number is 4532015112830366';
      
      const report = await suite.dlp.scanContent(content);
      
      expect(report.safe).toBe(false);
      expect(report.findings.some(f => f.type === 'CREDIT_CARD')).toBe(true);
    });

    test('should detect SSN', async () => {
      const content = 'SSN: 123-45-6789';
      
      const report = await suite.dlp.scanContent(content);
      
      expect(report.safe).toBe(false);
      expect(report.findings.some(f => f.type === 'SSN')).toBe(true);
    });

    test('should detect private keys', async () => {
      const content = 'Private key: 5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b';
      
      const report = await suite.dlp.scanContent(content);
      
      expect(report.safe).toBe(false);
      expect(report.findings.some(f => f.type === 'CRYPTO_PRIVATE_KEY')).toBe(true);
    });

    test('should redact PII', async () => {
      const content = 'SSN: 123-45-6789, Email: user@example.com';
      
      const redacted = await suite.dlp.redactPII(content);
      
      expect(redacted).not.toContain('123-45-6789');
      expect(redacted).toContain('***-**-****');
      expect(redacted).not.toContain('user@example.com');
    });
  });

  describe('Backup & Recovery', () => {
    test('should create encrypted backup', async () => {
      const data = Buffer.from('Important ScrollSoul data', 'utf8');
      
      const backup = await suite.backup.createBackup(data);
      
      expect(backup.encrypted).toBe(true);
      expect(backup.verified).toBe(true);
      expect(backup.regions.length).toBeGreaterThan(0);
    });

    test('should restore from backup', async () => {
      const originalData = Buffer.from('Backup test data', 'utf8');
      
      const backup = await suite.backup.createBackup(originalData);
      const restored = await suite.backup.restoreFromBackup(backup.id);
      
      expect(restored.toString('utf8')).toBe(originalData.toString('utf8'));
    });

    test('should perform point-in-time recovery', async () => {
      const data1 = Buffer.from('Data at time 1', 'utf8');
      const backup1 = await suite.backup.createBackup(data1);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const data2 = Buffer.from('Data at time 2', 'utf8');
      await suite.backup.createBackup(data2);
      
      const restored = await suite.backup.restoreToPoint(backup1.timestamp + 1);
      expect(restored.toString('utf8')).toBe(data1.toString('utf8'));
    });
  });

  describe('Security Monitoring', () => {
    test('should detect brute force attacks', async () => {
      const userId = 'user-123';
      
      for (let i = 0; i < 15; i++) {
        await suite.monitor.recordEvent({
          type: 'LOGIN_ATTEMPT',
          userId,
          timestamp: Date.now(),
        });
      }
      
      const threats = suite.monitor.getThreats();
      expect(threats.some(t => t.type === 'BRUTE_FORCE')).toBe(true);
    });

    test('should detect potential data exfiltration', async () => {
      const userId = 'user-123';
      
      for (let i = 0; i < 600; i++) {
        await suite.monitor.recordEvent({
          type: 'DATA_ACCESS',
          userId,
          timestamp: Date.now(),
        });
      }
      
      const threats = suite.monitor.getThreats();
      expect(threats.some(t => t.type === 'DATA_EXFILTRATION')).toBe(true);
    });
  });

  describe('Compliance', () => {
    test('should log audit events', async () => {
      await suite.compliance.logAuditEvent({
        type: 'DATA_ACCESS',
        userId: 'user-123',
        resourceId: 'track-456',
        action: 'READ',
        result: 'SUCCESS',
        ip: '192.168.1.1',
      });
      
      const logs = await suite.compliance.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
    });

    test('should handle GDPR data deletion', async () => {
      const userId = 'user-123';
      
      // Create some audit logs
      await suite.compliance.logAuditEvent({
        type: 'DATA_ACCESS',
        userId,
        action: 'READ',
        result: 'SUCCESS',
      });
      
      // Delete user data
      await suite.compliance.deleteUserData(userId, 'GDPR_REQUEST');
      
      const logs = await suite.compliance.getAuditLogs(undefined, { userId });
      // User-specific logs should be anonymized (filtered by new userId returns nothing)
      expect(logs.length).toBe(0);
      
      // But the deletion event should be logged
      const allLogs = await suite.compliance.getAuditLogs();
      const deletionLog = allLogs.find(l => l.eventType === 'USER_DATA_DELETED');
      expect(deletionLog).toBeDefined();
    });

    test('should generate SOC 2 compliance report', async () => {
      const report = await suite.compliance.generateSOC2Report({
        start: Date.now() - 30 * 24 * 60 * 60 * 1000,
        end: Date.now(),
      });
      
      expect(report.controlsImplemented.length).toBeGreaterThan(0);
      expect(report.encryptionCoverage).toBe(100);
    });
  });

  describe('Integration', () => {
    test('should get comprehensive security stats', async () => {
      const stats = await suite.getSecurityStats();
      
      expect(stats.encryption.algorithm).toContain('AES-256-GCM');
      expect(stats.keyManagement).toBeDefined();
      expect(stats.authentication).toBeDefined();
      expect(stats.authorization).toBeDefined();
      expect(stats.network).toBeDefined();
      expect(stats.dlp).toBeDefined();
      expect(stats.backup).toBeDefined();
      expect(stats.monitoring).toBeDefined();
      expect(stats.compliance).toBeDefined();
    });

    test('should perform health check', async () => {
      const health = await suite.healthCheck();
      
      expect(health.status).toBe('OPERATIONAL');
      expect(health.services.encryption).toBe('ACTIVE');
      expect(health.services.authentication).toBe('ACTIVE');
      expect(health.services.compliance).toBe('ACTIVE');
    });
  });
});

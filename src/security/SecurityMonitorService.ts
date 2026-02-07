/**
 * Threat severity
 */
export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Threat type
 */
export type ThreatType =
  | 'BRUTE_FORCE'
  | 'UNAUTHORIZED_ACCESS'
  | 'DATA_EXFILTRATION'
  | 'PRIVILEGE_ESCALATION'
  | 'MALWARE'
  | 'ANOMALY';

/**
 * Threat definition
 */
export interface Threat {
  id: string;
  type: ThreatType;
  severity: ThreatSeverity;
  sourceIP?: string;
  userId?: string;
  affectedUserIds?: string[];
  affectsUsers: boolean;
  details: string;
  timestamp: number;
  mitigated: boolean;
}

/**
 * Security event for analysis
 */
export interface SecurityEvent {
  type: string;
  userId?: string;
  ip?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Anomaly detection result
 */
export interface Anomaly {
  type: string;
  severity: ThreatSeverity;
  score: number;
  details: string;
}

/**
 * Security Monitor Service
 * Real-time threat detection and incident response
 */
export class SecurityMonitorService {
  private threats: Threat[] = [];
  private loginAttempts: Map<string, number[]> = new Map(); // userId -> timestamps
  private dataAccessLog: Map<string, number[]> = new Map(); // userId -> timestamps
  private mitigationActions: Map<string, string[]> = new Map(); // threatId -> actions

  /**
   * Monitor for threats (continuous monitoring)
   */
  async monitorForThreats(): Promise<void> {
    // In production, this would run as a background job
    const anomalies = await this.detectAnomalies({
      loginPatterns: this.getRecentLogins(),
      apiUsage: this.getAPIMetrics(),
      dataAccess: this.getDataAccessLogs(),
    });

    for (const anomaly of anomalies) {
      if (anomaly.severity === 'HIGH' || anomaly.severity === 'CRITICAL') {
        const threat: Threat = {
          id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'ANOMALY',
          severity: anomaly.severity,
          details: anomaly.details,
          timestamp: Date.now(),
          affectsUsers: false,
          mitigated: false,
        };
        
        await this.triggerIncidentResponse(threat);
      }
    }
  }

  /**
   * Detect anomalies using simple heuristics
   */
  async detectAnomalies(data: {
    loginPatterns: any[];
    apiUsage: any[];
    dataAccess: any[];
  }): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Check for unusual login patterns
    for (const [userId, timestamps] of this.loginAttempts.entries()) {
      const recentAttempts = timestamps.filter(
        (t) => Date.now() - t < 60 * 60 * 1000 // Last hour
      );
      
      if (recentAttempts.length > 20) {
        anomalies.push({
          type: 'BRUTE_FORCE',
          severity: 'HIGH',
          score: 0.9,
          details: `Unusual login activity detected for user ${userId}: ${recentAttempts.length} attempts in 1 hour`,
        });
      }
    }

    // Check for unusual data access
    for (const [userId, timestamps] of this.dataAccessLog.entries()) {
      const recentAccess = timestamps.filter(
        (t) => Date.now() - t < 60 * 60 * 1000 // Last hour
      );
      
      if (recentAccess.length > 1000) {
        anomalies.push({
          type: 'DATA_EXFILTRATION',
          severity: 'CRITICAL',
          score: 0.95,
          details: `Potential data exfiltration: user ${userId} accessed ${recentAccess.length} resources in 1 hour`,
        });
      }
    }

    return anomalies;
  }

  /**
   * Detect intrusion
   */
  async detectIntrusion(event: SecurityEvent): Promise<boolean> {
    const indicators = [
      this.checkBruteForce(event),
      this.checkUnauthorizedAccess(event),
      this.checkDataExfiltration(event),
      this.checkPrivilegeEscalation(event),
    ];

    return indicators.some((i) => i === true);
  }

  /**
   * Check for brute force attempts
   */
  private checkBruteForce(event: SecurityEvent): boolean {
    if (event.type !== 'LOGIN_ATTEMPT' || !event.userId) {
      return false;
    }

    const attempts = this.loginAttempts.get(event.userId) || [];
    attempts.push(event.timestamp);
    this.loginAttempts.set(event.userId, attempts);

    // Check last 5 minutes
    const recentAttempts = attempts.filter(
      (t) => event.timestamp - t < 5 * 60 * 1000
    );

    return recentAttempts.length > 10;
  }

  /**
   * Check for unauthorized access
   */
  private checkUnauthorizedAccess(event: SecurityEvent): boolean {
    if (event.type !== 'ACCESS_DENIED') {
      return false;
    }

    // Multiple access denials in short time could indicate intrusion
    return event.metadata?.denialCount > 5;
  }

  /**
   * Check for data exfiltration
   */
  private checkDataExfiltration(event: SecurityEvent): boolean {
    if (event.type !== 'DATA_ACCESS' || !event.userId) {
      return false;
    }

    const accesses = this.dataAccessLog.get(event.userId) || [];
    accesses.push(event.timestamp);
    this.dataAccessLog.set(event.userId, accesses);

    // Check last hour
    const recentAccesses = accesses.filter(
      (t) => event.timestamp - t < 60 * 60 * 1000
    );

    return recentAccesses.length > 500;
  }

  /**
   * Check for privilege escalation
   */
  private checkPrivilegeEscalation(event: SecurityEvent): boolean {
    if (event.type !== 'PERMISSION_CHANGE') {
      return false;
    }

    // Detect suspicious permission changes
    return event.metadata?.newPermission === 'admin';
  }

  /**
   * Trigger incident response
   */
  async triggerIncidentResponse(threat: Threat): Promise<void> {
    this.threats.push(threat);
    const actions: string[] = [];

    // 1. Log the incident
    actions.push('INCIDENT_LOGGED');

    // 2. Auto-mitigate based on threat type
    if (threat.type === 'BRUTE_FORCE' && threat.sourceIP) {
      await this.blockIP(threat.sourceIP);
      actions.push(`IP_BLOCKED:${threat.sourceIP}`);
    }

    if (threat.type === 'DATA_EXFILTRATION' && threat.userId) {
      await this.revokeUserSessions(threat.userId);
      actions.push(`SESSIONS_REVOKED:${threat.userId}`);
    }

    // 3. Capture forensics
    await this.captureForensics(threat);
    actions.push('FORENSICS_CAPTURED');

    // 4. Alert (in production, integrate with PagerDuty, etc.)
    actions.push('ALERT_SENT');

    // Mark as mitigated
    threat.mitigated = true;
    this.mitigationActions.set(threat.id, actions);
  }

  /**
   * Block IP address
   */
  private async blockIP(ip: string): Promise<void> {
    // In production, integrate with firewall/network security service
    console.log(`[SECURITY] Blocking IP: ${ip}`);
  }

  /**
   * Revoke user sessions
   */
  private async revokeUserSessions(userId: string): Promise<void> {
    // In production, integrate with AuthService
    console.log(`[SECURITY] Revoking all sessions for user: ${userId}`);
  }

  /**
   * Capture forensic data
   */
  private async captureForensics(threat: Threat): Promise<void> {
    // In production, save detailed forensic data for investigation
    console.log(`[SECURITY] Capturing forensics for threat: ${threat.id}`);
  }

  /**
   * Notify affected users
   */
  async notifyUsers(userIds: string[]): Promise<void> {
    // In production, send email/SMS notifications
    console.log(`[SECURITY] Notifying ${userIds.length} users`);
  }

  /**
   * Get recent login attempts
   */
  private getRecentLogins(): any[] {
    const recent = [];
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const [userId, timestamps] of this.loginAttempts.entries()) {
      const recentTimestamps = timestamps.filter((t) => now - t < oneHour);
      if (recentTimestamps.length > 0) {
        recent.push({ userId, count: recentTimestamps.length });
      }
    }

    return recent;
  }

  /**
   * Get API usage metrics
   */
  private getAPIMetrics(): any[] {
    // Placeholder - in production, get from monitoring system
    return [];
  }

  /**
   * Get data access logs
   */
  private getDataAccessLogs(): any[] {
    const logs = [];
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const [userId, timestamps] of this.dataAccessLog.entries()) {
      const recentTimestamps = timestamps.filter((t) => now - t < oneHour);
      if (recentTimestamps.length > 0) {
        logs.push({ userId, count: recentTimestamps.length });
      }
    }

    return logs;
  }

  /**
   * Record security event
   */
  async recordEvent(event: SecurityEvent): Promise<void> {
    if (event.type === 'LOGIN_ATTEMPT' && event.userId) {
      const attempts = this.loginAttempts.get(event.userId) || [];
      attempts.push(event.timestamp);
      this.loginAttempts.set(event.userId, attempts);
    }

    if (event.type === 'DATA_ACCESS' && event.userId) {
      const accesses = this.dataAccessLog.get(event.userId) || [];
      accesses.push(event.timestamp);
      this.dataAccessLog.set(event.userId, accesses);
    }

    // Check for intrusion
    const isIntrusion = await this.detectIntrusion(event);
    if (isIntrusion) {
      const threat: Threat = {
        id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: this.inferThreatType(event),
        severity: 'HIGH',
        sourceIP: event.ip,
        userId: event.userId,
        details: `Intrusion detected: ${event.type}`,
        timestamp: event.timestamp,
        affectsUsers: false,
        mitigated: false,
      };
      
      await this.triggerIncidentResponse(threat);
    }
  }

  /**
   * Infer threat type from event
   */
  private inferThreatType(event: SecurityEvent): ThreatType {
    if (event.type === 'LOGIN_ATTEMPT') return 'BRUTE_FORCE';
    if (event.type === 'ACCESS_DENIED') return 'UNAUTHORIZED_ACCESS';
    if (event.type === 'DATA_ACCESS') return 'DATA_EXFILTRATION';
    if (event.type === 'PERMISSION_CHANGE') return 'PRIVILEGE_ESCALATION';
    return 'ANOMALY';
  }

  /**
   * Get threats
   */
  getThreats(limit: number = 100): Threat[] {
    return this.threats.slice(-limit);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalThreats: this.threats.length,
      mitigatedThreats: this.threats.filter((t) => t.mitigated).length,
      criticalThreats: this.threats.filter((t) => t.severity === 'CRITICAL').length,
      highThreats: this.threats.filter((t) => t.severity === 'HIGH').length,
      loginAttemptsTracked: this.loginAttempts.size,
      dataAccessTracked: this.dataAccessLog.size,
    };
  }
}

/**
 * SLA Monitoring Service
 * Tracks uptime, incidents, and automatically applies SLA credits
 */

export interface SLAConfig {
  tenantId: string;
  tier: 'PROFESSIONAL' | 'ENTERPRISE' | 'ENTERPRISE_PLUS';
  uptimeGuarantee: number; // percentage (99.9, 99.99, etc.)
  responseTimeThresholdMs: number;
  creditPercentagePerHour: number; // percentage of monthly fee
}

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
  startedAt: Date;
  resolvedAt?: Date;
  affectedServices: string[];
  downtimeMinutes: number;
}

export interface UptimeMetric {
  tenantId: string;
  timestamp: Date;
  isUp: boolean;
  responseTimeMs: number;
  endpoint: string;
}

export interface SLACredit {
  id: string;
  tenantId: string;
  incidentId: string;
  amount: number;
  currency: string;
  reason: string;
  appliedAt: Date;
  billingPeriod: string;
}

export class SLAMonitor {
  private slaConfigs: Map<string, SLAConfig> = new Map();
  private incidents: Map<string, Incident> = new Map();
  private uptimeMetrics: UptimeMetric[] = [];
  private credits: SLACredit[] = [];

  /**
   * Configure SLA for tenant based on tier
   */
  configureSLA(tenantId: string, tier: 'PROFESSIONAL' | 'ENTERPRISE' | 'ENTERPRISE_PLUS'): void {
    let uptimeGuarantee: number;
    let creditPercentagePerHour: number;

    switch (tier) {
      case 'PROFESSIONAL':
        uptimeGuarantee = 99.9; // 99.9% uptime
        creditPercentagePerHour = 5;
        break;
      case 'ENTERPRISE':
        uptimeGuarantee = 99.9;
        creditPercentagePerHour = 10;
        break;
      case 'ENTERPRISE_PLUS':
        uptimeGuarantee = 99.99; // 99.99% uptime
        creditPercentagePerHour = 15;
        break;
    }

    const config: SLAConfig = {
      tenantId,
      tier,
      uptimeGuarantee,
      responseTimeThresholdMs: 500,
      creditPercentagePerHour,
    };

    this.slaConfigs.set(tenantId, config);
  }

  /**
   * Record uptime metric
   */
  recordUptimeMetric(metric: Omit<UptimeMetric, 'timestamp'>): void {
    const uptimeMetric: UptimeMetric = {
      ...metric,
      timestamp: new Date(),
    };

    this.uptimeMetrics.push(uptimeMetric);

    // Check if this indicates a new incident
    if (!metric.isUp) {
      this.checkForIncident(metric.tenantId, metric.endpoint);
    }
  }

  /**
   * Create new incident
   */
  createIncident(data: Omit<Incident, 'id' | 'startedAt' | 'downtimeMinutes'>): Incident {
    const incident: Incident = {
      id: this.generateIncidentId(),
      ...data,
      startedAt: new Date(),
      downtimeMinutes: 0,
    };

    this.incidents.set(incident.id, incident);

    // Send alerts (PagerDuty/Opsgenie integration would go here)
    this.sendIncidentAlert(incident);

    return incident;
  }

  /**
   * Update incident status
   */
  updateIncidentStatus(incidentId: string, status: Incident['status']): void {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    incident.status = status;

    if (status === 'RESOLVED' && !incident.resolvedAt) {
      incident.resolvedAt = new Date();
      incident.downtimeMinutes = Math.floor(
        (incident.resolvedAt.getTime() - incident.startedAt.getTime()) / 60000
      );

      // Automatically apply SLA credits if applicable
      this.applySLACreditsForIncident(incident);
    }

    this.incidents.set(incidentId, incident);
  }

  /**
   * Calculate uptime percentage for tenant
   */
  calculateUptimePercentage(tenantId: string, startDate: Date, endDate: Date): number {
    const metrics = this.uptimeMetrics.filter(
      (m) => m.tenantId === tenantId && m.timestamp >= startDate && m.timestamp <= endDate
    );

    if (metrics.length === 0) {
      return 100;
    }

    const upCount = metrics.filter((m) => m.isUp).length;
    return (upCount / metrics.length) * 100;
  }

  /**
   * Get SLA compliance status
   */
  getSLACompliance(tenantId: string, startDate: Date, endDate: Date): {
    uptime: number;
    target: number;
    compliant: boolean;
    downtimeMinutes: number;
  } {
    const config = this.slaConfigs.get(tenantId);
    if (!config) {
      throw new Error('SLA config not found for tenant');
    }

    const uptime = this.calculateUptimePercentage(tenantId, startDate, endDate);
    const compliant = uptime >= config.uptimeGuarantee;

    // Calculate total downtime
    const tenantIncidents = Array.from(this.incidents.values()).filter(
      (i) => i.tenantId === tenantId && i.startedAt >= startDate && i.startedAt <= endDate
    );

    const downtimeMinutes = tenantIncidents.reduce((total, incident) => total + incident.downtimeMinutes, 0);

    return {
      uptime,
      target: config.uptimeGuarantee,
      compliant,
      downtimeMinutes,
    };
  }

  /**
   * Get all incidents for tenant
   */
  getIncidents(tenantId: string, status?: Incident['status']): Incident[] {
    let incidents = Array.from(this.incidents.values()).filter((i) => i.tenantId === tenantId);

    if (status) {
      incidents = incidents.filter((i) => i.status === status);
    }

    return incidents;
  }

  /**
   * Get SLA credits for tenant
   */
  getSLACredits(tenantId: string): SLACredit[] {
    return this.credits.filter((c) => c.tenantId === tenantId);
  }

  /**
   * Automatically apply SLA credits for downtime
   */
  private applySLACreditsForIncident(incident: Incident): void {
    const config = this.slaConfigs.get(incident.tenantId);
    if (!config) {
      return;
    }

    // Only apply credits for incidents that breach SLA
    if (incident.downtimeMinutes < 5) {
      return; // Less than 5 minutes doesn't warrant credit
    }

    const downtimeHours = incident.downtimeMinutes / 60;
    const creditPercentage = downtimeHours * config.creditPercentagePerHour;

    // In production, this would calculate based on actual subscription amount
    const estimatedMonthlyCost = this.estimateMonthlyCost(config.tier);
    const creditAmount = (estimatedMonthlyCost * creditPercentage) / 100;

    const credit: SLACredit = {
      id: this.generateCreditId(),
      tenantId: incident.tenantId,
      incidentId: incident.id,
      amount: Math.round(creditAmount * 100) / 100,
      currency: 'USD',
      reason: `SLA breach: ${incident.downtimeMinutes} minutes downtime`,
      appliedAt: new Date(),
      billingPeriod: this.getCurrentBillingPeriod(),
    };

    this.credits.push(credit);

    // In production, this would integrate with Stripe to apply the credit
    console.log(`Applied SLA credit: $${credit.amount} for tenant ${incident.tenantId}`);
  }

  private checkForIncident(tenantId: string, endpoint: string): void {
    // Check if there's already an active incident
    const activeIncidents = this.getIncidents(tenantId, 'INVESTIGATING');
    if (activeIncidents.length > 0) {
      return; // Already tracking an incident
    }

    // Create new incident if service is down
    this.createIncident({
      tenantId,
      title: `Service outage detected: ${endpoint}`,
      description: `Automated detection of service unavailability`,
      severity: 'HIGH',
      status: 'INVESTIGATING',
      affectedServices: [endpoint],
    });
  }

  private sendIncidentAlert(incident: Incident): void {
    // In production, this would integrate with PagerDuty/Opsgenie
    console.log(`ALERT: New incident ${incident.id} - ${incident.title}`);
  }

  private estimateMonthlyCost(tier: 'PROFESSIONAL' | 'ENTERPRISE' | 'ENTERPRISE_PLUS'): number {
    switch (tier) {
      case 'PROFESSIONAL':
        return 199;
      case 'ENTERPRISE':
        return 999;
      case 'ENTERPRISE_PLUS':
        return 5000; // Estimated
    }
  }

  private getCurrentBillingPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private generateIncidentId(): string {
    return `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCreditId(): string {
    return `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

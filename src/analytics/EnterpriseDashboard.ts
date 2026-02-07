import { v4 as uuidv4 } from 'uuid';

/**
 * Metric period
 */
export enum MetricPeriod {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
}

/**
 * Usage metric data point
 */
export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

/**
 * Real-time usage metrics
 */
export interface AnalyticsUsageMetrics {
  id: string;
  companyId: string;
  period: MetricPeriod;
  apiCalls: MetricDataPoint[];
  activeUsers: MetricDataPoint[];
  dataTransfer: MetricDataPoint[];
  errorRate: MetricDataPoint[];
  responseTime: MetricDataPoint[];
  generatedAt: Date;
}

/**
 * Revenue metrics
 */
export interface RevenueMetrics {
  id: string;
  period: MetricPeriod;
  totalRevenue: number;
  recurringRevenue: number;
  newRevenue: number;
  churnedRevenue: number;
  forecast: number;
  breakdown: {
    subscription: number;
    usage: number;
    revenueShare: number;
    other: number;
  };
  trends: MetricDataPoint[];
}

/**
 * Employee engagement metrics
 */
export interface EngagementMetrics {
  id: string;
  companyId: string;
  period: MetricPeriod;
  activeEmployees: number;
  tokenDistributed: number;
  averageTokensPerEmployee: number;
  topPerformers: {
    employeeId: string;
    tokens: number;
    rank: number;
  }[];
  engagementScore: number; // 0-100
  trends: MetricDataPoint[];
}

/**
 * Custom report configuration
 */
export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  companyId: string;
  metrics: string[];
  filters: Record<string, any>;
  schedule?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recipients: string[];
  format: 'PDF' | 'CSV' | 'JSON';
  createdAt: Date;
}

/**
 * Generated report
 */
export interface GeneratedReport {
  id: string;
  configId: string;
  companyId: string;
  period: {
    start: Date;
    end: Date;
  };
  data: any;
  format: 'PDF' | 'CSV' | 'JSON';
  downloadUrl: string;
  generatedAt: Date;
}

/**
 * Executive summary
 */
export interface ExecutiveSummary {
  id: string;
  companyId: string;
  period: {
    start: Date;
    end: Date;
  };
  highlights: {
    title: string;
    value: string;
    change: number; // percentage
    positive: boolean;
  }[];
  revenue: {
    total: number;
    growth: number;
    forecast: number;
  };
  usage: {
    apiCalls: number;
    activeUsers: number;
    uptime: number;
  };
  engagement: {
    totalTokens: number;
    activeEmployees: number;
    engagementScore: number;
  };
  recommendations: string[];
  generatedAt: Date;
}

/**
 * Analytics & Reporting Dashboard
 * Comprehensive business intelligence and reporting
 */
export class EnterpriseDashboard {
  private usageMetrics: Map<string, AnalyticsUsageMetrics> = new Map();
  private revenueMetrics: Map<string, RevenueMetrics> = new Map();
  private engagementMetrics: Map<string, EngagementMetrics> = new Map();
  private reportConfigs: Map<string, ReportConfig> = new Map();
  private generatedReports: Map<string, GeneratedReport> = new Map();
  private executiveSummaries: Map<string, ExecutiveSummary> = new Map();

  /**
   * Get real-time usage metrics
   */
  getUsageMetrics(companyId: string, period: MetricPeriod = MetricPeriod.DAY): AnalyticsUsageMetrics {
    // Generate simulated metrics
    const dataPoints = this.generateDataPoints(period);

    const metrics: AnalyticsUsageMetrics = {
      id: uuidv4(),
      companyId,
      period,
      apiCalls: dataPoints.map((t) => ({
        timestamp: t,
        value: Math.floor(Math.random() * 10000 + 5000),
      })),
      activeUsers: dataPoints.map((t) => ({
        timestamp: t,
        value: Math.floor(Math.random() * 500 + 100),
      })),
      dataTransfer: dataPoints.map((t) => ({
        timestamp: t,
        value: Math.random() * 100 + 50, // GB
      })),
      errorRate: dataPoints.map((t) => ({
        timestamp: t,
        value: Math.random() * 2, // percentage
      })),
      responseTime: dataPoints.map((t) => ({
        timestamp: t,
        value: Math.random() * 100 + 50, // ms
      })),
      generatedAt: new Date(),
    };

    this.usageMetrics.set(metrics.id, metrics);
    return metrics;
  }

  /**
   * Get revenue metrics
   */
  getRevenueMetrics(period: MetricPeriod = MetricPeriod.MONTH): RevenueMetrics {
    const baseRevenue = 500000;
    const totalRevenue = baseRevenue + Math.random() * 100000;
    const recurringRevenue = totalRevenue * 0.8;
    const newRevenue = totalRevenue * 0.15;
    const churnedRevenue = totalRevenue * 0.05;

    const metrics: RevenueMetrics = {
      id: uuidv4(),
      period,
      totalRevenue,
      recurringRevenue,
      newRevenue,
      churnedRevenue,
      forecast: totalRevenue * 1.15, // 15% growth forecast
      breakdown: {
        subscription: totalRevenue * 0.6,
        usage: totalRevenue * 0.25,
        revenueShare: totalRevenue * 0.1,
        other: totalRevenue * 0.05,
      },
      trends: this.generateDataPoints(period).map((t) => ({
        timestamp: t,
        value: baseRevenue + Math.random() * 100000,
      })),
    };

    this.revenueMetrics.set(metrics.id, metrics);
    return metrics;
  }

  /**
   * Get employee engagement metrics
   */
  getEmployeeEngagement(companyId: string, period: MetricPeriod = MetricPeriod.MONTH): EngagementMetrics {
    const activeEmployees = Math.floor(Math.random() * 500 + 100);
    const tokenDistributed = Math.floor(Math.random() * 100000 + 50000);

    const metrics: EngagementMetrics = {
      id: uuidv4(),
      companyId,
      period,
      activeEmployees,
      tokenDistributed,
      averageTokensPerEmployee: tokenDistributed / activeEmployees,
      topPerformers: Array.from({ length: 10 }, (_, i) => ({
        employeeId: `emp-00${i + 1}`,
        tokens: Math.floor(Math.random() * 5000 + 1000),
        rank: i + 1,
      })),
      engagementScore: Math.floor(Math.random() * 20 + 75), // 75-95
      trends: this.generateDataPoints(period).map((t) => ({
        timestamp: t,
        value: Math.floor(Math.random() * 600 + 400),
      })),
    };

    this.engagementMetrics.set(metrics.id, metrics);
    return metrics;
  }

  /**
   * Generate data points for a period
   */
  private generateDataPoints(period: MetricPeriod): Date[] {
    const points: Date[] = [];
    const now = new Date();
    let count: number;
    let interval: number;

    switch (period) {
      case MetricPeriod.HOUR:
        count = 60;
        interval = 60 * 1000; // 1 minute
        break;
      case MetricPeriod.DAY:
        count = 24;
        interval = 60 * 60 * 1000; // 1 hour
        break;
      case MetricPeriod.WEEK:
        count = 7;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case MetricPeriod.MONTH:
        count = 30;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case MetricPeriod.QUARTER:
        count = 13;
        interval = 7 * 24 * 60 * 60 * 1000; // 1 week
        break;
      case MetricPeriod.YEAR:
        count = 12;
        interval = 30 * 24 * 60 * 60 * 1000; // 1 month
        break;
    }

    for (let i = count - 1; i >= 0; i--) {
      points.push(new Date(now.getTime() - i * interval));
    }

    return points;
  }

  /**
   * Create custom report configuration
   */
  createReportConfig(
    companyId: string,
    name: string,
    description: string,
    metrics: string[],
    filters: Record<string, any>,
    format: ReportConfig['format'],
    schedule?: ReportConfig['schedule'],
    recipients: string[] = []
  ): ReportConfig {
    const config: ReportConfig = {
      id: uuidv4(),
      name,
      description,
      companyId,
      metrics,
      filters,
      schedule,
      recipients,
      format,
      createdAt: new Date(),
    };

    this.reportConfigs.set(config.id, config);
    return config;
  }

  /**
   * Generate report from configuration
   */
  generateReport(configId: string, startDate: Date, endDate: Date): GeneratedReport {
    const config = this.reportConfigs.get(configId);
    if (!config) {
      throw new Error(`Report configuration not found: ${configId}`);
    }

    // Simulate report generation
    const data = {
      usage: this.getUsageMetrics(config.companyId, MetricPeriod.MONTH),
      revenue: this.getRevenueMetrics(MetricPeriod.MONTH),
      engagement: this.getEmployeeEngagement(config.companyId, MetricPeriod.MONTH),
    };

    const report: GeneratedReport = {
      id: uuidv4(),
      configId,
      companyId: config.companyId,
      period: { start: startDate, end: endDate },
      data,
      format: config.format,
      downloadUrl: `https://reports.scrollsoul.com/${uuidv4()}.${config.format.toLowerCase()}`,
      generatedAt: new Date(),
    };

    this.generatedReports.set(report.id, report);
    return report;
  }

  /**
   * Export report to specified format
   */
  exportReport(reportId: string, format: 'PDF' | 'CSV' | 'JSON'): {
    success: boolean;
    downloadUrl?: string;
    error?: string;
  } {
    const report = this.generatedReports.get(reportId);
    if (!report) {
      return { success: false, error: 'Report not found' };
    }

    // In production, would generate actual file
    const downloadUrl = `https://reports.scrollsoul.com/${reportId}.${format.toLowerCase()}`;

    return {
      success: true,
      downloadUrl,
    };
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(companyId: string, startDate: Date, endDate: Date): ExecutiveSummary {
    const usage = this.getUsageMetrics(companyId, MetricPeriod.MONTH);
    const revenue = this.getRevenueMetrics(MetricPeriod.MONTH);
    const engagement = this.getEmployeeEngagement(companyId, MetricPeriod.MONTH);

    const summary: ExecutiveSummary = {
      id: uuidv4(),
      companyId,
      period: { start: startDate, end: endDate },
      highlights: [
        {
          title: 'Total Revenue',
          value: `$${(revenue.totalRevenue / 1000).toFixed(1)}K`,
          change: 15.5,
          positive: true,
        },
        {
          title: 'Active Users',
          value: usage.activeUsers[usage.activeUsers.length - 1]?.value.toString() || '0',
          change: 8.2,
          positive: true,
        },
        {
          title: 'Engagement Score',
          value: `${engagement.engagementScore}/100`,
          change: 12.3,
          positive: true,
        },
        {
          title: 'API Uptime',
          value: '99.98%',
          change: 0.1,
          positive: true,
        },
      ],
      revenue: {
        total: revenue.totalRevenue,
        growth: 15.5,
        forecast: revenue.forecast,
      },
      usage: {
        apiCalls: usage.apiCalls.reduce((sum, dp) => sum + dp.value, 0),
        activeUsers: usage.activeUsers[usage.activeUsers.length - 1]?.value || 0,
        uptime: 99.98,
      },
      engagement: {
        totalTokens: engagement.tokenDistributed,
        activeEmployees: engagement.activeEmployees,
        engagementScore: engagement.engagementScore,
      },
      recommendations: [
        'Consider upgrading to next pricing tier for better value at current usage levels',
        'Enable caching to reduce API calls by ~30%',
        'Employee engagement is high - great time to introduce new features',
        'Revenue trending above forecast - on track for strong quarter',
      ],
      generatedAt: new Date(),
    };

    this.executiveSummaries.set(summary.id, summary);
    return summary;
  }

  /**
   * Get report configurations by company
   */
  getReportConfigs(companyId: string): ReportConfig[] {
    return Array.from(this.reportConfigs.values()).filter((c) => c.companyId === companyId);
  }

  /**
   * Get generated reports by company
   */
  getGeneratedReports(companyId: string): GeneratedReport[] {
    return Array.from(this.generatedReports.values())
      .filter((r) => r.companyId === companyId)
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalReportConfigs: this.reportConfigs.size,
      totalGeneratedReports: this.generatedReports.size,
      totalExecutiveSummaries: this.executiveSummaries.size,
      scheduledReports: Array.from(this.reportConfigs.values()).filter((c) => c.schedule).length,
    };
  }
}

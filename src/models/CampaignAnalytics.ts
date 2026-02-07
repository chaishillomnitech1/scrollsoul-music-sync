import { v4 as uuidv4 } from 'uuid';
import { CampaignAnalytics as ICampaignAnalytics } from '../types';

/**
 * CampaignAnalytics class for tracking campaign performance
 */
export class CampaignAnalytics implements ICampaignAnalytics {
  id: string;
  placementId: string;
  campaign: string;
  brand: string;
  totalReach: number;
  totalImpressions: number;
  engagementRate?: number;
  totalRevenue: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  metrics: { [key: string]: number | string };
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<ICampaignAnalytics, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = uuidv4();
    this.placementId = data.placementId;
    this.campaign = data.campaign;
    this.brand = data.brand;
    this.totalReach = data.totalReach;
    this.totalImpressions = data.totalImpressions;
    this.engagementRate = data.engagementRate;
    this.totalRevenue = data.totalRevenue;
    this.currency = data.currency;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.metrics = data.metrics || {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update analytics data
   */
  update(data: Partial<Omit<ICampaignAnalytics, 'id' | 'createdAt'>>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  /**
   * Add or update a custom metric
   */
  setMetric(key: string, value: number | string): void {
    this.metrics[key] = value;
    this.updatedAt = new Date();
  }

  /**
   * Calculate engagement rate
   */
  calculateEngagementRate(): void {
    if (this.totalImpressions > 0) {
      this.engagementRate = (this.totalReach / this.totalImpressions) * 100;
      this.updatedAt = new Date();
    }
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    campaign: string;
    brand: string;
    reach: number;
    impressions: number;
    engagement: number;
    revenue: number;
    roi?: number;
  } {
    return {
      campaign: this.campaign,
      brand: this.brand,
      reach: this.totalReach,
      impressions: this.totalImpressions,
      engagement: this.engagementRate || 0,
      revenue: this.totalRevenue,
    };
  }

  /**
   * Convert to JSON
   */
  toJSON(): ICampaignAnalytics {
    return {
      id: this.id,
      placementId: this.placementId,
      campaign: this.campaign,
      brand: this.brand,
      totalReach: this.totalReach,
      totalImpressions: this.totalImpressions,
      engagementRate: this.engagementRate,
      totalRevenue: this.totalRevenue,
      currency: this.currency,
      startDate: this.startDate,
      endDate: this.endDate,
      metrics: this.metrics,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

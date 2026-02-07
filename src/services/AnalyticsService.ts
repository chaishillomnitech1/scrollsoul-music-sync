import { CampaignAnalytics } from '../models/CampaignAnalytics';
import { CampaignAnalytics as ICampaignAnalytics, SortByMetric, BrandAnalyticsStats } from '../types';

/**
 * AnalyticsService handles campaign analytics
 */
export class AnalyticsService {
  private analytics: Map<string, CampaignAnalytics> = new Map();

  /**
   * Create new campaign analytics
   */
  createAnalytics(
    data: Omit<ICampaignAnalytics, 'id' | 'createdAt' | 'updatedAt'>
  ): CampaignAnalytics {
    const analytics = new CampaignAnalytics(data);
    this.analytics.set(analytics.id, analytics);
    return analytics;
  }

  /**
   * Get analytics by ID
   */
  getAnalytics(id: string): CampaignAnalytics | undefined {
    return this.analytics.get(id);
  }

  /**
   * Get all analytics
   */
  getAllAnalytics(): CampaignAnalytics[] {
    return Array.from(this.analytics.values());
  }

  /**
   * Get analytics by placement
   */
  getAnalyticsByPlacement(placementId: string): CampaignAnalytics | undefined {
    return Array.from(this.analytics.values()).find(
      (analytics) => analytics.placementId === placementId
    );
  }

  /**
   * Get analytics by brand (Nike, NCAA, etc.)
   */
  getAnalyticsByBrand(brand: string): CampaignAnalytics[] {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.brand.toLowerCase().includes(brand.toLowerCase())
    );
  }

  /**
   * Get analytics by campaign
   */
  getAnalyticsByCampaign(campaign: string): CampaignAnalytics[] {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.campaign.toLowerCase().includes(campaign.toLowerCase())
    );
  }

  /**
   * Update analytics
   */
  updateAnalytics(
    id: string,
    data: Partial<Omit<ICampaignAnalytics, 'id' | 'createdAt'>>
  ): CampaignAnalytics {
    const analytics = this.analytics.get(id);
    if (!analytics) {
      throw new Error(`Analytics not found: ${id}`);
    }

    analytics.update(data);
    return analytics;
  }

  /**
   * Delete analytics
   */
  deleteAnalytics(id: string): boolean {
    return this.analytics.delete(id);
  }

  /**
   * Get total revenue across all campaigns
   */
  getTotalRevenue(currency: string = 'USD'): number {
    return Array.from(this.analytics.values())
      .filter((analytics) => analytics.currency === currency)
      .reduce((total, analytics) => total + analytics.totalRevenue, 0);
  }

  /**
   * Get total reach across all campaigns
   */
  getTotalReach(): number {
    return Array.from(this.analytics.values()).reduce(
      (total, analytics) => total + analytics.totalReach,
      0
    );
  }

  /**
   * Get total impressions across all campaigns
   */
  getTotalImpressions(): number {
    return Array.from(this.analytics.values()).reduce(
      (total, analytics) => total + analytics.totalImpressions,
      0
    );
  }

  /**
   * Get top performing campaigns
   */
  getTopCampaigns(limit: number = 10, sortBy: SortByMetric = 'revenue'): CampaignAnalytics[] {
    const sorted = Array.from(this.analytics.values()).sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'reach':
          return b.totalReach - a.totalReach;
        case 'impressions':
          return b.totalImpressions - a.totalImpressions;
        default:
          return 0;
      }
    });

    return sorted.slice(0, limit);
  }

  /**
   * Get campaign performance summary
   */
  getSummary(): {
    totalCampaigns: number;
    totalRevenue: number;
    totalReach: number;
    totalImpressions: number;
    averageEngagement: number;
  } {
    const all = Array.from(this.analytics.values());
    const totalEngagement = all.reduce(
      (sum, analytics) => sum + (analytics.engagementRate || 0),
      0
    );

    return {
      totalCampaigns: all.length,
      totalRevenue: this.getTotalRevenue(),
      totalReach: this.getTotalReach(),
      totalImpressions: this.getTotalImpressions(),
      averageEngagement: all.length > 0 ? totalEngagement / all.length : 0,
    };
  }

  /**
   * Get brand performance comparison
   */
  getBrandComparison(): Map<string, BrandAnalyticsStats> {
    const comparison = new Map<string, BrandAnalyticsStats>();

    Array.from(this.analytics.values()).forEach((analytics) => {
      const current = comparison.get(analytics.brand) || {
        campaigns: 0,
        revenue: 0,
        reach: 0,
        impressions: 0,
      };

      comparison.set(analytics.brand, {
        campaigns: current.campaigns + 1,
        revenue: current.revenue + analytics.totalRevenue,
        reach: current.reach + analytics.totalReach,
        impressions: current.impressions + analytics.totalImpressions,
      });
    });

    return comparison;
  }
}

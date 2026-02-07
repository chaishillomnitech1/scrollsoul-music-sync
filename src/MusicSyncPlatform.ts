import { TrackService } from './services/TrackService';
import { LicenseService } from './services/LicenseService';
import { PlacementService } from './services/PlacementService';
import { RoyaltyService } from './services/RoyaltyService';
import { AnalyticsService } from './services/AnalyticsService';
import { VydiaClient } from './integrations/VydiaClient';
import { config } from './utils/config';

/**
 * MusicSyncPlatform - Main class that orchestrates all services
 * 
 * ScrollSoul Music Sync Platform ensures your sovereign sound frequencies
 * align with global markets and omniversal resonance.
 */
export class MusicSyncPlatform {
  public trackService: TrackService;
  public licenseService: LicenseService;
  public placementService: PlacementService;
  public royaltyService: RoyaltyService;
  public analyticsService: AnalyticsService;
  public vydiaClient?: VydiaClient;

  constructor(vydiaApiKey?: string) {
    this.trackService = new TrackService();
    this.licenseService = new LicenseService();
    this.placementService = new PlacementService();
    this.royaltyService = new RoyaltyService();
    this.analyticsService = new AnalyticsService();

    // Initialize Vydia integration if API key is provided
    if (vydiaApiKey || config.vydiaApiKey) {
      this.vydiaClient = new VydiaClient(
        vydiaApiKey || config.vydiaApiKey!,
        config.vydiaApiUrl
      );
    }
  }

  /**
   * Get platform statistics
   */
  getStats() {
    return {
      tracks: this.trackService.getTrackCount(),
      licenses: this.licenseService.getStats(),
      royalties: this.royaltyService.getStats(),
      analytics: this.analyticsService.getSummary(),
      totalViews: this.placementService.getTotalViews(),
      totalImpressions: this.placementService.getTotalImpressions(),
    };
  }

  /**
   * Get comprehensive report for a track
   */
  getTrackReport(trackId: string) {
    const track = this.trackService.getTrack(trackId);
    if (!track) {
      throw new Error(`Track not found: ${trackId}`);
    }

    const licenses = this.licenseService.getLicensesByTrack(trackId);
    const placements = this.placementService.getPlacementsByTrack(trackId);
    const royalties = this.royaltyService.getRoyaltiesByTrack(trackId);
    const vydiaStatus = this.vydiaClient?.getSyncStatus(trackId);

    return {
      track: track.toJSON(),
      licenses: licenses.map((l) => l.toJSON()),
      placements: placements.map((p) => p.toJSON()),
      royalties: royalties.map((r) => r.toJSON()),
      vydiaSync: vydiaStatus,
      totalLicensingRevenue: licenses.reduce((sum, l) => sum + l.fee, 0),
      totalRoyaltiesEarned: royalties
        .filter((r) => r.status === 'PAID')
        .reduce((sum, r) => sum + r.amount, 0),
      totalRoyaltiesPending: royalties
        .filter((r) => r.status !== 'PAID')
        .reduce((sum, r) => sum + r.amount, 0),
    };
  }

  /**
   * Sync all tracks to Vydia
   */
  async syncAllTracksToVydia() {
    if (!this.vydiaClient) {
      throw new Error('Vydia client not initialized');
    }

    const tracks = this.trackService.getAllTracks();
    const results = await this.vydiaClient.syncMultipleTracks(tracks.map((t) => t.toJSON()));

    return {
      total: results.length,
      synced: results.filter((r) => r.syncStatus === 'SYNCED').length,
      failed: results.filter((r) => r.syncStatus === 'FAILED').length,
      results,
    };
  }

  /**
   * Process all pending royalties
   */
  processPendingRoyalties() {
    const pendingRoyalties = this.royaltyService.getRoyaltiesByStatus('CALCULATED');
    const royaltyIds = pendingRoyalties.map((r) => r.id);

    return this.royaltyService.batchProcessPayments(royaltyIds);
  }

  /**
   * Update all license statuses
   */
  updateLicenseStatuses() {
    this.licenseService.updateAllStatuses();
  }

  /**
   * Get brand performance report
   */
  getBrandPerformanceReport() {
    const brandStats = this.placementService.getStatsByBrand();
    const brandAnalytics = this.analyticsService.getBrandComparison();

    const report = new Map<string, any>();

    for (const [brand, stats] of brandStats.entries()) {
      const analytics = brandAnalytics.get(brand) || {
        campaigns: 0,
        revenue: 0,
        reach: 0,
        impressions: 0,
      };

      report.set(brand, {
        ...stats,
        ...analytics,
      });
    }

    return report;
  }

  /**
   * Get campaign performance for specific brands (Nike, NCAA, etc.)
   */
  getCampaignPerformance(brand: string) {
    const placements = this.placementService.getPlacementsByBrand(brand);
    const analytics = this.analyticsService.getAnalyticsByBrand(brand);

    return {
      brand,
      totalPlacements: placements.length,
      campaigns: analytics.map((a) => a.getSummary()),
      totalRevenue: analytics.reduce((sum, a) => sum + a.totalRevenue, 0),
      totalReach: analytics.reduce((sum, a) => sum + a.totalReach, 0),
      totalImpressions: analytics.reduce((sum, a) => sum + a.totalImpressions, 0),
    };
  }
}

import { MusicSyncPlatform } from '../MusicSyncPlatform';
import { LicenseType } from '../types';

describe('MusicSyncPlatform', () => {
  let platform: MusicSyncPlatform;

  beforeEach(() => {
    platform = new MusicSyncPlatform();
  });

  it('should initialize all services', () => {
    expect(platform.trackService).toBeDefined();
    expect(platform.licenseService).toBeDefined();
    expect(platform.placementService).toBeDefined();
    expect(platform.royaltyService).toBeDefined();
    expect(platform.analyticsService).toBeDefined();
  });

  it('should get platform stats', () => {
    const stats = platform.getStats();

    expect(stats).toBeDefined();
    expect(stats.tracks).toBe(0);
    expect(stats.licenses).toBeDefined();
    expect(stats.royalties).toBeDefined();
    expect(stats.analytics).toBeDefined();
  });

  it('should create and get track report', () => {
    const track = platform.trackService.createTrack({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const license = platform.licenseService.createLicense({
      trackId: track.id,
      licenseType: LicenseType.SYNC,
      licensee: 'Nike Inc.',
      territory: ['USA'],
      startDate: new Date(),
      fee: 50000,
      currency: 'USD',
      status: 'ACTIVE',
    });

    platform.placementService.createPlacement({
      trackId: track.id,
      licenseId: license.id,
      campaign: 'Nike Campaign',
      brand: 'Nike',
      mediaType: 'ADVERTISING',
      territory: ['USA'],
    });

    const report = platform.getTrackReport(track.id);

    expect(report.track).toBeDefined();
    expect(report.licenses).toHaveLength(1);
    expect(report.placements).toHaveLength(1);
    expect(report.totalLicensingRevenue).toBe(50000);
  });

  it('should get brand performance report', () => {
    const track = platform.trackService.createTrack({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const license = platform.licenseService.createLicense({
      trackId: track.id,
      licenseType: LicenseType.SYNC,
      licensee: 'Nike Inc.',
      territory: ['USA'],
      startDate: new Date(),
      fee: 50000,
      currency: 'USD',
      status: 'ACTIVE',
    });

    platform.placementService.createPlacement({
      trackId: track.id,
      licenseId: license.id,
      campaign: 'Nike Campaign',
      brand: 'Nike',
      mediaType: 'ADVERTISING',
      territory: ['USA'],
      viewCount: 1000000,
      impressions: 5000000,
    });

    const report = platform.getBrandPerformanceReport();
    expect(report.size).toBeGreaterThan(0);

    const nikeStats = report.get('Nike');
    expect(nikeStats).toBeDefined();
    expect(nikeStats.count).toBe(1);
    expect(nikeStats.views).toBe(1000000);
  });

  it('should get campaign performance for specific brand', () => {
    const track = platform.trackService.createTrack({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const license = platform.licenseService.createLicense({
      trackId: track.id,
      licenseType: LicenseType.SYNC,
      licensee: 'NCAA',
      territory: ['USA'],
      startDate: new Date(),
      fee: 75000,
      currency: 'USD',
      status: 'ACTIVE',
    });

    const placement = platform.placementService.createPlacement({
      trackId: track.id,
      licenseId: license.id,
      campaign: 'NCAA March Madness',
      brand: 'NCAA',
      mediaType: 'SPORTS',
      territory: ['USA'],
    });

    platform.analyticsService.createAnalytics({
      placementId: placement.id,
      campaign: 'NCAA March Madness',
      brand: 'NCAA',
      totalReach: 10000000,
      totalImpressions: 25000000,
      totalRevenue: 75000,
      currency: 'USD',
      startDate: new Date(),
      endDate: new Date(),
      metrics: {},
    });

    const performance = platform.getCampaignPerformance('NCAA');

    expect(performance).toBeDefined();
    expect(performance.brand).toBe('NCAA');
    expect(performance.totalPlacements).toBe(1);
    expect(performance.totalRevenue).toBe(75000);
  });
});

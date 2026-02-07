import { MusicSyncPlatform } from './MusicSyncPlatform';
import { LicenseType } from './types';

/**
 * Demo usage of the ScrollSoul Music Sync Platform
 */
async function demo() {
  console.log('🎵 ScrollSoul Music Sync Platform Demo 🌌\n');

  // Initialize the platform
  const platform = new MusicSyncPlatform();

  // 1. Create a track with comprehensive metadata
  console.log('1. Creating track with comprehensive metadata...');
  const track = platform.trackService.createTrack({
    title: 'Omniversal Resonance',
    artist: 'ScrollSoul',
    album: 'Dimensional Frequencies',
    duration: 245,
    genre: 'Electronic',
    isrc: 'USRC17607839',
    bpm: 128,
    key: 'Am',
    mood: ['energetic', 'futuristic', 'uplifting'],
    tags: ['sync-ready', 'sports', 'advertising'],
  });
  console.log(`✓ Created track: ${track.title} by ${track.artist}\n`);

  // 2. Create a license for Nike campaign
  console.log('2. Creating license for Nike campaign...');
  const license = platform.licenseService.createLicense({
    trackId: track.id,
    licenseType: LicenseType.SYNC,
    licensee: 'Nike Inc.',
    territory: ['USA', 'Canada', 'Mexico'],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    fee: 50000,
    currency: 'USD',
    status: 'ACTIVE',
    terms: 'Sync license for Nike Air Max 2024 campaign',
  });
  console.log(`✓ Created license for ${license.licensee} - $${license.fee}\n`);

  // 3. Create placement for Nike campaign
  console.log('3. Creating placement for Nike Air Max 2024 campaign...');
  const placement = platform.placementService.createPlacement({
    trackId: track.id,
    licenseId: license.id,
    campaign: 'Nike Air Max 2024',
    brand: 'Nike',
    mediaType: 'ADVERTISING',
    airDate: new Date('2024-02-01'),
    territory: ['USA', 'Canada'],
    viewCount: 5000000,
    impressions: 15000000,
  });
  console.log(`✓ Created placement: ${placement.campaign} - ${placement.viewCount} views\n`);

  // 4. Create campaign analytics
  console.log('4. Creating campaign analytics...');
  const analytics = platform.analyticsService.createAnalytics({
    placementId: placement.id,
    campaign: 'Nike Air Max 2024',
    brand: 'Nike',
    totalReach: 5000000,
    totalImpressions: 15000000,
    engagementRate: 8.5,
    totalRevenue: 50000,
    currency: 'USD',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-31'),
    metrics: {
      clickThroughRate: 2.3,
      conversionRate: 0.8,
      socialShares: 125000,
    },
  });
  console.log(`✓ Created analytics: ${analytics.campaign} - $${analytics.totalRevenue} revenue\n`);

  // 5. Create royalty payments
  console.log('5. Creating royalty payments...');
  const artistRoyalty = platform.royaltyService.createRoyalty({
    trackId: track.id,
    placementId: placement.id,
    amount: 25000,
    currency: 'USD',
    payee: 'ScrollSoul',
    payeeType: 'ARTIST',
    percentage: 50,
    periodStart: new Date('2024-02-01'),
    periodEnd: new Date('2024-03-31'),
    status: 'CALCULATED',
  });
  console.log(`✓ Created royalty for ${artistRoyalty.payee} - $${artistRoyalty.amount}\n`);

  // 6. Create NCAA placement
  console.log('6. Creating NCAA March Madness placement...');
  const ncaaLicense = platform.licenseService.createLicense({
    trackId: track.id,
    licenseType: LicenseType.SYNC,
    licensee: 'NCAA',
    territory: ['USA'],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    fee: 75000,
    currency: 'USD',
    status: 'ACTIVE',
    terms: 'Sync license for NCAA March Madness coverage',
  });

  const ncaaPlacement = platform.placementService.createPlacement({
    trackId: track.id,
    licenseId: ncaaLicense.id,
    campaign: 'NCAA March Madness 2024',
    brand: 'NCAA',
    mediaType: 'SPORTS',
    airDate: new Date('2024-03-15'),
    territory: ['USA'],
    viewCount: 10000000,
    impressions: 25000000,
  });
  console.log(`✓ Created NCAA placement: ${ncaaPlacement.campaign}\n`);

  // 7. Get comprehensive platform stats
  console.log('7. Platform Statistics:\n');
  const stats = platform.getStats();
  console.log('Platform Stats:', JSON.stringify(stats, null, 2));
  console.log();

  // 8. Get track report
  console.log('8. Track Report:\n');
  const trackReport = platform.getTrackReport(track.id);
  console.log(`Track: ${trackReport.track.title}`);
  console.log(`Total Licenses: ${trackReport.licenses.length}`);
  console.log(`Total Placements: ${trackReport.placements.length}`);
  console.log(`Total Licensing Revenue: $${trackReport.totalLicensingRevenue}`);
  console.log(`Total Royalties Earned: $${trackReport.totalRoyaltiesEarned}`);
  console.log();

  // 9. Get brand performance report
  console.log('9. Brand Performance Report:\n');
  const brandReport = platform.getBrandPerformanceReport();
  for (const [brand, performance] of brandReport.entries()) {
    console.log(`${brand}:`, performance);
  }
  console.log();

  // 10. Get Nike campaign performance
  console.log('10. Nike Campaign Performance:\n');
  const nikePerformance = platform.getCampaignPerformance('Nike');
  console.log(JSON.stringify(nikePerformance, null, 2));

  console.log('\n🌌 Demo complete! ScrollSoul resonates across dimensions. ✨');
}

// Run demo if this file is executed directly
if (require.main === module) {
  demo().catch(console.error);
}

export { demo };

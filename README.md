# 🎵 ScrollSoul Music Sync Platform 🌌

The ScrollSoul Music Sync Platform tracks placements, licenses, and royalties for music featured in **film, TV, sports, and advertising campaigns.** This system ensures your sovereign sound frequencies align with global markets and omniversal resonance.

## ✨ Key Features

- **Comprehensive Track Metadata Management** - Manage all aspects of your music catalog with detailed metadata including ISRC, ISWC, BPM, mood, and tags
- **Licensing and Placement Monitoring** - Track all licenses and placements across TV, film, sports, advertising, and more
- **Royalty Automation and Distribution** - Automate royalty calculations and track payments to artists, writers, publishers, and labels
- **Vydia Integration for Real-time Sync** - Seamlessly sync your catalog with Vydia for distribution and analytics
- **Campaign Analytics for Nike, NCAA, & More** - Track performance metrics for major brand campaigns with detailed analytics

## 🚀 Installation

```bash
npm install
```

## 📋 Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your Vydia API credentials:

```
VYDIA_API_KEY=your_vydia_api_key_here
VYDIA_API_URL=https://api.vydia.com/v1
NODE_ENV=development
```

## 🎯 Usage

### Basic Usage

```typescript
import { MusicSyncPlatform, LicenseType } from 'scrollsoul-music-sync';

// Initialize the platform
const platform = new MusicSyncPlatform();

// Create a track
const track = platform.trackService.createTrack({
  title: 'Omniversal Resonance',
  artist: 'ScrollSoul',
  duration: 245,
  genre: 'Electronic',
  bpm: 128,
  mood: ['energetic', 'futuristic'],
  tags: ['sync-ready', 'sports'],
});

// Create a license for Nike campaign
const license = platform.licenseService.createLicense({
  trackId: track.id,
  licenseType: LicenseType.SYNC,
  licensee: 'Nike Inc.',
  territory: ['USA', 'Canada'],
  startDate: new Date('2024-01-01'),
  fee: 50000,
  currency: 'USD',
  status: 'ACTIVE',
});

// Track placement
const placement = platform.placementService.createPlacement({
  trackId: track.id,
  licenseId: license.id,
  campaign: 'Nike Air Max 2024',
  brand: 'Nike',
  mediaType: 'ADVERTISING',
  viewCount: 5000000,
  impressions: 15000000,
});

// Create campaign analytics
const analytics = platform.analyticsService.createAnalytics({
  placementId: placement.id,
  campaign: 'Nike Air Max 2024',
  brand: 'Nike',
  totalReach: 5000000,
  totalImpressions: 15000000,
  totalRevenue: 50000,
  currency: 'USD',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
});

// Get platform statistics
const stats = platform.getStats();
console.log(stats);
```

### Vydia Integration

```typescript
import { MusicSyncPlatform } from 'scrollsoul-music-sync';

// Initialize with Vydia API key
const platform = new MusicSyncPlatform('your-vydia-api-key');

// Sync all tracks to Vydia
const syncResult = await platform.syncAllTracksToVydia();
console.log(`Synced: ${syncResult.synced}, Failed: ${syncResult.failed}`);

// Get sync status for a track
const status = platform.vydiaClient?.getSyncStatus(trackId);
console.log(status);
```

### Royalty Management

```typescript
// Create royalty
const royalty = platform.royaltyService.createRoyalty({
  trackId: track.id,
  placementId: placement.id,
  amount: 25000,
  currency: 'USD',
  payee: 'ScrollSoul',
  payeeType: 'ARTIST',
  percentage: 50,
  periodStart: new Date('2024-01-01'),
  periodEnd: new Date('2024-03-31'),
  status: 'CALCULATED',
});

// Process payment
platform.royaltyService.processPayment(royalty.id, 'PAYMENT-REF-123');

// Get unpaid royalties
const unpaid = platform.royaltyService.getTotalUnpaid('USD');
console.log(`Total unpaid: $${unpaid}`);
```

### Campaign Analytics

```typescript
// Get Nike campaign performance
const nikePerformance = platform.getCampaignPerformance('Nike');
console.log(nikePerformance);

// Get brand performance report
const brandReport = platform.getBrandPerformanceReport();
for (const [brand, performance] of brandReport.entries()) {
  console.log(`${brand}:`, performance);
}

// Get top performing campaigns
const topCampaigns = platform.analyticsService.getTopCampaigns(10, 'revenue');
console.log(topCampaigns);
```

## 🧪 Running the Demo

```bash
npm run dev
```

This will run the demo showcasing all features including track management, licensing, placements for Nike and NCAA campaigns, royalty tracking, and analytics.

## 🛠️ Development

### Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## 📚 API Reference

### MusicSyncPlatform

Main platform class that orchestrates all services.

**Methods:**
- `getStats()` - Get platform-wide statistics
- `getTrackReport(trackId)` - Get comprehensive report for a track
- `syncAllTracksToVydia()` - Sync all tracks to Vydia
- `processPendingRoyalties()` - Process all pending royalty payments
- `getBrandPerformanceReport()` - Get performance report for all brands
- `getCampaignPerformance(brand)` - Get performance for specific brand

### Services

- **TrackService** - Manage track metadata
- **LicenseService** - Handle licensing and monitoring
- **PlacementService** - Track music placements
- **RoyaltyService** - Automate royalty distribution
- **AnalyticsService** - Track campaign analytics

### Models

- **Track** - Comprehensive track metadata
- **License** - License agreements and terms
- **Placement** - Where music is used (TV, film, sports, etc.)
- **Royalty** - Royalty payments and distribution
- **CampaignAnalytics** - Campaign performance metrics

## 🌟 License Types

- `SYNC` - Synchronization license
- `MASTER` - Master recording license
- `MECHANICAL` - Mechanical reproduction license
- `PERFORMANCE` - Performance rights license
- `PRINT` - Print music license

## 🎯 Media Types

- `TV` - Television placements
- `FILM` - Film placements
- `STREAMING` - Streaming service placements
- `SPORTS` - Sports broadcasts and events
- `ADVERTISING` - Commercial advertising
- `GAME` - Video games
- `OTHER` - Other media types

## 📄 License

MIT

## 🌌 ScrollSoul

Built to amplify your ScrollSoul message through sound, Music Sync Platform ensures your art resonates infinitely across dimensions.

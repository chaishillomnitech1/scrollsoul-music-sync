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
# 🎵 ScrollSoul Music Sync Platform

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The **ScrollSoul Music Sync Platform** is a comprehensive music placement, licensing, and royalty tracking system designed for managing music synchronization across film, TV, sports, and advertising campaigns.

---

## 🌟 Features

- **📊 Placement Tracking**: Track music placements in TV, film, sports, and advertising
- **📝 License Management**: Manage synchronization and master use licenses
- **💰 Royalty Tracking**: Monitor and track royalty payments in real-time
- **🔗 Platform Integration**: Connect with Spotify, Vydia, NCAA, Nike, and other platforms
- **📡 API-First Design**: RESTful API for easy integration with other systems
- **⚡ Real-Time Sync**: Synchronize data across all connected platforms

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chaishillomnitech1/scrollsoul-music-sync.git
   cd scrollsoul-music-sync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
```http
GET /health
```
Returns the system status and health of all services.

#### Placements

- `GET /api/placements` - Get all placements
- `GET /api/placements/:id` - Get placement by ID
- `POST /api/placements` - Create new placement
- `PUT /api/placements/:id` - Update placement
- `DELETE /api/placements/:id` - Delete placement

**Example Placement Creation:**
```json
POST /api/placements
{
  "trackName": "My Track",
  "artist": "Artist Name",
  "placementType": "TV Commercial",
  "brand": "Brand Name",
  "campaign": "Campaign Name",
  "airDate": "2024-01-15",
  "duration": 30,
  "territory": "Global"
}
```

#### Licenses

- `GET /api/licenses` - Get all licenses
- `GET /api/licenses/:id` - Get license by ID
- `POST /api/licenses` - Create new license
- `PUT /api/licenses/:id` - Update license
- `DELETE /api/licenses/:id` - Delete license

**Example License Creation:**
```json
POST /api/licenses
{
  "trackName": "My Track",
  "licenseType": "Synchronization",
  "licensee": "Company Name",
  "territory": "Worldwide",
  "startDate": "2024-01-01",
  "endDate": "2025-01-01",
  "fee": 50000,
  "currency": "USD"
}
```

#### Royalties

- `GET /api/royalties` - Get all royalty records
- `GET /api/royalties/:id` - Get royalty by ID
- `GET /api/royalties/summary/all` - Get royalty summary
- `POST /api/royalties` - Create new royalty record
- `PUT /api/royalties/:id` - Update royalty record

**Example Royalty Creation:**
```json
POST /api/royalties
{
  "trackName": "My Track",
  "placementId": "1",
  "paymentType": "Synchronization Fee",
  "amount": 50000,
  "currency": "USD",
  "paymentDate": "2024-01-15",
  "platform": "Spotify"
}
```

#### Platforms

- `GET /api/platforms` - Get all platform connections
- `GET /api/platforms/status` - Get platform status overview
- `GET /api/platforms/:platform` - Get platform-specific data
- `POST /api/platforms/sync/:platform` - Sync with specific platform

**Supported Platforms:**
- `spotify` - Streaming platform
- `vydia` - Distribution platform
- `ncaa` - Licensing (sports)
- `nike` - Advertising campaigns

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Platform API Keys
SPOTIFY_API_KEY=your_spotify_api_key_here
VYDIA_API_KEY=your_vydia_api_key_here
NCAA_API_KEY=your_ncaa_api_key_here
NIKE_API_KEY=your_nike_api_key_here

# Database (optional, for future expansion)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scrollsoul_music
```

---

## 📦 Project Structure

```
scrollsoul-music-sync/
├── src/
│   ├── index.js              # Main application entry point
│   ├── routes/               # API route handlers
│   │   ├── placements.js     # Placement routes
│   │   ├── licenses.js       # License routes
│   │   ├── royalties.js      # Royalty routes
│   │   └── platforms.js      # Platform integration routes
│   └── services/             # Business logic layer
│       ├── placementService.js
│       ├── licenseService.js
│       ├── royaltyService.js
│       └── platformService.js
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## 🔄 Development Workflow

### Running in Development Mode
```bash
npm run dev
```

### Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Health check
curl http://localhost:3000/health

# Get all placements
curl http://localhost:3000/api/placements

# Get royalty summary
curl http://localhost:3000/api/royalties/summary/all

# Check platform status
curl http://localhost:3000/api/platforms/status
```

---

## 🌐 Platform Integrations

### Spotify
- **Type**: Streaming platform
- **Features**: Track streaming data, performance royalties
- **Sync**: Real-time sync of track metadata and streaming stats

### Vydia
- **Type**: Distribution platform
- **Features**: Multi-platform distribution (YouTube, Apple Music, Spotify)
- **Sync**: Automatic distribution tracking

### NCAA
- **Type**: Sports licensing
- **Features**: Track usage in NCAA events and campaigns
- **Sync**: Campaign-based tracking

### Nike
- **Type**: Advertising
- **Features**: Track placements in Nike advertising campaigns
- **Sync**: Brand partnership management

---

## 🚢 Deployment

### Deployment Steps

1. **Install dependencies**
   ```bash
   npm install --production
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file with production values
   cp .env.example .env
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment (Future Enhancement)

```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Data Models

### Placement Model
```javascript
{
  id: String,
  trackName: String,
  artist: String,
  placementType: String,    // TV Commercial, Film, Sports, etc.
  brand: String,
  campaign: String,
  airDate: Date,
  duration: Number,         // in seconds
  territory: String,
  status: String,           // active, pending, completed
  createdAt: Date,
  updatedAt: Date
}
```

### License Model
```javascript
{
  id: String,
  trackName: String,
  licenseType: String,      // Synchronization, Master Use, etc.
  licensee: String,
  territory: String,
  startDate: Date,
  endDate: Date,
  fee: Number,
  currency: String,
  status: String,           // active, pending, expired
  createdAt: Date,
  updatedAt: Date
}
```

### Royalty Model
```javascript
{
  id: String,
  trackName: String,
  placementId: String,
  paymentType: String,      // Sync Fee, Performance Royalty, etc.
  amount: Number,
  currency: String,
  paymentDate: Date,
  status: String,           // paid, pending
  platform: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌌 About ScrollSoul

ScrollSoul is a sovereign music platform dedicated to elevating consciousness through sound and frequency. This music sync platform ensures your creative work reaches global audiences while maintaining full tracking and transparency of all placements, licenses, and royalties.

---

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Status**: ✅ ACTIVE | **Version**: 1.0.0 | **Last Updated**: 2024

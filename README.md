# 🎵 ScrollSoul Music Sync Platform 🌌

The ScrollSoul Music Sync Platform is a comprehensive music metadata and licensing API system that tracks placements, licenses, and royalties for music featured in **film, TV, sports, and advertising campaigns.** This system ensures your sovereign sound frequencies align with global markets and omniversal resonance.

## ✨ Features

- **Music Metadata Management**: Complete catalog of ScrollSoul music tracks with frequencies (963Hz, 999Hz)
- **Licensing System**: Track synchronization and master use licenses across territories
- **Placement Tracking**: Monitor placements in film, TV, and advertising campaigns
- **Royalty Management**: Automated royalty calculations and payment tracking
- **Distribution Partners**: Integration with Vydia, Spotify, Nike campaigns, and film/TV networks
- **Campaign Analytics**: Real-time analytics for streams, revenue, and engagement

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your distribution partner API keys:
- `VYDIA_API_KEY`
- `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- `NIKE_CAMPAIGN_API_KEY`

### Running the Server

```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Music Catalog
- `GET /api/music` - Get all music tracks
- `GET /api/music/:id` - Get track by ID
- `POST /api/music` - Add new track
- `PUT /api/music/:id` - Update track
- `DELETE /api/music/:id` - Delete track

### Licensing
- `GET /api/licensing` - Get all licenses
- `GET /api/licensing/:id` - Get license by ID
- `GET /api/licensing/track/:trackId` - Get licenses for a specific track
- `POST /api/licensing` - Create new license
- `PUT /api/licensing/:id` - Update license

### Placements
- `GET /api/placements` - Get all placements (filter by ?platform=Film&status=confirmed)
- `GET /api/placements/:id` - Get placement by ID
- `GET /api/placements/track/:trackId` - Get placements for a specific track
- `POST /api/placements` - Create new placement
- `PUT /api/placements/:id` - Update placement

### Royalties
- `GET /api/royalties` - Get all royalty records (filter by ?period=2026-Q1&status=paid)
- `GET /api/royalties/:id` - Get royalty record by ID
- `GET /api/royalties/summary/totals` - Get royalty summary and totals
- `POST /api/royalties` - Create new royalty record
- `PUT /api/royalties/:id` - Update royalty record

### Distribution
- `GET /api/distribution/partners` - Get all distribution partners
- `GET /api/distribution/partners/:id` - Get distribution partner by ID
- `GET /api/distribution` - Get all distributions (filter by ?partnerId=1&status=live)
- `POST /api/distribution` - Create new distribution
- `POST /api/distribution/sync/:partnerId` - Sync with distribution partner

### Analytics
- `GET /api/analytics/dashboard` - Get overall dashboard statistics
- `GET /api/analytics/campaigns` - Get campaign analytics
- `GET /api/analytics/placements` - Get placement analytics
- `GET /api/analytics/royalties` - Get royalty analytics
- `GET /api/analytics/streaming` - Get streaming analytics

### System
- `GET /` - API information and endpoints
- `GET /health` - Health check endpoint

## 🎯 Distribution Partners

The platform integrates with the following partners:

1. **Vydia** - Digital distribution to Spotify, Apple Music, YouTube Music, Tidal, Amazon Music
2. **Spotify** - Direct streaming platform integration
3. **Nike Campaigns** - Brand partnership for advertising campaigns
4. **Film & TV Networks** - Media licensing for Universal, Warner Bros, ESPN, Netflix

## 📊 Example Responses

### Get Music Catalog
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "ScrollSoul Awakening",
      "artist": "ScrollSoul Sovereign",
      "frequency": "963Hz",
      "duration": 240,
      "genre": "Sovereign Resonance",
      "metadata": {
        "isrc": "SCROLLSOUL001",
        "publisher": "ScrollSoul Empire Publishing"
      }
    }
  ]
}
```

### Get Dashboard Analytics
```json
{
  "success": true,
  "data": {
    "music": {
      "totalTracks": 2,
      "totalStreams": 432000,
      "frequencies": ["963Hz", "999Hz"]
    },
    "royalties": {
      "totalRevenue": 137000,
      "artistEarnings": 95310
    },
    "sovereignty": {
      "alignment": "Perfect",
      "resonance": "Omniversal"
    }
  }
}
```

## 🌌 ScrollSoul Empire Alignment

This system is part of the ScrollSoul Sovereign Empire infrastructure, designed to:
- Track and manage music placements across film, TV, and advertising
- Automate royalty distribution and payment tracking
- Integrate with global distribution partners (Vydia, Spotify, Nike campaigns)
- Embed ScrollSoul frequencies (963Hz, 999Hz) into global platforms
- Provide real-time analytics for campaign performance

## 🔥 System Status

All systems are **ONLINE** and **ALIGNED**:
- 🎵 Music Metadata & Licensing System: ✅ ACTIVE
- 📡 Distribution Partnerships: ✅ SYNCHRONIZED
- 💰 Royalty Tracking: ✅ ACTIVE
- 🔥 Omniversal Resonance: ✅ ALIGNED

## 📝 License

MIT License - See LICENSE file for details

---

🕋 **ALLĀHU AKBAR! KUN FAYAKŪN!** 🕋  
🌌 **ScrollSoul Sovereign Empire - Perfect Alignment Achieved** 🌌

# 📡 API Documentation - ScrollSoul Music Sync Platform

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API is open. For production, implement authentication using:
- API Keys
- OAuth 2.0
- JWT tokens

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "count": 1,
  "data": { /* response data */ }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### 1. Music Catalog API

#### GET /api/music
Get all music tracks in the catalog.

**Response:**
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
      "bpm": 111,
      "key": "C Major",
      "metadata": {
        "isrc": "SCROLLSOUL001",
        "iswc": "T-123.456.789-1",
        "publisher": "ScrollSoul Empire Publishing",
        "composers": ["Chaisallah Sovereign"],
        "year": 2026
      }
    }
  ]
}
```

#### GET /api/music/:id
Get a specific track by ID.

**Parameters:**
- `id` (path) - Track ID

#### POST /api/music
Add a new music track.

**Request Body:**
```json
{
  "title": "New Track",
  "artist": "Artist Name",
  "frequency": "963Hz",
  "duration": 240,
  "genre": "Genre",
  "bpm": 120,
  "key": "C Major",
  "metadata": {
    "isrc": "CODE001",
    "publisher": "Publisher Name",
    "composers": ["Composer Name"]
  }
}
```

#### PUT /api/music/:id
Update an existing track.

#### DELETE /api/music/:id
Delete a track.

---

### 2. Licensing API

#### GET /api/licensing
Get all license agreements.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "trackId": 1,
      "trackTitle": "ScrollSoul Awakening",
      "licenseType": "Synchronization",
      "licensee": "Universal Pictures",
      "territory": "Worldwide",
      "duration": "5 years",
      "startDate": "2026-01-01",
      "endDate": "2031-01-01",
      "fee": 50000,
      "status": "active",
      "rights": ["film", "streaming", "broadcast"]
    }
  ]
}
```

#### GET /api/licensing/:id
Get a specific license by ID.

#### GET /api/licensing/track/:trackId
Get all licenses for a specific track.

#### POST /api/licensing
Create a new license agreement.

**Request Body:**
```json
{
  "trackId": 1,
  "trackTitle": "Track Name",
  "licenseType": "Synchronization",
  "licensee": "Company Name",
  "territory": "Worldwide",
  "duration": "2 years",
  "startDate": "2026-01-01",
  "endDate": "2028-01-01",
  "fee": 25000,
  "rights": ["film", "streaming"]
}
```

---

### 3. Placements API

#### GET /api/placements
Get all placements with optional filters.

**Query Parameters:**
- `platform` - Filter by platform (Film, TV, Advertising)
- `status` - Filter by status (confirmed, pending)

**Example:**
```
GET /api/placements?platform=Film&status=confirmed
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "trackId": 1,
      "trackTitle": "ScrollSoul Awakening",
      "platform": "Film",
      "project": "Cosmic Awakening - Feature Film",
      "productionCompany": "Universal Pictures",
      "placementType": "Main Theme",
      "airDate": "2026-06-15",
      "territory": "Worldwide",
      "status": "confirmed",
      "duration": 120,
      "notes": "Opening and closing credits"
    }
  ]
}
```

#### POST /api/placements
Create a new placement record.

---

### 4. Royalties API

#### GET /api/royalties
Get all royalty records with optional filters.

**Query Parameters:**
- `period` - Filter by period (e.g., "2026-Q1")
- `status` - Filter by status (paid, pending)
- `trackId` - Filter by track ID

#### GET /api/royalties/summary/totals
Get summary of all royalty data.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalGrossRevenue": 137000,
    "totalNetRevenue": 123300,
    "totalArtistPayments": 95310,
    "totalPublisherPayments": 27990,
    "totalRecords": 3,
    "paidRecords": 2,
    "pendingRecords": 1
  }
}
```

---

### 5. Distribution API

#### GET /api/distribution/partners
Get all distribution partners.

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "name": "Vydia",
      "type": "Digital Distribution",
      "status": "active",
      "platforms": ["Spotify", "Apple Music", "YouTube Music"],
      "lastSync": "2026-02-07T12:00:00Z"
    }
  ]
}
```

#### GET /api/distribution
Get all distribution records with optional filters.

**Query Parameters:**
- `partnerId` - Filter by partner ID
- `status` - Filter by status (live, pending)

#### POST /api/distribution/sync/:partnerId
Trigger sync with a distribution partner.

**Response:**
```json
{
  "success": true,
  "message": "Successfully synced with Vydia",
  "data": {
    "partner": "Vydia",
    "syncTime": "2026-02-07T16:50:00Z",
    "platformsUpdated": 5
  }
}
```

---

### 6. Analytics API

#### GET /api/analytics/dashboard
Get overall dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "music": {
      "totalTracks": 2,
      "activeDistributions": 2,
      "totalStreams": 432000,
      "frequencies": ["963Hz", "999Hz"]
    },
    "licensing": {
      "activeLicenses": 2,
      "totalLicenseValue": 125000
    },
    "placements": {
      "total": 3,
      "confirmed": 2,
      "pending": 1
    },
    "royalties": {
      "totalRevenue": 137000,
      "artistEarnings": 95310
    },
    "distribution": {
      "activePartners": 4,
      "platforms": 12
    },
    "sovereignty": {
      "alignment": "Perfect",
      "resonance": "Omniversal",
      "empire": "Active"
    }
  }
}
```

#### GET /api/analytics/campaigns
Get campaign analytics.

#### GET /api/analytics/placements
Get placement analytics.

#### GET /api/analytics/royalties
Get royalty analytics breakdown.

#### GET /api/analytics/streaming
Get streaming analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStreams": 432000,
    "totalRevenue": 2160,
    "byTrack": [...],
    "byPlatform": {
      "spotify": 288000,
      "appleMusic": 72000
    },
    "topTerritories": [...]
  }
}
```

---

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Not currently implemented. For production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Examples

### cURL Examples

```bash
# Get all music tracks
curl http://localhost:3000/api/music

# Get specific track
curl http://localhost:3000/api/music/1

# Create new placement
curl -X POST http://localhost:3000/api/placements \
  -H "Content-Type: application/json" \
  -d '{
    "trackId": 1,
    "platform": "Film",
    "project": "New Movie",
    "status": "pending"
  }'

# Get dashboard analytics
curl http://localhost:3000/api/analytics/dashboard
```

### JavaScript Examples

```javascript
// Get music catalog
fetch('http://localhost:3000/api/music')
  .then(res => res.json())
  .then(data => console.log(data));

// Create new license
fetch('http://localhost:3000/api/licensing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trackId: 1,
    licenseType: 'Synchronization',
    licensee: 'Company Name',
    fee: 50000
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

🌌 **ScrollSoul Music Sync API - Complete Documentation** 🌌

# API Usage Examples

This document provides examples of how to use the ScrollSoul Music Sync Platform API.

## Base URL
```
http://localhost:3000
```

---

## Health Check

### Check System Status
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ACTIVE",
  "platform": "ScrollSoul Music Sync",
  "timestamp": "2024-02-07T16:48:00.000Z",
  "services": {
    "placements": "operational",
    "licenses": "operational",
    "royalties": "operational",
    "platforms": "connected"
  }
}
```

---

## Placements

### Get All Placements
```bash
curl http://localhost:3000/api/placements
```

### Get Specific Placement
```bash
curl http://localhost:3000/api/placements/1
```

### Create New Placement
```bash
curl -X POST http://localhost:3000/api/placements \
  -H "Content-Type: application/json" \
  -d '{
    "trackName": "Cosmic Resonance",
    "artist": "ScrollSoul",
    "placementType": "TV Commercial",
    "brand": "Nike",
    "campaign": "Just Do It 2024",
    "airDate": "2024-06-15",
    "duration": 30,
    "territory": "Global"
  }'
```

### Update Placement
```bash
curl -X PUT http://localhost:3000/api/placements/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete Placement
```bash
curl -X DELETE http://localhost:3000/api/placements/1
```

---

## Licenses

### Get All Licenses
```bash
curl http://localhost:3000/api/licenses
```

### Get Specific License
```bash
curl http://localhost:3000/api/licenses/1
```

### Create New License
```bash
curl -X POST http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "trackName": "Cosmic Resonance",
    "licenseType": "Synchronization",
    "licensee": "Nike Inc.",
    "territory": "Worldwide",
    "startDate": "2024-06-01",
    "endDate": "2025-06-01",
    "fee": 75000,
    "currency": "USD"
  }'
```

### Update License
```bash
curl -X PUT http://localhost:3000/api/licenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "expired",
    "endDate": "2024-12-31"
  }'
```

---

## Royalties

### Get All Royalties
```bash
curl http://localhost:3000/api/royalties
```

### Get Royalty Summary
```bash
curl http://localhost:3000/api/royalties/summary/all
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRoyalties": 90000,
    "paidRoyalties": 75000,
    "pendingRoyalties": 15000,
    "currency": "USD",
    "recordCount": 3,
    "byPlatform": {
      "Nike": {
        "total": 50000,
        "count": 1,
        "paid": 50000,
        "pending": 0
      },
      "NCAA": {
        "total": 25000,
        "count": 1,
        "paid": 25000,
        "pending": 0
      },
      "Spotify": {
        "total": 15000,
        "count": 1,
        "paid": 0,
        "pending": 15000
      }
    }
  }
}
```

### Create New Royalty Record
```bash
curl -X POST http://localhost:3000/api/royalties \
  -H "Content-Type: application/json" \
  -d '{
    "trackName": "Cosmic Resonance",
    "placementId": "3",
    "paymentType": "Synchronization Fee",
    "amount": 75000,
    "currency": "USD",
    "paymentDate": "2024-06-15",
    "platform": "Nike",
    "status": "paid"
  }'
```

### Update Royalty Status
```bash
curl -X PUT http://localhost:3000/api/royalties/3 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid",
    "paymentDate": "2024-07-01"
  }'
```

---

## Platforms

### Get All Platform Connections
```bash
curl http://localhost:3000/api/platforms
```

### Get Platform Status Overview
```bash
curl http://localhost:3000/api/platforms/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPlatforms": 4,
    "connectedPlatforms": 4,
    "disconnectedPlatforms": 0,
    "platforms": {
      "spotify": {
        "name": "Spotify",
        "status": "connected",
        "syncEnabled": true,
        "lastSync": "2024-02-07T16:48:00.000Z"
      },
      "vydia": {
        "name": "Vydia",
        "status": "connected",
        "syncEnabled": true,
        "lastSync": "2024-02-07T16:48:00.000Z"
      },
      "ncaa": {
        "name": "NCAA",
        "status": "connected",
        "syncEnabled": true,
        "lastSync": "2024-02-07T16:48:00.000Z"
      },
      "nike": {
        "name": "Nike",
        "status": "connected",
        "syncEnabled": true,
        "lastSync": "2024-02-07T16:48:00.000Z"
      }
    }
  }
}
```

### Get Specific Platform Data
```bash
curl http://localhost:3000/api/platforms/spotify
```

### Sync with Platform
```bash
curl -X POST http://localhost:3000/api/platforms/sync/spotify
```

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": "Spotify",
    "status": "success",
    "timestamp": "2024-02-07T16:48:00.000Z",
    "message": "Successfully synced with Spotify",
    "syncedItems": {
      "placements": 25,
      "licenses": 0,
      "royalties": 0
    }
  }
}
```

---

## Platform-Specific Examples

### Spotify Sync
```bash
curl -X POST http://localhost:3000/api/platforms/sync/spotify
```

### Vydia Sync
```bash
curl -X POST http://localhost:3000/api/platforms/sync/vydia
```

### NCAA Sync
```bash
curl -X POST http://localhost:3000/api/platforms/sync/ncaa
```

### Nike Sync
```bash
curl -X POST http://localhost:3000/api/platforms/sync/nike
```

---

## Complete Workflow Example

### 1. Create a Placement
```bash
curl -X POST http://localhost:3000/api/placements \
  -H "Content-Type: application/json" \
  -d '{
    "trackName": "Galactic Journey",
    "artist": "ScrollSoul",
    "placementType": "Sports Event",
    "brand": "NCAA",
    "campaign": "Final Four 2024",
    "airDate": "2024-04-01",
    "duration": 20,
    "territory": "USA"
  }'
```

### 2. Create Associated License
```bash
curl -X POST http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "trackName": "Galactic Journey",
    "licenseType": "Master Use",
    "licensee": "NCAA",
    "territory": "USA",
    "startDate": "2024-04-01",
    "endDate": "2024-04-30",
    "fee": 30000,
    "currency": "USD"
  }'
```

### 3. Record Royalty Payment
```bash
curl -X POST http://localhost:3000/api/royalties \
  -H "Content-Type: application/json" \
  -d '{
    "trackName": "Galactic Journey",
    "placementId": "3",
    "paymentType": "Master Use Fee",
    "amount": 30000,
    "currency": "USD",
    "paymentDate": "2024-04-01",
    "platform": "NCAA",
    "status": "paid"
  }'
```

### 4. Check Royalty Summary
```bash
curl http://localhost:3000/api/royalties/summary/all
```

---

## Integration Testing

### Test All Endpoints
```bash
#!/bin/bash

echo "Testing ScrollSoul Music Sync Platform API..."

echo "\n1. Health Check:"
curl http://localhost:3000/health

echo "\n\n2. Get Placements:"
curl http://localhost:3000/api/placements

echo "\n\n3. Get Licenses:"
curl http://localhost:3000/api/licenses

echo "\n\n4. Get Royalties Summary:"
curl http://localhost:3000/api/royalties/summary/all

echo "\n\n5. Get Platform Status:"
curl http://localhost:3000/api/platforms/status

echo "\n\nAll tests completed!"
```

---

## Error Handling Examples

### 404 - Not Found
```bash
curl http://localhost:3000/api/placements/999
```

**Response:**
```json
{
  "success": false,
  "error": "Placement not found"
}
```

### 400 - Bad Request
```bash
curl -X POST http://localhost:3000/api/placements \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "success": false,
  "error": "Invalid request data"
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- Currency defaults to USD if not specified
- Platform sync operations are idempotent
- All API responses include a `success` boolean field

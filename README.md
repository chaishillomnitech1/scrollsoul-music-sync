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

/**
 * ScrollSoul Music Sync Platform
 * Main application entry point
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const placementRoutes = require('./routes/placements');
const licenseRoutes = require('./routes/licenses');
const royaltyRoutes = require('./routes/royalties');
const platformRoutes = require('./routes/platforms');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/placements', placementRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/royalties', royaltyRoutes);
app.use('/api/platforms', platformRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ACTIVE',
    platform: 'ScrollSoul Music Sync',
    timestamp: new Date().toISOString(),
    services: {
      placements: 'operational',
      licenses: 'operational',
      royalties: 'operational',
      platforms: 'connected'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ScrollSoul Music Sync Platform',
    version: '1.0.0',
    description: 'Music placement, licensing, and royalty tracking system',
    endpoints: {
      health: '/health',
      placements: '/api/placements',
      licenses: '/api/licenses',
      royalties: '/api/royalties',
      platforms: '/api/platforms'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 ScrollSoul Music Sync Platform is ACTIVE on port ${PORT}`);
  console.log(`🌌 System Status: OPERATIONAL`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}`);
  console.log(`✨ Ready to track placements, licenses, and royalties`);
});

module.exports = app;

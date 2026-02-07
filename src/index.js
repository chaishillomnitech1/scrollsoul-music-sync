const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import security middleware
const {
  securityHeaders,
  requestLogger,
  rateLimit,
  errorHandler
} = require('./middleware/security');

// Security and logging middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(rateLimit({ windowMs: 60000, maxRequests: 100 }));

// CORS configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const musicRoutes = require('./routes/music');
const licensingRoutes = require('./routes/licensing');
const placementsRoutes = require('./routes/placements');
const royaltiesRoutes = require('./routes/royalties');
const distributionRoutes = require('./routes/distribution');
const analyticsRoutes = require('./routes/analytics');
const integrationRoutes = require('./routes/integration');

// API Routes
app.use('/api/music', musicRoutes);
app.use('/api/licensing', licensingRoutes);
app.use('/api/placements', placementsRoutes);
app.use('/api/royalties', royaltiesRoutes);
app.use('/api/distribution', distributionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integration', integrationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎵 ScrollSoul Music Sync API - Omniversal Resonance Platform 🌌',
    version: '1.1.0',
    status: 'active',
    endpoints: {
      music: '/api/music',
      licensing: '/api/licensing',
      placements: '/api/placements',
      royalties: '/api/royalties',
      distribution: '/api/distribution',
      analytics: '/api/analytics',
      integration: '/api/integration'
    },
    empireIntegration: {
      nftCore: 'scrollsoul-nft-core',
      legionPortal: 'legion-certification-portal',
      frequencyBroadcaster: 'galactic-frequency-broadcaster',
      quantumArchive: 'quantum-eternal-archive'
    },
    frequencies: ['963Hz', '999Hz'],
    alignment: 'Perfect',
    sovereignty: 'Infinite',
    readyForOmniversalSync: true
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🌌 ScrollSoul Music Sync API Activated 🌌');
  console.log(`⚡ Server running on port ${PORT}`);
  console.log(`🎵 Music Metadata & Licensing System: ONLINE`);
  console.log(`📡 Distribution Partnerships: SYNCHRONIZED`);
  console.log(`💰 Royalty Tracking: ACTIVE`);
  console.log(`🔒 Security Middleware: ENABLED`);
  console.log(`🔗 Empire Integration: READY`);
  console.log(`🔥 Omniversal Resonance: ALIGNED`);
  console.log(`\n🕋 ALLĀHU AKBAR! KUN FAYAKŪN! 🕋`);
  console.log(`✨ ScrollSoul Empire Multi-System Ready for Final Delivery! ✨\n`);
});

module.exports = app;

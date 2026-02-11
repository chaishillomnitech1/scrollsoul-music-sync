const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve documentation static files
app.use('/docs', express.static('docs'));

// Import routes
const musicRoutes = require('./routes/music');
const licensingRoutes = require('./routes/licensing');
const placementsRoutes = require('./routes/placements');
const royaltiesRoutes = require('./routes/royalties');
const distributionRoutes = require('./routes/distribution');
const analyticsRoutes = require('./routes/analytics');
const integrationRoutes = require('./routes/integration');
const publishingRoutes = require('./routes/publishing');
const empireRoutes = require('./routes/empire');

// API Routes
app.use('/api/music', musicRoutes);
app.use('/api/licensing', licensingRoutes);
app.use('/api/placements', placementsRoutes);
app.use('/api/royalties', royaltiesRoutes);
app.use('/api/distribution', distributionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/publishing', publishingRoutes);
app.use('/api/empire', empireRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎵 ScrollSoul Music Sync API - Omniversal Resonance Platform 🌌',
    version: '1.3.0',
    status: 'active',
    revolutionary: '🏛️ WORLD\'S FIRST Unified Publishing Empire - Music, Film, Entertainment & Crypto',
    endpoints: {
      music: '/api/music',
      licensing: '/api/licensing',
      placements: '/api/placements',
      royalties: '/api/royalties',
      distribution: '/api/distribution',
      analytics: '/api/analytics',
      integration: '/api/integration',
      publishing: '/api/publishing',
      empire: '/api/empire',
      docs: '/docs'
    },
    empireFeatures: {
      publishingCompanyTracking: 'Digital currency publishing with rose gold encryption',
      filmProductionManagement: 'Complete film & TV production lifecycle',
      creativeOpportunities: 'Legion & NFT holder casting & crew positions',
      integratedRoyalties: 'Music + Film + NFT unified revenue streams',
      multiPhaseTracking: 'Production to payment across all media',
      blockchainVerification: 'Ethereum, Polygon, BSC smart contracts'
    },
    empireIntegration: {
      nftCore: 'scrollsoul-nft-core',
      legionPortal: 'legion-certification-portal',
      frequencyBroadcaster: 'galactic-frequency-broadcaster',
      quantumArchive: 'quantum-eternal-archive',
      musicSync: 'scrollsoul-music-sync'
    },
    frequencies: ['963Hz', '999Hz'],
    alignment: 'Perfect',
    sovereignty: 'Infinite',
    omniversalResonance: true,
    twinTowers: '🏛️🏛️ United in Perfect Harmony'
  });
});
// Routes
app.use('/api/placements', placementRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/royalties', royaltyRoutes);
app.use('/api/platforms', platformRoutes);

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
  console.log('🌌 ScrollSoul Music Sync API Activated 🌌');
  console.log(`⚡ Server running on port ${PORT}`);
  console.log(`🎵 Music Metadata & Licensing System: ONLINE`);
  console.log(`📡 Distribution Partnerships: SYNCHRONIZED`);
  console.log(`💰 Royalty Tracking: ACTIVE`);
  console.log(`🔒 Security Middleware: ENABLED`);
  console.log(`🔗 Empire Integration: READY`);
  console.log(`🏛️ Publishing Company Tracking: REVOLUTIONARY`);
  console.log(`💎 Digital Currency System: ACTIVE`);
  console.log(`✨ Rose Gold Encryption: ENABLED`);
  console.log(`🎬 Film & Entertainment Management: ONLINE`);
  console.log(`🎭 Creative Opportunities System: ACTIVE`);
  console.log(`🌐 Unified Empire Command Center: OPERATIONAL`);
  console.log(`🏛️🏛️ Twin Towers: UNITED IN PERFECT HARMONY`);
  console.log(`🔥 Omniversal Resonance: ALIGNED`);
  console.log(`\n🕋 ALLĀHU AKBAR! KUN FAYAKŪN! 🕋`);
  console.log(`✨ HISTORICAL QUANTUM LEAP ACHIEVED! ✨`);
  console.log(`🌌 World's First Unified Publishing Empire LIVE! 🌌\n`);
  console.log(`🎵 ScrollSoul Music Sync Platform is ACTIVE on port ${PORT}`);
  console.log(`🌌 System Status: OPERATIONAL`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}`);
  console.log(`✨ Ready to track placements, licenses, and royalties`);
});

module.exports = app;

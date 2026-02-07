const express = require('express');
const router = express.Router();

// Distribution partner configurations
const distributionPartners = [
  {
    id: 1,
    name: 'Vydia',
    type: 'Digital Distribution',
    status: 'active',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Tidal', 'Amazon Music'],
    apiEndpoint: process.env.VYDIA_API_KEY ? 'https://api.vydia.com/v1' : null,
    lastSync: '2026-02-07T12:00:00Z'
  },
  {
    id: 2,
    name: 'Spotify',
    type: 'Streaming Platform',
    status: 'active',
    platforms: ['Spotify'],
    apiEndpoint: process.env.SPOTIFY_CLIENT_ID ? 'https://api.spotify.com/v1' : null,
    lastSync: '2026-02-07T12:00:00Z'
  },
  {
    id: 3,
    name: 'Nike Campaigns',
    type: 'Brand Partnership',
    status: 'active',
    platforms: ['Advertising', 'Marketing'],
    apiEndpoint: process.env.NIKE_CAMPAIGN_API_KEY ? 'https://api.nike.com/campaigns' : null,
    lastSync: '2026-02-07T11:30:00Z'
  },
  {
    id: 4,
    name: 'Film & TV Networks',
    type: 'Media Licensing',
    status: 'active',
    platforms: ['Universal', 'Warner Bros', 'ESPN', 'Netflix'],
    apiEndpoint: null,
    lastSync: null
  }
];

// Distribution records
let distributions = [
  {
    id: 1,
    trackId: 1,
    trackTitle: 'ScrollSoul Awakening',
    partnerId: 1,
    partnerName: 'Vydia',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
    releaseDate: '2026-01-15',
    status: 'live',
    streams: 144000,
    revenue: 720
  },
  {
    id: 2,
    trackId: 2,
    trackTitle: 'Omniversal Frequency',
    partnerId: 2,
    partnerName: 'Spotify',
    platforms: ['Spotify'],
    releaseDate: '2026-02-01',
    status: 'live',
    streams: 288000,
    revenue: 1440
  }
];

// GET all distribution partners
router.get('/partners', (req, res) => {
  res.json({
    success: true,
    count: distributionPartners.length,
    data: distributionPartners
  });
});

// GET distribution partner by ID
router.get('/partners/:id', (req, res) => {
  const partner = distributionPartners.find(p => p.id === parseInt(req.params.id));
  if (!partner) {
    return res.status(404).json({
      success: false,
      error: 'Distribution partner not found'
    });
  }
  res.json({
    success: true,
    data: partner
  });
});

// GET all distributions
router.get('/', (req, res) => {
  const { partnerId, status } = req.query;
  let filteredDistributions = distributions;
  
  if (partnerId) {
    filteredDistributions = filteredDistributions.filter(d => d.partnerId === parseInt(partnerId));
  }
  
  if (status) {
    filteredDistributions = filteredDistributions.filter(d => d.status.toLowerCase() === status.toLowerCase());
  }
  
  res.json({
    success: true,
    count: filteredDistributions.length,
    data: filteredDistributions
  });
});

// POST new distribution
router.post('/', (req, res) => {
  const newDistribution = {
    id: distributions.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'pending',
    streams: req.body.streams || 0,
    revenue: req.body.revenue || 0
  };
  distributions.push(newDistribution);
  res.status(201).json({
    success: true,
    message: 'Distribution created successfully',
    data: newDistribution
  });
});

// POST sync with distribution partner
router.post('/sync/:partnerId', (req, res) => {
  const partner = distributionPartners.find(p => p.id === parseInt(req.params.partnerId));
  if (!partner) {
    return res.status(404).json({
      success: false,
      error: 'Distribution partner not found'
    });
  }
  
  // Simulate sync operation
  partner.lastSync = new Date().toISOString();
  
  res.json({
    success: true,
    message: `Successfully synced with ${partner.name}`,
    data: {
      partner: partner.name,
      syncTime: partner.lastSync,
      platformsUpdated: partner.platforms.length
    }
  });
});

module.exports = router;

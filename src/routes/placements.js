const express = require('express');
const router = express.Router();

// In-memory placements data
let placements = [
  {
    id: 1,
    trackId: 1,
    trackTitle: 'ScrollSoul Awakening',
    platform: 'Film',
    project: 'Cosmic Awakening - Feature Film',
    productionCompany: 'Universal Pictures',
    placementType: 'Main Theme',
    airDate: '2026-06-15',
    territory: 'Worldwide',
    status: 'confirmed',
    duration: 120,
    notes: 'Opening and closing credits'
  },
  {
    id: 2,
    trackId: 2,
    trackTitle: 'Omniversal Frequency',
    platform: 'Advertising',
    project: 'Nike Global Campaign 2026',
    productionCompany: 'Nike Inc.',
    placementType: 'Commercial',
    airDate: '2026-03-01',
    territory: 'Global',
    status: 'confirmed',
    duration: 30,
    notes: 'Prime time broadcast and digital'
  },
  {
    id: 3,
    trackId: 1,
    trackTitle: 'ScrollSoul Awakening',
    platform: 'TV',
    project: 'ESPN Sports Documentary',
    productionCompany: 'ESPN',
    placementType: 'Background Score',
    airDate: '2026-07-20',
    territory: 'USA',
    status: 'pending',
    duration: 45,
    notes: 'Series finale'
  }
];

// GET all placements
router.get('/', (req, res) => {
  const { platform, status } = req.query;
  let filteredPlacements = placements;
  
  if (platform) {
    filteredPlacements = filteredPlacements.filter(p => 
      p.platform.toLowerCase() === platform.toLowerCase()
    );
  }
  
  if (status) {
    filteredPlacements = filteredPlacements.filter(p => 
      p.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  res.json({
    success: true,
    count: filteredPlacements.length,
    data: filteredPlacements
  });
});

// GET placement by ID
router.get('/:id', (req, res) => {
  const placement = placements.find(p => p.id === parseInt(req.params.id));
  if (!placement) {
    return res.status(404).json({
      success: false,
      error: 'Placement not found'
    });
  }
  res.json({
    success: true,
    data: placement
  });
});

// GET placements by track ID
router.get('/track/:trackId', (req, res) => {
  const trackPlacements = placements.filter(p => p.trackId === parseInt(req.params.trackId));
  res.json({
    success: true,
    count: trackPlacements.length,
    data: trackPlacements
  });
});

// POST new placement
router.post('/', (req, res) => {
  const newPlacement = {
    id: placements.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'pending'
  };
  placements.push(newPlacement);
  res.status(201).json({
    success: true,
    message: 'Placement created successfully',
    data: newPlacement
  });
});

// PUT update placement
router.put('/:id', (req, res) => {
  const index = placements.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Placement not found'
    });
  }
  placements[index] = {
    ...placements[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Placement updated successfully',
    data: placements[index]
  });
});

module.exports = router;

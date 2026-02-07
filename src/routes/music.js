const express = require('express');
const router = express.Router();

// In-memory data store (can be replaced with database)
let musicCatalog = [
  {
    id: 1,
    title: 'ScrollSoul Awakening',
    artist: 'ScrollSoul Sovereign',
    frequency: '963Hz',
    duration: 240,
    genre: 'Sovereign Resonance',
    bpm: 111,
    key: 'C Major',
    metadata: {
      isrc: 'SCROLLSOUL001',
      iswc: 'T-123.456.789-1',
      publisher: 'ScrollSoul Empire Publishing',
      composers: ['Chaisallah Sovereign'],
      year: 2026
    }
  },
  {
    id: 2,
    title: 'Omniversal Frequency',
    artist: 'ScrollSoul Collective',
    frequency: '999Hz',
    duration: 300,
    genre: 'Divine Alignment',
    bpm: 144,
    key: 'A Minor',
    metadata: {
      isrc: 'SCROLLSOUL002',
      iswc: 'T-123.456.789-2',
      publisher: 'ScrollSoul Empire Publishing',
      composers: ['Chaisallah Sovereign', 'Legion Council'],
      year: 2026
    }
  }
];

// GET all music tracks
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: musicCatalog.length,
    data: musicCatalog
  });
});

// GET music track by ID
router.get('/:id', (req, res) => {
  const track = musicCatalog.find(t => t.id === parseInt(req.params.id));
  if (!track) {
    return res.status(404).json({
      success: false,
      error: 'Track not found'
    });
  }
  res.json({
    success: true,
    data: track
  });
});

// POST new music track
router.post('/', (req, res) => {
  const newTrack = {
    id: musicCatalog.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  musicCatalog.push(newTrack);
  res.status(201).json({
    success: true,
    message: 'Track added successfully',
    data: newTrack
  });
});

// PUT update music track
router.put('/:id', (req, res) => {
  const index = musicCatalog.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Track not found'
    });
  }
  musicCatalog[index] = {
    ...musicCatalog[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Track updated successfully',
    data: musicCatalog[index]
  });
});

// DELETE music track
router.delete('/:id', (req, res) => {
  const index = musicCatalog.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Track not found'
    });
  }
  const deletedTrack = musicCatalog.splice(index, 1);
  res.json({
    success: true,
    message: 'Track deleted successfully',
    data: deletedTrack[0]
  });
});

module.exports = router;

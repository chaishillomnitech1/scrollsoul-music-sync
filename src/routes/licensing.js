const express = require('express');
const router = express.Router();

// In-memory licensing data
let licenses = [
  {
    id: 1,
    trackId: 1,
    trackTitle: 'ScrollSoul Awakening',
    licenseType: 'Synchronization',
    licensee: 'Universal Pictures',
    territory: 'Worldwide',
    duration: '5 years',
    startDate: '2026-01-01',
    endDate: '2031-01-01',
    fee: 50000,
    status: 'active',
    rights: ['film', 'streaming', 'broadcast']
  },
  {
    id: 2,
    trackId: 2,
    trackTitle: 'Omniversal Frequency',
    licenseType: 'Master Use',
    licensee: 'Nike Inc.',
    territory: 'North America',
    duration: '2 years',
    startDate: '2026-02-01',
    endDate: '2028-02-01',
    fee: 75000,
    status: 'active',
    rights: ['advertising', 'social media', 'digital']
  }
];

// GET all licenses
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: licenses.length,
    data: licenses
  });
});

// GET license by ID
router.get('/:id', (req, res) => {
  const license = licenses.find(l => l.id === parseInt(req.params.id));
  if (!license) {
    return res.status(404).json({
      success: false,
      error: 'License not found'
    });
  }
  res.json({
    success: true,
    data: license
  });
});

// GET licenses by track ID
router.get('/track/:trackId', (req, res) => {
  const trackLicenses = licenses.filter(l => l.trackId === parseInt(req.params.trackId));
  res.json({
    success: true,
    count: trackLicenses.length,
    data: trackLicenses
  });
});

// POST new license
router.post('/', (req, res) => {
  const newLicense = {
    id: licenses.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'pending'
  };
  licenses.push(newLicense);
  res.status(201).json({
    success: true,
    message: 'License created successfully',
    data: newLicense
  });
});

// PUT update license
router.put('/:id', (req, res) => {
  const index = licenses.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'License not found'
    });
  }
  licenses[index] = {
    ...licenses[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'License updated successfully',
    data: licenses[index]
  });
});

module.exports = router;

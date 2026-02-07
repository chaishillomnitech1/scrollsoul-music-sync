const express = require('express');
const router = express.Router();

// In-memory royalties data
let royalties = [
  {
    id: 1,
    trackId: 1,
    trackTitle: 'ScrollSoul Awakening',
    period: '2026-Q1',
    source: 'Film Synchronization',
    licensee: 'Universal Pictures',
    grossRevenue: 50000,
    expenses: 5000,
    netRevenue: 45000,
    artistShare: 0.75,
    artistPayment: 33750,
    publisherPayment: 11250,
    status: 'paid',
    paymentDate: '2026-04-15'
  },
  {
    id: 2,
    trackId: 2,
    trackTitle: 'Omniversal Frequency',
    period: '2026-Q1',
    source: 'Advertising Campaign',
    licensee: 'Nike Inc.',
    grossRevenue: 75000,
    expenses: 7500,
    netRevenue: 67500,
    artistShare: 0.80,
    artistPayment: 54000,
    publisherPayment: 13500,
    status: 'paid',
    paymentDate: '2026-04-15'
  },
  {
    id: 3,
    trackId: 1,
    trackTitle: 'ScrollSoul Awakening',
    period: '2026-Q2',
    source: 'Streaming Platforms',
    licensee: 'Spotify',
    grossRevenue: 12000,
    expenses: 1200,
    netRevenue: 10800,
    artistShare: 0.70,
    artistPayment: 7560,
    publisherPayment: 3240,
    status: 'pending',
    paymentDate: null
  }
];

// GET all royalties
router.get('/', (req, res) => {
  const { period, status, trackId } = req.query;
  let filteredRoyalties = royalties;
  
  if (period) {
    filteredRoyalties = filteredRoyalties.filter(r => r.period === period);
  }
  
  if (status) {
    filteredRoyalties = filteredRoyalties.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  
  if (trackId) {
    filteredRoyalties = filteredRoyalties.filter(r => r.trackId === parseInt(trackId));
  }
  
  res.json({
    success: true,
    count: filteredRoyalties.length,
    data: filteredRoyalties
  });
});

// GET royalty by ID
router.get('/:id', (req, res) => {
  const royalty = royalties.find(r => r.id === parseInt(req.params.id));
  if (!royalty) {
    return res.status(404).json({
      success: false,
      error: 'Royalty record not found'
    });
  }
  res.json({
    success: true,
    data: royalty
  });
});

// GET royalty summary
router.get('/summary/totals', (req, res) => {
  const totalGross = royalties.reduce((sum, r) => sum + r.grossRevenue, 0);
  const totalNet = royalties.reduce((sum, r) => sum + r.netRevenue, 0);
  const totalArtistPayments = royalties.reduce((sum, r) => sum + r.artistPayment, 0);
  const totalPublisherPayments = royalties.reduce((sum, r) => sum + r.publisherPayment, 0);
  
  res.json({
    success: true,
    data: {
      totalGrossRevenue: totalGross,
      totalNetRevenue: totalNet,
      totalArtistPayments: totalArtistPayments,
      totalPublisherPayments: totalPublisherPayments,
      totalRecords: royalties.length,
      paidRecords: royalties.filter(r => r.status === 'paid').length,
      pendingRecords: royalties.filter(r => r.status === 'pending').length
    }
  });
});

// POST new royalty record
router.post('/', (req, res) => {
  const newRoyalty = {
    id: royalties.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  royalties.push(newRoyalty);
  res.status(201).json({
    success: true,
    message: 'Royalty record created successfully',
    data: newRoyalty
  });
});

// PUT update royalty record
router.put('/:id', (req, res) => {
  const index = royalties.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Royalty record not found'
    });
  }
  royalties[index] = {
    ...royalties[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    message: 'Royalty record updated successfully',
    data: royalties[index]
  });
});

module.exports = router;

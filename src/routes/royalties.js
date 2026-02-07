/**
 * Royalty Routes
 * Handles royalty tracking and payment information
 */

const express = require('express');
const router = express.Router();
const royaltyService = require('../services/royaltyService');

// Get all royalty records
router.get('/', (req, res) => {
  try {
    const royalties = royaltyService.getAllRoyalties();
    res.json({
      success: true,
      count: royalties.length,
      data: royalties,
      totalAmount: royaltyService.getTotalRoyalties()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get royalty by ID
router.get('/:id', (req, res) => {
  try {
    const royalty = royaltyService.getRoyaltyById(req.params.id);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get royalty summary
router.get('/summary/all', (req, res) => {
  try {
    const summary = royaltyService.getRoyaltySummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new royalty record
router.post('/', (req, res) => {
  try {
    const royalty = royaltyService.createRoyalty(req.body);
    res.status(201).json({
      success: true,
      data: royalty
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update royalty record
router.put('/:id', (req, res) => {
  try {
    const royalty = royaltyService.updateRoyalty(req.params.id, req.body);
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

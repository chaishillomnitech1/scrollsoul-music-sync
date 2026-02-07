/**
 * Music Placement Routes
 * Handles tracking of music placements in various media
 */

const express = require('express');
const router = express.Router();
const placementService = require('../services/placementService');

// Get all placements
router.get('/', (req, res) => {
  try {
    const placements = placementService.getAllPlacements();
    res.json({
      success: true,
      count: placements.length,
      data: placements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get placement by ID
router.get('/:id', (req, res) => {
  try {
    const placement = placementService.getPlacementById(req.params.id);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new placement
router.post('/', (req, res) => {
  try {
    const placement = placementService.createPlacement(req.body);
    res.status(201).json({
      success: true,
      data: placement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update placement
router.put('/:id', (req, res) => {
  try {
    const placement = placementService.updatePlacement(req.params.id, req.body);
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete placement
router.delete('/:id', (req, res) => {
  try {
    const success = placementService.deletePlacement(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Placement not found'
      });
    }
    res.json({
      success: true,
      message: 'Placement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

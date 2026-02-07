/**
 * Platform Routes
 * Handles integration with music platforms (Spotify, Vydia, NCAA, Nike, etc.)
 */

const express = require('express');
const router = express.Router();
const platformService = require('../services/platformService');

// Get all platform connections
router.get('/', (req, res) => {
  try {
    const platforms = platformService.getAllPlatforms();
    res.json({
      success: true,
      count: platforms.length,
      data: platforms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get platform status
router.get('/status', (req, res) => {
  try {
    const status = platformService.getPlatformStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sync with specific platform
router.post('/sync/:platform', (req, res) => {
  try {
    const result = platformService.syncWithPlatform(req.params.platform);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get platform-specific data
router.get('/:platform', (req, res) => {
  try {
    const data = platformService.getPlatformData(req.params.platform);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found or not connected'
      });
    }
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

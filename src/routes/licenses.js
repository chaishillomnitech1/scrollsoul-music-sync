/**
 * License Routes
 * Handles music licensing tracking and management
 */

const express = require('express');
const router = express.Router();
const licenseService = require('../services/licenseService');

// Get all licenses
router.get('/', (req, res) => {
  try {
    const licenses = licenseService.getAllLicenses();
    res.json({
      success: true,
      count: licenses.length,
      data: licenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get license by ID
router.get('/:id', (req, res) => {
  try {
    const license = licenseService.getLicenseById(req.params.id);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new license
router.post('/', (req, res) => {
  try {
    const license = licenseService.createLicense(req.body);
    res.status(201).json({
      success: true,
      data: license
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update license
router.put('/:id', (req, res) => {
  try {
    const license = licenseService.updateLicense(req.params.id, req.body);
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete license
router.delete('/:id', (req, res) => {
  try {
    const success = licenseService.deleteLicense(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'License not found'
      });
    }
    res.json({
      success: true,
      message: 'License deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

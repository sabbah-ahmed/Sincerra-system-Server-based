const express = require('express');
const router = express.Router();

// Import route modules
const clientRoutes = require('./clients');

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Real Estate CRM API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/clients', clientRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

module.exports = router;

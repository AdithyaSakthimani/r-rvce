/**
 * API Routes Index for ProctorX
 * 
 * Aggregates all route modules and exports the main router
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const testRoutes = require('./tests');
const submissionRoutes = require('./submissions');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ProctorX API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/tests', testRoutes);
router.use('/submissions', submissionRoutes);

// 404 handler for undefined API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

module.exports = router;

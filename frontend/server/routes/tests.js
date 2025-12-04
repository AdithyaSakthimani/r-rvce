/**
 * Test Routes for ProctorX
 */

const express = require('express');
const router = express.Router();
const {
  getTests,
  getTest,
  getTestByCode,
  createTest,
  updateTest,
  deleteTest,
  publishTest,
  getTestAnalytics
} = require('../controllers/testController');
const { getTestSubmissions } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

// Public route for access code lookup
router.get('/code/:code', getTestByCode);

// Protected routes
router.use(protect);

// Recruiter-only routes
router.get('/', authorize('recruiter', 'admin'), getTests);
router.post('/', authorize('recruiter', 'admin'), createTest);

// Test-specific routes
router.get('/:id', getTest);
router.put('/:id', authorize('recruiter', 'admin'), updateTest);
router.delete('/:id', authorize('recruiter', 'admin'), deleteTest);
router.put('/:id/publish', authorize('recruiter', 'admin'), publishTest);
router.get('/:id/analytics', authorize('recruiter', 'admin'), getTestAnalytics);
router.get('/:testId/submissions', authorize('recruiter', 'admin'), getTestSubmissions);

module.exports = router;

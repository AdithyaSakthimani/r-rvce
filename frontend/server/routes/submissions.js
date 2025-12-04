/**
 * Submission Routes for ProctorX
 */

const express = require('express');
const router = express.Router();
const {
  startTest,
  saveAnswer,
  reportViolation,
  submitTest,
  getSubmission,
  reviewSubmission
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Student routes
router.post('/start', authorize('student'), startTest);
router.put('/:id/answer', authorize('student'), saveAnswer);
router.post('/:id/violation', authorize('student'), reportViolation);
router.post('/:id/submit', authorize('student'), submitTest);

// Both student and recruiter can view
router.get('/:id', getSubmission);

// Recruiter-only routes
router.put('/:id/review', authorize('recruiter', 'admin'), reviewSubmission);

module.exports = router;

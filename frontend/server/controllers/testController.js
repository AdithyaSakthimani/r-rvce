/**
 * Test Controller for ProctorX
 * 
 * Handles CRUD operations for tests and test management
 */

const Test = require('../models/Test');
const Submission = require('../models/Submission');

/**
 * @desc    Get all tests (for recruiter)
 * @route   GET /api/tests
 * @access  Private (Recruiter)
 */
exports.getTests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    // Build query
    const query = { createdBy: req.user.id };
    if (status) query.status = status;
    
    // Execute query with pagination
    const tests = await Test.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('submissions', 'status totalScore');
    
    // Get total count
    const total = await Test.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      pages: Math.ceil(total / limit),
      data: { tests }
    });
    
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching tests'
    });
  }
};

/**
 * @desc    Get single test
 * @route   GET /api/tests/:id
 * @access  Private
 */
exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('createdBy', 'name email company');
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Check authorization (recruiter who created or taking student)
    // Students should only see limited info
    const isOwner = test.createdBy._id.toString() === req.user.id;
    
    res.status(200).json({
      success: true,
      data: { test, isOwner }
    });
    
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching test'
    });
  }
};

/**
 * @desc    Get test by access code (for students)
 * @route   GET /api/tests/code/:code
 * @access  Public
 */
exports.getTestByCode = async (req, res) => {
  try {
    const test = await Test.findOne({ accessCode: req.params.code })
      .select('title description duration questionCount proctoring instructions company');
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Invalid access code'
      });
    }
    
    if (!test.isAccessible()) {
      return res.status(403).json({
        success: false,
        error: 'Test is not currently available'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { test }
    });
    
  } catch (error) {
    console.error('Get test by code error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching test'
    });
  }
};

/**
 * @desc    Create new test
 * @route   POST /api/tests
 * @access  Private (Recruiter)
 */
exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      duration,
      proctoring,
      instructions,
      passingScore,
      maxAttempts,
      scheduledStart,
      scheduledEnd
    } = req.body;
    
    // Create test
    const test = await Test.create({
      title,
      description,
      questions: questions || [],
      duration,
      proctoring: proctoring || {},
      instructions,
      passingScore,
      maxAttempts,
      scheduledStart,
      scheduledEnd,
      createdBy: req.user.id,
      company: req.user.company
    });
    
    // Generate access code
    test.generateAccessCode();
    await test.save();
    
    res.status(201).json({
      success: true,
      data: { test }
    });
    
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating test'
    });
  }
};

/**
 * @desc    Update test
 * @route   PUT /api/tests/:id
 * @access  Private (Recruiter - owner only)
 */
exports.updateTest = async (req, res) => {
  try {
    let test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Check ownership
    if (test.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this test'
      });
    }
    
    // Don't allow updates if test has submissions
    if (test.totalSubmissions > 0 && req.body.questions) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify questions after test has submissions'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'title', 'description', 'questions', 'duration',
      'proctoring', 'instructions', 'passingScore',
      'scheduledStart', 'scheduledEnd', 'status'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        test[field] = req.body[field];
      }
    });
    
    await test.save();
    
    res.status(200).json({
      success: true,
      data: { test }
    });
    
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating test'
    });
  }
};

/**
 * @desc    Delete test
 * @route   DELETE /api/tests/:id
 * @access  Private (Recruiter - owner only)
 */
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Check ownership
    if (test.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this test'
      });
    }
    
    // Soft delete - archive instead of remove
    test.status = 'archived';
    await test.save();
    
    res.status(200).json({
      success: true,
      message: 'Test archived successfully'
    });
    
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting test'
    });
  }
};

/**
 * @desc    Publish/activate test
 * @route   PUT /api/tests/:id/publish
 * @access  Private (Recruiter)
 */
exports.publishTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Validate test has questions
    if (!test.questions || test.questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Test must have at least one question'
      });
    }
    
    test.status = 'active';
    if (!test.accessCode) {
      test.generateAccessCode();
    }
    await test.save();
    
    res.status(200).json({
      success: true,
      data: { test }
    });
    
  } catch (error) {
    console.error('Publish test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error publishing test'
    });
  }
};

/**
 * @desc    Get test analytics
 * @route   GET /api/tests/:id/analytics
 * @access  Private (Recruiter)
 */
exports.getTestAnalytics = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Get submissions for analytics
    const submissions = await Submission.find({ 
      test: req.params.id,
      status: { $in: ['completed', 'flagged'] }
    });
    
    // Calculate analytics
    const analytics = {
      totalSubmissions: submissions.length,
      averageScore: test.averageScore,
      scoreDistribution: {
        '0-20': submissions.filter(s => s.percentage <= 20).length,
        '21-40': submissions.filter(s => s.percentage > 20 && s.percentage <= 40).length,
        '41-60': submissions.filter(s => s.percentage > 40 && s.percentage <= 60).length,
        '61-80': submissions.filter(s => s.percentage > 60 && s.percentage <= 80).length,
        '81-100': submissions.filter(s => s.percentage > 80).length,
      },
      averageDuration: submissions.length > 0 
        ? Math.round(submissions.reduce((sum, s) => sum + s.duration, 0) / submissions.length)
        : 0,
      flaggedCount: submissions.filter(s => s.status === 'flagged').length,
      passRate: submissions.length > 0
        ? Math.round((submissions.filter(s => s.percentage >= test.passingScore).length / submissions.length) * 100)
        : 0,
      completionRate: test.totalSubmissions > 0
        ? Math.round((submissions.filter(s => s.status === 'completed').length / test.totalSubmissions) * 100)
        : 0
    };
    
    res.status(200).json({
      success: true,
      data: { analytics }
    });
    
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching analytics'
    });
  }
};

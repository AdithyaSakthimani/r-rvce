/**
 * Submission Controller for ProctorX
 * 
 * Handles test submissions, proctoring events, and evaluation
 */

const Submission = require('../models/Submission');
const Test = require('../models/Test');

/**
 * @desc    Start a test (create submission)
 * @route   POST /api/submissions/start
 * @access  Private (Student)
 */
exports.startTest = async (req, res) => {
  try {
    const { testId, accessCode, environment } = req.body;
    
    // Find test by ID or access code
    let test;
    if (testId) {
      test = await Test.findById(testId);
    } else if (accessCode) {
      test = await Test.findOne({ accessCode });
    }
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }
    
    // Check if test is accessible
    if (!test.isAccessible()) {
      return res.status(403).json({
        success: false,
        error: 'Test is not currently available'
      });
    }
    
    // Check for existing submission
    const existingSubmission = await Submission.findOne({
      test: test._id,
      student: req.user.id,
      status: { $in: ['in_progress', 'completed'] }
    });
    
    if (existingSubmission) {
      // Return existing in-progress submission
      if (existingSubmission.status === 'in_progress') {
        return res.status(200).json({
          success: true,
          data: { 
            submission: existingSubmission,
            test: {
              title: test.title,
              duration: test.duration,
              questions: test.questions,
              proctoring: test.proctoring
            }
          }
        });
      }
      
      // Check if retake allowed
      if (existingSubmission.attemptNumber >= test.maxAttempts) {
        return res.status(403).json({
          success: false,
          error: 'Maximum attempts reached for this test'
        });
      }
    }
    
    // Create new submission
    const submission = await Submission.create({
      test: test._id,
      student: req.user.id,
      maxTotalScore: test.totalMaxScore,
      answers: test.questions.map(q => ({
        question: q._id,
        maxScore: q.maxScore,
        code: q.template || ''
      })),
      environment,
      attemptNumber: existingSubmission ? existingSubmission.attemptNumber + 1 : 1,
      startedAt: new Date()
    });
    
    // Log start activity
    submission.logActivity('start');
    await submission.save();
    
    res.status(201).json({
      success: true,
      data: {
        submission,
        test: {
          title: test.title,
          duration: test.duration,
          questions: test.questions,
          proctoring: test.proctoring,
          instructions: test.instructions
        }
      }
    });
    
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error starting test'
    });
  }
};

/**
 * @desc    Save answer (auto-save)
 * @route   PUT /api/submissions/:id/answer
 * @access  Private (Student)
 */
exports.saveAnswer = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;
    
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Verify student owns this submission
    if (submission.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    // Check if submission is still in progress
    if (submission.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        error: 'Submission already completed'
      });
    }
    
    // Find and update the answer
    const answerIndex = submission.answers.findIndex(
      a => a.question.toString() === questionId
    );
    
    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Question not found in submission'
      });
    }
    
    // Update answer
    submission.answers[answerIndex].code = code;
    submission.answers[answerIndex].language = language || 'typescript';
    submission.answers[answerIndex].lastAttempt = new Date();
    
    if (!submission.answers[answerIndex].firstAttempt) {
      submission.answers[answerIndex].firstAttempt = new Date();
    }
    
    await submission.save();
    
    res.status(200).json({
      success: true,
      message: 'Answer saved'
    });
    
  } catch (error) {
    console.error('Save answer error:', error);
    res.status(500).json({
      success: false,
      error: 'Error saving answer'
    });
  }
};

/**
 * @desc    Report violation
 * @route   POST /api/submissions/:id/violation
 * @access  Private (Student)
 */
exports.reportViolation = async (req, res) => {
  try {
    const { type, description, severity, screenshot, metadata } = req.body;
    
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Add violation
    submission.addViolation({
      type,
      description,
      severity: severity || 'medium',
      screenshot,
      metadata
    });
    
    await submission.save();
    
    res.status(200).json({
      success: true,
      violationCount: submission.violationCount
    });
    
  } catch (error) {
    console.error('Report violation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error reporting violation'
    });
  }
};

/**
 * @desc    Submit test
 * @route   POST /api/submissions/:id/submit
 * @access  Private (Student)
 */
exports.submitTest = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    if (submission.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    if (submission.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        error: 'Submission already completed'
      });
    }
    
    // Get test for evaluation
    const test = await Test.findById(submission.test);
    
    // Evaluate answers (simplified - would call code execution service)
    for (let i = 0; i < submission.answers.length; i++) {
      const answer = submission.answers[i];
      const question = test.questions.id(answer.question);
      
      if (question && answer.code) {
        // Simulate test evaluation
        // In production, this would call a code execution service
        const passedTests = Math.floor(Math.random() * (question.testCases.length + 1));
        const scorePercent = passedTests / question.testCases.length;
        
        answer.score = Math.round(answer.maxScore * scorePercent);
        answer.testResults = question.testCases.map((tc, idx) => ({
          testCaseId: tc._id,
          passed: idx < passedTests,
          actualOutput: idx < passedTests ? tc.expectedOutput : 'undefined',
          executionTime: Math.floor(Math.random() * 100),
          memoryUsed: Math.floor(Math.random() * 1000000)
        }));
        
        // Simulate AI similarity check
        answer.aiSimilarity = Math.floor(Math.random() * 60);
      }
    }
    
    // Calculate time spent per question
    // In production, this would be calculated from activity logs
    
    // Submit the test
    await submission.submit();
    
    res.status(200).json({
      success: true,
      data: {
        submission: {
          totalScore: submission.totalScore,
          percentage: submission.percentage,
          status: submission.status,
          duration: submission.duration,
          violationCount: submission.violationCount
        }
      }
    });
    
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({
      success: false,
      error: 'Error submitting test'
    });
  }
};

/**
 * @desc    Get submission details
 * @route   GET /api/submissions/:id
 * @access  Private
 */
exports.getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name email')
      .populate('test', 'title duration questions');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Check authorization (student owner or recruiter who created test)
    const test = await Test.findById(submission.test);
    const isStudent = submission.student._id.toString() === req.user.id;
    const isRecruiter = test.createdBy.toString() === req.user.id;
    
    if (!isStudent && !isRecruiter) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this submission'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { submission }
    });
    
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching submission'
    });
  }
};

/**
 * @desc    Get submissions for a test (recruiter)
 * @route   GET /api/tests/:testId/submissions
 * @access  Private (Recruiter)
 */
exports.getTestSubmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, sort = '-submittedAt' } = req.query;
    
    // Build query
    const query = { test: req.params.testId };
    if (status) query.status = status;
    
    const submissions = await Submission.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('student', 'name email');
    
    const total = await Submission.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      pages: Math.ceil(total / limit),
      data: { submissions }
    });
    
  } catch (error) {
    console.error('Get test submissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching submissions'
    });
  }
};

/**
 * @desc    Review submission (recruiter)
 * @route   PUT /api/submissions/:id/review
 * @access  Private (Recruiter)
 */
exports.reviewSubmission = async (req, res) => {
  try {
    const { decision, notes, rating } = req.body;
    
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Update review
    submission.review = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      decision,
      notes,
      rating
    };
    
    if (decision === 'approved' || decision === 'rejected') {
      submission.status = 'reviewed';
    }
    
    await submission.save();
    
    res.status(200).json({
      success: true,
      data: { submission }
    });
    
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Error reviewing submission'
    });
  }
};

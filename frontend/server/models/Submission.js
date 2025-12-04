/**
 * Submission Model for ProctorX
 * 
 * Represents a candidate's test submission with all answers,
 * proctoring events, and evaluation results
 */

const mongoose = require('mongoose');

// Schema for individual question answer
const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // The code submitted for this question
  code: {
    type: String,
    default: ''
  },
  
  // Programming language used
  language: {
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go'],
    default: 'typescript'
  },
  
  // Test case results
  testResults: [{
    testCaseId: mongoose.Schema.Types.ObjectId,
    passed: Boolean,
    actualOutput: String,
    executionTime: Number, // ms
    memoryUsed: Number // bytes
  }],
  
  // Score awarded for this question
  score: {
    type: Number,
    default: 0
  },
  
  maxScore: {
    type: Number,
    required: true
  },
  
  // Time spent on this question (seconds)
  timeSpent: {
    type: Number,
    default: 0
  },
  
  // AI similarity score (0-100)
  aiSimilarity: {
    type: Number,
    default: 0
  },
  
  // Hints used (reduces score)
  hintsUsed: [{
    hintIndex: Number,
    timestamp: Date
  }],
  
  // Timestamps for this answer
  firstAttempt: Date,
  lastAttempt: Date
});

// Schema for proctoring violations
const violationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'tab_switch',
      'fullscreen_exit',
      'copy',
      'paste',
      'screenshot',
      'multiple_faces',
      'no_face',
      'phone_detected',
      'voice_detected',
      'browser_resize'
    ],
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  timestamp: {
    type: Date,
    required: true
  },
  
  // Severity level for flagging
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Screenshot at time of violation (optional)
  screenshot: {
    type: String, // S3 URL
    default: null
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Schema for activity log
const activityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['start', 'submit', 'focus', 'blur', 'keystroke', 'run_code', 'navigate'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  data: mongoose.Schema.Types.Mixed
});

// Main Submission schema
const submissionSchema = new mongoose.Schema({
  // References
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Answers for each question
  answers: [answerSchema],
  
  // Overall scores
  totalScore: {
    type: Number,
    default: 0
  },
  
  maxTotalScore: {
    type: Number,
    required: true
  },
  
  percentage: {
    type: Number,
    default: 0
  },
  
  // Submission status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'flagged', 'disqualified', 'reviewed'],
    default: 'in_progress'
  },
  
  // Timing information
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  submittedAt: {
    type: Date,
    default: null
  },
  
  duration: {
    type: Number, // Actual time taken in minutes
    default: 0
  },
  
  // Proctoring data
  violations: [violationSchema],
  
  violationCount: {
    type: Number,
    default: 0
  },
  
  // Activity log for analysis
  activityLog: [activityLogSchema],
  
  // Recording URLs
  recordings: {
    webcam: {
      type: String, // S3 URL
      default: null
    },
    screen: {
      type: String, // S3 URL
      default: null
    }
  },
  
  // AI/LLM similarity analysis
  aiAnalysis: {
    overallSimilarity: {
      type: Number,
      default: 0
    },
    
    sources: [{
      type: {
        type: String,
        enum: ['gpt', 'copilot', 'leetcode', 'stackoverflow', 'other']
      },
      similarity: Number,
      snippet: String
    }],
    
    analyzedAt: Date
  },
  
  // Browser/device information
  environment: {
    browser: String,
    browserVersion: String,
    os: String,
    screenResolution: String,
    ipAddress: String,
    userAgent: String
  },
  
  // Recruiter review
  review: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: Date,
    decision: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_review'],
      default: 'pending'
    },
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Attempt number (if multiple attempts allowed)
  attemptNumber: {
    type: Number,
    default: 1
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
submissionSchema.index({ test: 1, student: 1 });
submissionSchema.index({ test: 1, status: 1 });
submissionSchema.index({ student: 1, status: 1 });
submissionSchema.index({ status: 1, 'review.decision': 1 });
submissionSchema.index({ submittedAt: -1 });

// Virtual for high severity violations
submissionSchema.virtual('highSeverityViolations').get(function() {
  return this.violations.filter(v => v.severity === 'high');
});

// Virtual for pass/fail status
submissionSchema.virtual('passed').get(function() {
  // This would reference the test's passing score
  return this.percentage >= 60; // Default 60%
});

// Calculate scores before saving
submissionSchema.pre('save', function(next) {
  if (this.answers && this.answers.length > 0) {
    // Calculate total score
    this.totalScore = this.answers.reduce((sum, a) => sum + (a.score || 0), 0);
    
    // Calculate percentage
    if (this.maxTotalScore > 0) {
      this.percentage = Math.round((this.totalScore / this.maxTotalScore) * 100);
    }
    
    // Update violation count
    this.violationCount = this.violations.length;
    
    // Calculate duration if submitted
    if (this.submittedAt && this.startedAt) {
      this.duration = Math.round((this.submittedAt - this.startedAt) / 60000);
    }
    
    // Calculate overall AI similarity
    if (this.answers.some(a => a.aiSimilarity > 0)) {
      const avgSimilarity = this.answers
        .filter(a => a.aiSimilarity > 0)
        .reduce((sum, a) => sum + a.aiSimilarity, 0) / 
        this.answers.filter(a => a.aiSimilarity > 0).length;
      this.aiAnalysis.overallSimilarity = Math.round(avgSimilarity);
    }
  }
  next();
});

// Add violation method
submissionSchema.methods.addViolation = function(violation) {
  this.violations.push({
    ...violation,
    timestamp: new Date()
  });
  this.violationCount = this.violations.length;
  
  // Auto-flag if too many high severity violations
  const highSeverity = this.violations.filter(v => v.severity === 'high').length;
  if (highSeverity >= 3 && this.status !== 'disqualified') {
    this.status = 'flagged';
  }
};

// Submit test method
submissionSchema.methods.submit = async function() {
  this.status = this.violationCount >= 5 ? 'flagged' : 'completed';
  this.submittedAt = new Date();
  
  // Calculate final duration
  this.duration = Math.round((this.submittedAt - this.startedAt) / 60000);
  
  await this.save();
  
  // Update test analytics
  const Test = mongoose.model('Test');
  const test = await Test.findById(this.test);
  if (test) {
    await test.updateAnalytics(this.percentage);
  }
};

// Log activity method
submissionSchema.methods.logActivity = function(type, data = {}) {
  this.activityLog.push({
    type,
    timestamp: new Date(),
    data
  });
};

module.exports = mongoose.model('Submission', submissionSchema);

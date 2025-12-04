/**
 * Test Model for ProctorX
 * 
 * Represents a coding assessment/exam created by recruiters
 * Contains multiple questions and configuration settings
 */

const mongoose = require('mongoose');

// Schema for individual test case
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false // Hidden test cases not shown to candidates
  },
  weight: {
    type: Number,
    default: 1 // Weight for scoring
  }
}, { _id: false });

// Schema for individual question
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true
  },
  
  description: {
    type: String,
    required: [true, 'Question description is required']
  },
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Code template provided to candidates
  template: {
    type: String,
    default: ''
  },
  
  // Supported programming languages
  languages: [{
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go'],
    default: ['javascript', 'typescript']
  }],
  
  // Test cases for automated evaluation
  testCases: [testCaseSchema],
  
  // Maximum points for this question
  maxScore: {
    type: Number,
    required: true,
    default: 100
  },
  
  // Time limit for this specific question (optional)
  timeLimit: {
    type: Number, // in minutes
    default: null
  },
  
  // Hints that can be unlocked (reduces score)
  hints: [{
    text: String,
    penaltyPercent: { type: Number, default: 10 }
  }],
  
  // Tags for categorization
  tags: [String],
  
  order: {
    type: Number,
    default: 0
  }
});

// Main Test schema
const testSchema = new mongoose.Schema({
  // Basic test information
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Test description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Questions in this test
  questions: [questionSchema],
  
  // Test configuration
  duration: {
    type: Number, // Total duration in minutes
    required: [true, 'Test duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  
  // Access settings
  accessCode: {
    type: String,
    unique: true,
    sparse: true // Allows null values
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Scheduling
  scheduledStart: {
    type: Date,
    default: null
  },
  
  scheduledEnd: {
    type: Date,
    default: null
  },
  
  // Test status
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  
  // Proctoring settings
  proctoring: {
    cameraRequired: { type: Boolean, default: true },
    screenRecording: { type: Boolean, default: true },
    fullscreenEnforced: { type: Boolean, default: true },
    tabSwitchDetection: { type: Boolean, default: true },
    copyPasteDetection: { type: Boolean, default: true },
    aiSimilarityCheck: { type: Boolean, default: true }
  },
  
  // Passing criteria
  passingScore: {
    type: Number,
    default: 60 // Percentage
  },
  
  // Maximum attempts allowed per candidate
  maxAttempts: {
    type: Number,
    default: 1
  },
  
  // Creator reference
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Company/organization
  company: {
    type: String,
    required: true
  },
  
  // Instructions shown before test starts
  instructions: {
    type: String,
    default: ''
  },
  
  // Allowed candidates (empty = anyone with link/code)
  allowedCandidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Analytics
  totalSubmissions: {
    type: Number,
    default: 0
  },
  
  averageScore: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testSchema.index({ createdBy: 1, status: 1 });
testSchema.index({ accessCode: 1 });
testSchema.index({ company: 1 });
testSchema.index({ status: 1, scheduledStart: 1 });

// Virtual for total max score
testSchema.virtual('totalMaxScore').get(function() {
  return this.questions.reduce((sum, q) => sum + q.maxScore, 0);
});

// Virtual for question count
testSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Virtual for submissions
testSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'test'
});

// Generate unique access code
testSchema.methods.generateAccessCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  this.accessCode = code;
  return code;
};

// Check if test is currently accessible
testSchema.methods.isAccessible = function() {
  const now = new Date();
  
  if (this.status !== 'active') return false;
  if (this.scheduledStart && now < this.scheduledStart) return false;
  if (this.scheduledEnd && now > this.scheduledEnd) return false;
  
  return true;
};

// Update analytics after submission
testSchema.methods.updateAnalytics = async function(score) {
  const totalScore = this.averageScore * this.totalSubmissions + score;
  this.totalSubmissions += 1;
  this.averageScore = totalScore / this.totalSubmissions;
  await this.save();
};

module.exports = mongoose.model('Test', testSchema);

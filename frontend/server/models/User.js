/**
 * User Model for ProctorX
 * 
 * Handles both Students and Recruiters with role-based access
 * Uses bcrypt for password hashing and mongoose for MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Role determines access level
  role: {
    type: String,
    enum: ['student', 'recruiter', 'admin'],
    default: 'student'
  },
  
  // Recruiter-specific fields
  company: {
    type: String,
    required: function() { return this.role === 'recruiter'; }
  },
  
  jobTitle: {
    type: String,
    required: function() { return this.role === 'recruiter'; }
  },
  
  // Profile information
  avatar: {
    type: String,
    default: null
  },
  
  phone: {
    type: String,
    default: null
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: null
  },
  
  // OAuth providers (future support)
  googleId: String,
  githubId: String

}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ company: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  // Hash with cost factor of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for user's tests (for recruiters)
userSchema.virtual('tests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'createdBy'
});

// Virtual for user's submissions (for students)
userSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'student'
});

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

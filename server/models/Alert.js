import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  // LED alert timestamp
  ledAlert: {
    type: Date,
    default: Date.now
  },
  
  // Device information
  device: {
    type: String,
    required: true,
    default: 'laptop'
  },
  
  // Gas detection timestamp
  gasDetected: {
    type: Date,
    default: Date.now
  },
  
  // Motion detection timestamp
  motionDetected: {
    type: Date,
    default: Date.now
  },
  
  // User credentials
  username: {
    type: String,
    required: true,
    default: 'Group5KP'
  },
  
  password: {
    type: String,
    required: true,
    default: 'Te@m12Add'
  },
  
  // Vibration alert timestamp
  vibrationAlert: {
     type: Date,
     default: Date.now
  },
  
  // Additional metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
alertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
alertSchema.index({ createdAt: -1 });
alertSchema.index({ device: 1 });
alertSchema.index({ username: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
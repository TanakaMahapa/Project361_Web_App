import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,   
    trim: true
  },
  
  password: {
    type: String,
    required: true
  },
  
  device: {
    type: String,
    required: true,
    default: 'laptop'
  },
  
  // User preferences and settings
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    alertThresholds: {
      motion: { type: Number, default: 1 },
      gas: { type: Number, default: 100 },
      vibration: { type: Number, default: 5 }
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
});


userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});


userSchema.index({ device: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;

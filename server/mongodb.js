import mongoose from 'mongoose';

// Add fallback connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://IOT_Admin:IOTPRJ_Admin2025@cluster0.bljmeys.mongodb.net/IOT_db';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
  }
};

export default mongoose;
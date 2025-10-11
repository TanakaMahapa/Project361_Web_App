import Alert from './models/Alert.js';
import User from './models/User.js';
import { connectDB } from './mongodb.js';

// Sample data based on your specifications
const sampleAlertData = {
  ledAlert: new Date('2025-10-16T20:12:48.000Z'), // 16 October 2025 at 22:12:48 UTC+2
  device: 'laptop',
  gasDetected: new Date('2025-10-10T02:09:07.000Z'), // 10 October 2025 at 04:09:07 UTC+2
  motionDetected: new Date('2025-10-02T16:04:32.000Z'), // 2 October 2025 at 18:04:32 UTC+2
  username: 'Tanaka',
  password: 'T@na12ka',
  vibrationAlert: new Date('2025-10-17T03:00:03.000Z'), // 17 October 2025 at 05:00:03 UTC+2
};

const sampleUserData = {
  username: 'Tanaka',
  password: 'T@na12ka',
  device: 'laptop',
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    alertThresholds: {
      motion: 1,
      gas: 100,
      vibration: 5
    }
  }
};

export const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('🔄 Initializing database with sample data...');
    
    // Create or update user
    const user = await User.findOneAndUpdate(
      { username: sampleUserData.username },
      sampleUserData,
      { 
        upsert: true,
        new: true,
        runValidators: true
      }
    );
    
    console.log('✅ User created/updated:', user.username);
    
    // Create or update alert
    const alert = await Alert.findOneAndUpdate(
      { device: sampleAlertData.device },
      sampleAlertData,
      { 
        upsert: true,
        new: true,
        runValidators: true
      }
    );
    
    console.log('✅ Alert created/updated for device:', alert.device);
    console.log('📊 Database initialization completed successfully!');
    
    return { user, alert };
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}
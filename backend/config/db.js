import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let useMockData = false;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sweetcrave';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    
    // Set connection timeout to 5 seconds so it doesn't hang forever if MongoDB is not running
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = true;
    useMockData = false;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ WARNING: MongoDB is not running. Starting backend in Mock Memory DB mode!');
    isConnected = false;
    useMockData = true;
  }
};

export const getDBStatus = () => {
  return {
    isConnected,
    useMockData,
    readyState: mongoose.connection.readyState
  };
};

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const errorMsg = 'MONGODB_URI is missing in environment variables. Please add MONGODB_URI in Vercel Project Settings.';
    console.error(`[Database Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false, // Fail fast with descriptive error instead of 10s buffering timeout
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

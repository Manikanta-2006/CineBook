const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse existing database connection
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinebook', {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    console.warn('[Database Notice] Ensure MongoDB daemon (mongod) or MongoDB Atlas URI is accessible');
  }
};

module.exports = connectDB;

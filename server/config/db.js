const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinebook', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Don't immediately exit process in dev to give clear feedback
    console.warn('[Database Notice] Ensure MongoDB daemon (mongod) is running on port 27017');
  }
};

module.exports = connectDB;

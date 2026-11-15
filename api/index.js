const connectDB = require('../server/config/db');
const { app } = require('../server/server');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in Vercel function:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to MongoDB Atlas database',
      error: err.message,
      hint: 'Verify MONGODB_URI in Vercel Project Settings > Environment Variables',
    });
  }
  return app(req, res);
};

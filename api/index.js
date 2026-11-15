require('dotenv').config({ path: require('path').resolve(__dirname, '../server/.env') });
const connectDB = require('../server/config/db');
const { app } = require('../server/server');

module.exports = async (req, res) => {
  // Ensure DB connection is established before serving request
  await connectDB();
  return app(req, res);
};

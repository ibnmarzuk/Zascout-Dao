const mongoose = require('mongoose');

async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL;
    if (!mongoUri) {
      console.log('No MONGODB_URI or MONGODB_URI_LOCAL provided, skipping MongoDB connection.');
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // process.exit(1);
  }
}

module.exports = connectDB;

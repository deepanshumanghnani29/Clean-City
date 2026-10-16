const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleancity-ai';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB not connected (${error.message}). CleanCity AI running with fallback mock responses.`);
    // Do not terminate process so dev / demo server stays online
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Database: ${mongoose.connection.name || 'default'}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:');
    console.error('Error:', err.message);
    console.error('\nPlease check:');
    console.error('1. MongoDB Atlas cluster is running (not paused)');
    console.error('2. Your IP is whitelisted in Network Access');
    console.error('3. Database credentials are correct');
    console.error('4. Internet connection is stable');
    console.error('3. Database credentials are correct');
    console.error('4. Internet connection is stable');
    throw err;
  }
};

module.exports = connectDB;

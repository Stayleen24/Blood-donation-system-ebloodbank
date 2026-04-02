const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set (hidden for security)' : 'NOT SET');

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        console.log('Connection details:', {
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            readyState: mongoose.connection.readyState
        });
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Failed!');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.reason) {
            console.error('Reason:', err.reason);
        }
        console.error('\nPossible causes:');
        console.error('1. MongoDB Atlas cluster is paused or deleted');
        console.error('2. Network connectivity issues');
        console.error('3. Incorrect credentials in MONGO_URI');
        console.error('4. IP address not whitelisted in MongoDB Atlas');
        process.exit(1);
    });

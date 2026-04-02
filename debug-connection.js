const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

async function test() {
    const uri = process.env.MONGO_URI;
    console.log('Testing connection to:', uri ? 'URI is set' : 'URI is missing');

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            family: 4
        });
        console.log('Connected successfully!');
        fs.writeFileSync('connection-status.txt', 'Success');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        // Write full error details to file
        const errorDetails = `Error: ${err.message}\nCode: ${err.code}\nName: ${err.name}\nReason: ${err.reason}`;
        fs.writeFileSync('connection-status.txt', errorDetails);
        process.exit(1);
    }
}

test();

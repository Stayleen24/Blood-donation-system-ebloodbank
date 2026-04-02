const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const fs = require('fs');

async function test() {
    try {
        console.log('Connecting to', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected!');
        fs.writeFileSync('mongo-status.txt', 'Success');
        process.exit(0);
    } catch (err) {
        console.error(err);
        fs.writeFileSync('mongo-status.txt', 'Error: ' + err.message);
        process.exit(1);
    }
}

test();

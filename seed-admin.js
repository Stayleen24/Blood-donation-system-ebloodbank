const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./db');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = 'stayleen@gmail.com';
        const password = 'stayleen2004';
        const fullName = 'Admin Stayleen';

        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists. Updating role to admin...');
            user.role = 'admin';
            user.password = await bcrypt.hash(password, 10); // Ensure password is correct
            await user.save();
            console.log('✅ Admin user updated successfully');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({
                email,
                password: hashedPassword,
                full_name: fullName,
                role: 'admin'
            });
            console.log('✅ Admin user created successfully');
        }



        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
        fs.writeFileSync('seed-status.txt', 'Error: ' + err.message);
        process.exit(1);
    }
};

seedAdmin();

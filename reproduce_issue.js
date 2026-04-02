const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CampRegistration = require('./models/CampRegistration');
const User = require('./models/User');
const BloodCamp = require('./models/BloodCamp');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find a user and a camp
        const user = await User.findOne();
        const camp = await BloodCamp.findOne();

        if (!user || !camp) {
            console.log('User or Camp not found. Please seed data first.');
            process.exit(1);
        }

        console.log('User:', user._id);
        console.log('Camp:', camp._id);

        const payload = {
            camp: camp._id,
            user: user._id,
            full_name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            age: 25,
            blood_group: 'A+',
            certificate_id: `CERT-${Date.now()}`,
            has_donated: true,
            donated_at: new Date()
        };

        console.log('Attempting to create registration with payload:', payload);

        const registration = await CampRegistration.create(payload);
        console.log('Registration created successfully:', registration);

    } catch (err) {
        console.error('Error creating registration:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();

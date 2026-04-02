const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Donor = require('./models/Donor');
const BloodBank = require('./models/BloodBank');
const BloodCamp = require('./models/BloodCamp');
const BloodInventory = require('./models/BloodInventory');
const connectDB = require('./db');
require('dotenv').config();

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing data (optional, comment out if you want to keep existing data)
        await Donor.deleteMany({});
        await BloodBank.deleteMany({});
        await BloodCamp.deleteMany({});
        await BloodInventory.deleteMany({});
        // Be careful deleting users if you want to keep admin/real users. 
        // For now, I'll only delete users created by this script if I could track them, 
        // but for simplicity in this seed script, I'll delete ALL non-admin users or just populate new ones.
        // Let's just create new ones and not delete Users to avoid deleting admin.

        console.log('Cleared existing Donor, BloodBank, BloodCamp, and BloodInventory data (kept Users)');

        const password = await bcrypt.hash('password123', 10);

        // --- Seed Blood Banks ---
        const bloodBanksData = [
            {
                name: 'LifeDrop Central Bank',
                state: 'Maharashtra',
                district: 'Mumbai City',
                address: '123 Main St, Colaba, Mumbai',
                phone: '022-12345678',
                email: 'contact@lifedropcentral.com',
                category: 'Private',
                location: { type: 'Point', coordinates: [72.82, 18.92] }
            },
            {
                name: 'City General Hospital Blood Bank',
                state: 'Maharashtra',
                district: 'Mumbai Suburban',
                address: '456 SV Road, Bandra West, Mumbai',
                phone: '022-87654321',
                email: 'bloodbank@citygeneral.com',
                category: 'Government',
                location: { type: 'Point', coordinates: [72.83, 19.06] }
            },
            {
                name: 'Suburban Red Cross',
                state: 'Maharashtra',
                district: 'Thane',
                address: '789 LBS Marg, Thane West',
                phone: '022-11223344',
                email: 'thane@redcross.org',
                category: 'Charitable',
                location: { type: 'Point', coordinates: [72.97, 19.19] }
            },
            {
                name: 'Navi Mumbai Life Care',
                state: 'Maharashtra',
                district: 'Raigad',
                address: 'Sector 17, Vashi, Navi Mumbai',
                phone: '022-99887766',
                email: 'info@lifecarenm.com',
                category: 'Private',
                location: { type: 'Point', coordinates: [73.00, 19.08] }
            },
            {
                name: 'South Mumbai Trust',
                state: 'Maharashtra',
                district: 'Mumbai City',
                address: 'Marine Lines, Mumbai',
                phone: '022-55443322',
                email: 'trust@southmumbai.com',
                category: 'Trust',
                location: { type: 'Point', coordinates: [72.82, 18.94] }
            },
            {
                name: 'Pune City Blood Centre',
                state: 'Maharashtra',
                district: 'Pune',
                address: 'Deccan Gymkhana, Pune',
                phone: '020-25678901',
                email: 'info@punebloodcentre.org',
                category: 'Private',
                location: { type: 'Point', coordinates: [73.85, 18.52] }
            },
            {
                name: 'Sassoon General Hospital Blood Bank',
                state: 'Maharashtra',
                district: 'Pune',
                address: 'Station Road, Pune',
                phone: '020-26128000',
                email: 'bloodbank@sassoon.gov.in',
                category: 'Government',
                location: { type: 'Point', coordinates: [73.87, 18.52] }
            },
            {
                name: 'Nagpur Life Savers',
                state: 'Maharashtra',
                district: 'Nagpur',
                address: 'Dharampeth, Nagpur',
                phone: '0712-2531122',
                email: 'contact@nagpurlifesavers.com',
                category: 'Charitable',
                location: { type: 'Point', coordinates: [79.08, 21.14] }
            },
            {
                name: 'Nashik Red Cross Society',
                state: 'Maharashtra',
                district: 'Nashik',
                address: 'MG Road, Nashik',
                phone: '0253-2578899',
                email: 'nashik@redcross.org',
                category: 'Trust',
                location: { type: 'Point', coordinates: [73.78, 19.99] }
            },
            {
                name: 'Aurangabad District Blood Bank',
                state: 'Maharashtra',
                district: 'Aurangabad',
                address: 'Nirala Bazar, Aurangabad',
                phone: '0240-2345678',
                email: 'bloodbank@aurangabadhealth.gov.in',
                category: 'Government',
                location: { type: 'Point', coordinates: [75.32, 19.87] }
            },
            {
                name: 'Solapur General Hospital Bank',
                state: 'Maharashtra',
                district: 'Solapur',
                address: 'Civil Lines, Solapur',
                phone: '0217-2731122',
                email: 'contact@solapurhospital.com',
                category: 'Government',
                location: { type: 'Point', coordinates: [75.90, 17.65] }
            },
            {
                name: 'Kolhapur Health Care',
                state: 'Maharashtra',
                district: 'Kolhapur',
                address: 'Rajarampuri, Kolhapur',
                phone: '0231-2523344',
                email: 'info@kolhapurhealthcare.org',
                category: 'Private',
                location: { type: 'Point', coordinates: [74.24, 16.70] }
            },
            {
                name: 'Amravati Blood Donation Centre',
                state: 'Maharashtra',
                district: 'Amravati',
                address: 'Camp Area, Amravati',
                phone: '0721-2667788',
                email: 'donate@amravatiblood.com',
                category: 'Private',
                location: { type: 'Point', coordinates: [77.75, 20.93] }
            },
            {
                name: 'Nanded Life Line',
                state: 'Maharashtra',
                district: 'Nanded',
                address: 'Vazirabad, Nanded',
                phone: '02462-234556',
                email: 'lifeline@nandedhealth.com',
                category: 'Charitable',
                location: { type: 'Point', coordinates: [77.30, 19.15] }
            },
            {
                name: 'Jalgaon District Hospital',
                state: 'Maharashtra',
                district: 'Jalgaon',
                address: 'Ring Road, Jalgaon',
                phone: '0257-2234567',
                email: 'bloodbank@jalgaonhospital.in',
                category: 'Government',
                location: { type: 'Point', coordinates: [75.56, 21.00] }
            }
        ];

        const createdBloodBanks = await BloodBank.insertMany(bloodBanksData);
        console.log(`✅ Seeded ${createdBloodBanks.length} Blood Banks`);

        // --- Seed Blood Inventory ---
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const inventoryData = [];

        for (const bank of createdBloodBanks) {
            for (const group of bloodGroups) {
                // Random units between 0 and 50
                const units = Math.floor(Math.random() * 51);
                inventoryData.push({
                    blood_bank: bank._id,
                    blood_group: group,
                    component_type: 'Whole Blood',
                    units_available: units
                });
            }
        }
        await BloodInventory.insertMany(inventoryData);
        console.log(`✅ Seeded Blood Inventory for all Blood Banks`);


        // --- Seed Blood Camps ---
        const campsData = [
            {
                name: 'Mega Blood Donation Drive',
                organizer: 'Rotary Club Mumbai',
                description: 'Annual blood donation drive. Join us to save lives!',
                camp_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                start_time: '09:00 AM',
                end_time: '05:00 PM',
                state: 'Maharashtra',
                district: 'Mumbai City',
                address: 'Azad Maidan, Mumbai',
                contact_phone: '9876543210',
                status: 'upcoming'
            },
            {
                name: 'College Campus Camp',
                organizer: 'NSS Unit',
                description: 'Blood donation camp for students and faculty.',
                camp_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                start_time: '10:00 AM',
                end_time: '04:00 PM',
                state: 'Maharashtra',
                district: 'Mumbai Suburban',
                address: 'IIT Bombay Campus, Powai',
                contact_phone: '9123456789',
                status: 'upcoming'
            },
            {
                name: 'Community Health Camp',
                organizer: 'Local Welfare Association',
                description: 'Health checkup and blood donation.',
                camp_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                start_time: '08:00 AM',
                end_time: '02:00 PM',
                state: 'Maharashtra',
                district: 'Thane',
                address: 'Community Hall, Thane West',
                contact_phone: '8899776655',
                status: 'completed'
            },
            {
                name: 'Corporate Drive - IT Park',
                organizer: 'TechCorp Cares',
                description: 'Corporate social responsibility initiative for IT professionals.',
                camp_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                start_time: '10:00 AM',
                end_time: '03:00 PM',
                state: 'Maharashtra',
                district: 'Pune',
                address: 'Hinjewadi IT Park, Phase 1',
                contact_phone: '9001122334',
                status: 'upcoming'
            },
            {
                name: 'Rotary Club Mega Camp',
                organizer: 'Rotary Club Nagpur',
                description: 'City-wide mega blood donation event.',
                camp_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                start_time: '08:00 AM',
                end_time: '06:00 PM',
                state: 'Maharashtra',
                district: 'Nagpur',
                address: 'Kasturchand Park, Nagpur',
                contact_phone: '9988776655',
                status: 'upcoming'
            },
            {
                name: 'Youth Organization Camp',
                organizer: 'Nashik Youth Front',
                description: 'Empowering youth through blood donation.',
                camp_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                start_time: '09:00 AM',
                end_time: '01:00 PM',
                state: 'Maharashtra',
                district: 'Nashik',
                address: 'College Road, Nashik',
                contact_phone: '9876512345',
                status: 'upcoming'
            },
            {
                name: 'Lions Club Charity Camp',
                organizer: 'Lions Club Aurangabad',
                description: 'Charity blood donation drive for government hospitals.',
                camp_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                start_time: '10:00 AM',
                end_time: '04:00 PM',
                state: 'Maharashtra',
                district: 'Aurangabad',
                address: 'Cidco, Aurangabad',
                contact_phone: '9123498765',
                status: 'completed'
            },
            {
                name: 'Independence Day Special Camp',
                organizer: 'Solapur Patriots',
                description: 'Donate blood, celebrate freedom.',
                camp_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                start_time: '08:00 AM',
                end_time: '05:00 PM',
                state: 'Maharashtra',
                district: 'Solapur',
                address: 'Park Stadium, Solapur',
                contact_phone: '9012345678',
                status: 'upcoming'
            },
            {
                name: 'Women\'s Day Blood Donation',
                organizer: 'Women Empowerment Forum',
                description: 'Special drive honoring women heroes.',
                camp_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                start_time: '09:00 AM',
                end_time: '03:00 PM',
                state: 'Maharashtra',
                district: 'Kolhapur',
                address: 'Tarabai Park, Kolhapur',
                contact_phone: '8098765432',
                status: 'completed'
            },
            {
                name: 'Tech Hub Blood Drive',
                organizer: 'Vashi IT Association',
                description: 'Techies join hands to save lives.',
                camp_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                start_time: '11:00 AM',
                end_time: '04:00 PM',
                state: 'Maharashtra',
                district: 'Raigad',
                address: 'Inorbit Mall Atrium, Vashi',
                contact_phone: '7089654321',
                status: 'upcoming'
            },
            {
                name: 'City Marathon Donation Booth',
                organizer: 'Mumbai Runs',
                description: 'Post-marathon voluntary blood donation.',
                camp_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                start_time: '06:00 AM',
                end_time: '12:00 PM',
                state: 'Maharashtra',
                district: 'Mumbai City',
                address: 'Marine Drive Promenade',
                contact_phone: '9812345670',
                status: 'upcoming'
            },
            {
                name: 'Health Awareness Camp',
                organizer: 'Amravati Medical Association',
                description: 'Free checkups and blood donation.',
                camp_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
                start_time: '09:00 AM',
                end_time: '02:00 PM',
                state: 'Maharashtra',
                district: 'Amravati',
                address: 'Rajkamal Square, Amravati',
                contact_phone: '9123456789',
                status: 'completed'
            }
        ];
        await BloodCamp.insertMany(campsData);
        console.log(`✅ Seeded ${campsData.length} Blood Camps`);


        // --- Seed Donors (and Users for them) ---
        const donorsData = [
            { name: 'Rahul Sharma', email: 'rahul.s@example.com', district: 'Mumbai City', blood: 'A+', gender: 'Male' },
            { name: 'Priya Patel', email: 'priya.p@example.com', district: 'Mumbai Suburban', blood: 'O+', gender: 'Female' },
            { name: 'Amit Singh', email: 'amit.s@example.com', district: 'Thane', blood: 'B+', gender: 'Male' },
            { name: 'Sneha Gupta', email: 'sneha.g@example.com', district: 'Mumbai City', blood: 'AB-', gender: 'Female' },
            { name: 'Vikram Malhotra', email: 'vikram.m@example.com', district: 'Raigad', blood: 'O-', gender: 'Male' },
            { name: 'Anjali Desai', email: 'anjali.d@example.com', district: 'Mumbai Suburban', blood: 'B-', gender: 'Female' },
            { name: 'Rohan Mehta', email: 'rohan.m@example.com', district: 'Mumbai City', blood: 'A-', gender: 'Male' },
            { name: 'Kavita Iyer', email: 'kavita.i@example.com', district: 'Thane', blood: 'AB+', gender: 'Female' },
            { name: 'Suresh Patil', email: 'suresh.p@example.com', district: 'Pune', blood: 'O+', gender: 'Male' },
            { name: 'Divya Joshi', email: 'divya.j@example.com', district: 'Mumbai Suburban', blood: 'A+', gender: 'Female' },
            { name: 'Kunal Kapoor', email: 'kunal.k@example.com', district: 'Pune', blood: 'B+', gender: 'Male' },
            { name: 'Neha Sharma', email: 'neha.s@example.com', district: 'Nagpur', blood: 'A+', gender: 'Female' },
            { name: 'Vivek Oberoi', email: 'vivek.o@example.com', district: 'Nashik', blood: 'O-', gender: 'Male' },
            { name: 'Swati Verma', email: 'swati.v@example.com', district: 'Aurangabad', blood: 'AB+', gender: 'Female' },
            { name: 'Arjun Reddy', email: 'arjun.r@example.com', district: 'Solapur', blood: 'B-', gender: 'Male' },
            { name: 'Megha Nair', email: 'megha.n@example.com', district: 'Kolhapur', blood: 'A-', gender: 'Female' },
            { name: 'Gaurav Kadam', email: 'gaurav.k@example.com', district: 'Amravati', blood: 'O+', gender: 'Male' },
            { name: 'Pooja Hegde', email: 'pooja.h@example.com', district: 'Nanded', blood: 'B+', gender: 'Female' },
            { name: 'Rajeev Sen', email: 'rajeev.s@example.com', district: 'Jalgaon', blood: 'AB-', gender: 'Male' },
            { name: 'Simran Kaur', email: 'simran.k@example.com', district: 'Akola', blood: 'A+', gender: 'Female' },
            { name: 'Tariq Khan', email: 'tariq.k@example.com', district: 'Mumbai City', blood: 'O+', gender: 'Male' },
            { name: 'Ayesha Takia', email: 'ayesha.t@example.com', district: 'Mumbai Suburban', blood: 'B-', gender: 'Female' },
            { name: 'Manoj Bajpayee', email: 'manoj.b@example.com', district: 'Thane', blood: 'A-', gender: 'Male' },
            { name: 'Shreya Ghoshal', email: 'shreya.g@example.com', district: 'Pune', blood: 'AB+', gender: 'Female' },
            { name: 'Varun Dhawan', email: 'varun.d@example.com', district: 'Raigad', blood: 'O-', gender: 'Male' },
            { name: 'Kriti Sanon', email: 'kriti.s@example.com', district: 'Nagpur', blood: 'B+', gender: 'Female' },
            { name: 'Aditya Roy', email: 'aditya.r@example.com', district: 'Nashik', blood: 'A+', gender: 'Male' },
            { name: 'Disha Patani', email: 'disha.p@example.com', district: 'Aurangabad', blood: 'O+', gender: 'Female' },
            { name: 'Ishaan Khatter', email: 'ishaan.k@example.com', district: 'Solapur', blood: 'AB-', gender: 'Male' },
            { name: 'Tara Sutaria', email: 'tara.s@example.com', district: 'Kolhapur', blood: 'A-', gender: 'Female' },
            { name: 'Tiger Shroff', email: 'tiger.s@example.com', district: 'Amravati', blood: 'B+', gender: 'Male' },
            { name: 'Ananya Panday', email: 'ananya.p@example.com', district: 'Nanded', blood: 'O+', gender: 'Female' },
            { name: 'Sara Ali Khan', email: 'sara.a@example.com', district: 'Jalgaon', blood: 'A+', gender: 'Female' },
            { name: 'Kartik Aaryan', email: 'kartik.a@example.com', district: 'Akola', blood: 'B-', gender: 'Male' },
            { name: 'Kiara Advani', email: 'kiara.a@example.com', district: 'Mumbai City', blood: 'AB+', gender: 'Female' },
            { name: 'Sidharth Malhotra', email: 'sidharth.m@example.com', district: 'Mumbai Suburban', blood: 'O-', gender: 'Male' },
            { name: 'Alia Bhatt', email: 'alia.b@example.com', district: 'Thane', blood: 'A-', gender: 'Female' },
            { name: 'Ranbir Kapoor', email: 'ranbir.k@example.com', district: 'Pune', blood: 'B+', gender: 'Male' },
            { name: 'Deepika Padukone', email: 'deepika.p@example.com', district: 'Raigad', blood: 'O+', gender: 'Female' },
            { name: 'Ranveer Singh', email: 'ranveer.s@example.com', district: 'Nagpur', blood: 'AB-', gender: 'Male' },
        ];

        for (const d of donorsData) {
            // Create User first
            let user = await User.findOne({ email: d.email });
            if (!user) {
                user = await User.create({
                    email: d.email,
                    password: password,
                    full_name: d.name,
                    role: 'user'
                });
            }

            // Create Donor
            await Donor.create({
                user: user._id,
                full_name: d.name,
                email: d.email,
                phone: '9' + Math.floor(Math.random() * 900000000 + 100000000), // Random 10 digit
                age: Math.floor(Math.random() * 40) + 18, // 18-58
                blood_group: d.blood,
                state: 'Maharashtra',
                district: d.district,
                address: `Some Address in ${d.district}`,
                is_available: true
            });
        }
        console.log(`✅ Seeded ${donorsData.length} Donors`);


        console.log('Database seeded successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
};

seedData();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const User = require('./models/User');
const BloodBank = require('./models/BloodBank');
const BloodCamp = require('./models/BloodCamp');
const Donor = require('./models/Donor');
const ReportedIssue = require('./models/ReportedIssue');
const CampRegistration = require('./models/CampRegistration');
const BloodInventory = require('./models/BloodInventory');


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied: Admins only' });
    }
};

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ error: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            full_name: fullName
        });

        res.status(201).json({ message: 'User registered', userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, full_name: user.full_name, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Admin Routes ---

app.get('/api/admin/stats', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalCamps = await BloodCamp.countDocuments();
        const activeIssues = await ReportedIssue.countDocuments({ status: 'open' });

        // Aggregate inventory by blood group
        const inventoryStats = await BloodInventory.aggregate([
            { $group: { _id: "$blood_group", totalUnits: { $sum: "$units" } } }
        ]);

        // Recent activity
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('email full_name createdAt');
        const recentDonors = await Donor.find().sort({ createdAt: -1 }).limit(5).select('full_name blood_group createdAt');
        const recentIssues = await ReportedIssue.find().sort({ createdAt: -1 }).limit(5).populate('reported_by', 'full_name email');

        res.json({
            totalDonors,
            totalUsers,
            totalCamps,
            activeIssues,
            inventoryStats,
            recentActivity: {
                users: recentUsers,
                donors: recentDonors,
                issues: recentIssues
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin User Management
app.get('/api/admin/users', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/users/:id/status', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        user.status = user.status === 'active' ? 'restricted' : 'active';
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Issue Management
app.get('/api/admin/issues', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const issues = await ReportedIssue.find()
            .populate('reported_by', 'full_name email')
            .populate('reported_user', 'full_name email')
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/issues/:id/resolve', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const issue = await ReportedIssue.findById(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        
        issue.status = 'resolved';
        await issue.save();
        res.json(issue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/issues', authenticateToken, async (req, res) => {
    // Allows users to submit an issue
    try {
        const { subject, description, reported_user } = req.body;
        const issue = await ReportedIssue.create({
            reported_by: req.user.id,
            reported_user: reported_user || null,
            subject,
            description
        });
        res.status(201).json(issue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Blood Camp Management
app.post('/api/admin/blood-camps', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const camp = await BloodCamp.create(req.body);
        res.status(201).json(camp);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/blood-camps/:id', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const camp = await BloodCamp.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!camp) return res.status(404).json({ error: 'Camp not found' });
        res.json(camp);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/admin/blood-camps/:id', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const camp = await BloodCamp.findByIdAndDelete(req.params.id);
        if (!camp) return res.status(404).json({ error: 'Camp not found' });
        res.json({ message: 'Camp deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Blood Banks Routes ---

app.get('/api/blood-banks', async (req, res) => {
    try {
        const banks = await BloodBank.find().sort({ name: 1 });
        res.json(banks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/blood-inventory', async (req, res) => {
    const { bloodBankId, bloodGroup, componentType } = req.query;
    let query = {};
    if (bloodBankId) query.blood_bank = bloodBankId;
    if (bloodGroup) query.blood_group = bloodGroup;
    if (componentType) query.component_type = componentType;

    try {
        const inventory = await BloodInventory.find(query);
        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// --- Blood Camps Routes ---

app.get('/api/blood-camps', async (req, res) => {
    const { state, status } = req.query;
    let query = {};

    if (state) query.state = state;
    if (status) query.status = status;

    try {
        const camps = await BloodCamp.find(query).sort({ camp_date: 1 });
        res.json(camps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/blood-camps/:id', async (req, res) => {
    try {
        const camp = await BloodCamp.findById(req.params.id);
        if (!camp) return res.status(404).json({ error: 'Camp not found' });
        res.json(camp);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/camp-registrations', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    console.log('--- CAMP REGISTRATION REQUEST ---');
    console.log('Request Body:', req.body);
    console.log('User ID:', userId);
    const { campId, fullName, email, phone, age, bloodGroup, certificateId, hasDonated, donatedAt } = req.body;

    try {
        const registration = await CampRegistration.create({
            camp: campId,
            user: userId,
            full_name: fullName,
            email,
            phone,
            age,
            blood_group: bloodGroup,
            certificate_id: certificateId,
            has_donated: hasDonated,
            donated_at: donatedAt
        });
        res.status(201).json({ id: registration._id, message: 'Registered successfully' });
    } catch (err) {
        console.error('Camp Registration Error:', err);
        res.status(500).json({
            error: err.message || 'Registration processing failed',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

app.get('/api/camp-registrations/:id', async (req, res) => {
    try {
        const registration = await CampRegistration.findById(req.params.id).populate('camp');
        if (!registration) return res.status(404).json({ error: 'Certificate not found' });
        res.json(registration);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Donors Routes ---


app.get('/api/donors', authenticateToken, async (req, res) => {
    const { bloodGroup, state } = req.query;
    let query = { is_available: true };

    if (bloodGroup) query.blood_group = bloodGroup;
    if (state) query.state = state;

    try {
        const donors = await Donor.find(query).sort({ createdAt: -1 });
        res.json(donors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/donors/me', authenticateToken, async (req, res) => {
    try {
        const donor = await Donor.findOne({ user: req.user.id });
        res.json(donor || null); // Return null if not found (not 404)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/donors/status', authenticateToken, async (req, res) => {
    try {
        const donor = await Donor.findOne({ user: req.user.id });
        if (!donor) return res.status(404).json({ error: 'Donor profile not found' });

        donor.is_available = !donor.is_available;
        await donor.save();

        res.json({ is_available: donor.is_available });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/donors', authenticateToken, async (req, res) => {


    const userId = req.user.id;
    const { fullName, email, phone, age, bloodGroup, state, district, address } = req.body;

    try {
        const donor = await Donor.create({
            user: userId,
            full_name: fullName,
            email,
            phone,
            age,
            blood_group: bloodGroup,
            state,
            district,
            address
        });
        res.status(201).json({ id: donor._id, message: 'Donor registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

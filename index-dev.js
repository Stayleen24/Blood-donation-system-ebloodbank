const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// In-memory storage (temporary development solution)
// WARNING: This is only for development/testing. Data will be lost on server restart.
const users = new Map();
const donors = new Map();
const campRegistrations = new Map();
const reportedIssues = new Map();
const bloodCamps = new Map();

console.log('⚠️  Running in IN-MEMORY MODE - Data will not persist');
console.log('📝 To use MongoDB, fix the connection in .env file');

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
        if (users.has(email)) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        users.set(email, {
            _id: userId,
            email,
            password: hashedPassword,
            full_name: fullName,
            role: 'user',
            status: 'active',
            createdAt: new Date()
        });

        console.log(`✅ User registered: ${email}`);
        res.status(201).json({ message: 'User registered', userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = users.get(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.status === 'restricted') {
            return res.status(403).json({ error: 'Account restricted. Contact support.' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, full_name: user.full_name, role: user.role, status: user.status } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = Array.from(users.values()).find(u => u._id === req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Admin Routes ---

app.get('/api/admin/stats', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const totalDonors = donors.size;
        const totalUsers = users.size;
        const totalCamps = bloodCamps.size;
        const activeIssues = Array.from(reportedIssues.values()).filter(i => i.status === 'open').length;

        const recentUsers = Array.from(users.values()).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
        const recentDonors = Array.from(donors.values()).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
        const recentIssuesArray = Array.from(reportedIssues.values())
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)
            .map(issue => {
                const reporter = Array.from(users.values()).find(u => u._id === issue.reported_by);
                return { ...issue, reported_by: reporter ? { full_name: reporter.full_name, email: reporter.email } : null }
            });

        res.json({
            totalDonors,
            totalUsers,
            totalCamps,
            activeIssues,
            inventoryStats: [],
            recentActivity: {
                users: recentUsers,
                donors: recentDonors,
                issues: recentIssuesArray
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
        const allUsers = Array.from(users.values()).map(({ password, ...rest }) => rest);
        res.json(allUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/users/:id/status', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const userArray = Array.from(users.values());
        const user = userArray.find(u => u._id === req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        user.status = user.status === 'active' ? 'restricted' : 'active';
        users.set(user.email, user); // Wait: users map key is email not _id
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Issue Management
app.get('/api/admin/issues', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const issuesWithUsers = Array.from(reportedIssues.values()).map(issue => {
            const reporter = Array.from(users.values()).find(u => u._id === issue.reported_by);
            const reportedUser = Array.from(users.values()).find(u => u._id === issue.reported_user);
            return {
                ...issue,
                reported_by: reporter ? { full_name: reporter.full_name, email: reporter.email } : null,
                reported_user: reportedUser ? { full_name: reportedUser.full_name, email: reportedUser.email } : null
            };
        });
        res.json(issuesWithUsers);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/issues/:id/resolve', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const issue = reportedIssues.get(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        
        issue.status = 'resolved';
        reportedIssues.set(req.params.id, issue);
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/issues', authenticateToken, async (req, res) => {
    try {
        const { subject, description, reported_user } = req.body;
        const issueId = `issue_${Date.now()}`;
        const issue = {
            _id: issueId,
            reported_by: req.user.id,
            reported_user: reported_user || null,
            subject,
            description,
            status: 'open',
            createdAt: new Date()
        };
        reportedIssues.set(issueId, issue);
        res.status(201).json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Blood Camp Management
app.post('/api/admin/blood-camps', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const campId = `camp_${Date.now()}`;
        const camp = { _id: campId, ...req.body, status: req.body.status || 'upcoming', createdAt: new Date() };
        bloodCamps.set(campId, camp);
        res.status(201).json(camp);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/blood-camps/:id', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        if (!bloodCamps.has(req.params.id)) return res.status(404).json({ error: 'Camp not found' });
        const camp = { ...bloodCamps.get(req.params.id), ...req.body };
        bloodCamps.set(req.params.id, camp);
        res.json(camp);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/admin/blood-camps/:id', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        if (!bloodCamps.has(req.params.id)) return res.status(404).json({ error: 'Camp not found' });
        bloodCamps.delete(req.params.id);
        res.json({ message: 'Camp deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Blood Banks Routes ---

app.get('/api/blood-banks', async (req, res) => {
    // Return empty for now - you can add sample data if needed
    res.json([]);
});

app.get('/api/blood-inventory', async (req, res) => {
    res.json([]);
});

// --- Blood Camps Routes ---

app.get('/api/blood-camps', async (req, res) => {
    const { state, status } = req.query;
    let filtered = Array.from(bloodCamps.values());
    if (state) filtered = filtered.filter(c => c.state === state);
    if (status) filtered = filtered.filter(c => c.status === status);
    res.json(filtered);
});

app.get('/api/blood-camps/:id', async (req, res) => {
    const camp = bloodCamps.get(req.params.id);
    if (!camp) return res.status(404).json({ error: 'Camp not found' });
    res.json(camp);
});

app.post('/api/camp-registrations', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { campId, fullName, email, phone, age, bloodGroup, certificateId, hasDonated, donatedAt } = req.body;

    try {
        const regId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const registration = {
            _id: regId,
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
        };

        campRegistrations.set(regId, registration);
        res.status(201).json({ id: regId, message: 'Registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/camp-registrations/:id', async (req, res) => {
    const registration = campRegistrations.get(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Certificate not found' });
    res.json(registration);
});

// --- Donors Routes ---

app.get('/api/donors', authenticateToken, async (req, res) => {
    const { bloodGroup, state } = req.query;
    let filteredDonors = Array.from(donors.values()).filter(d => d.is_available);

    if (bloodGroup) filteredDonors = filteredDonors.filter(d => d.blood_group === bloodGroup);
    if (state) filteredDonors = filteredDonors.filter(d => d.state === state);

    res.json(filteredDonors);
});

app.get('/api/donors/me', authenticateToken, async (req, res) => {
    const donor = Array.from(donors.values()).find(d => d.user === req.user.id);
    res.json(donor || null);
});

app.put('/api/donors/status', authenticateToken, async (req, res) => {
    const donor = Array.from(donors.values()).find(d => d.user === req.user.id);
    if (!donor) return res.status(404).json({ error: 'Donor profile not found' });

    donor.is_available = !donor.is_available;
    donors.set(donor._id, donor);

    res.json({ is_available: donor.is_available });
});

app.post('/api/donors', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { fullName, email, phone, age, bloodGroup, state, district, address } = req.body;

    try {
        const donorId = `donor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const donor = {
            _id: donorId,
            user: userId,
            full_name: fullName,
            email,
            phone,
            age,
            blood_group: bloodGroup,
            state,
            district,
            address,
            is_available: true,
            createdAt: new Date()
        };

        donors.set(donorId, donor);
        res.status(201).json({ id: donorId, message: 'Donor registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`⚠️  IN-MEMORY MODE: Data will be lost on restart`);
    console.log(`💡 To enable persistence, fix MongoDB connection in .env`);
});

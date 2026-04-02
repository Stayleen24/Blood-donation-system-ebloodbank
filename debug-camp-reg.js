const http = require('http');

// Configuration
const PORT = 5000;
const EMAIL = 'rahul.s@example.com';
const PASSWORD = 'password123';

const postRequest = (path, data, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify(data));
        req.end();
    });
};

const getRequest = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: 'GET',
            headers: {}
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
};

const run = async () => {
    try {
        console.log('1. Logging in...');
        const loginRes = await postRequest('/api/auth/login', { email: EMAIL, password: PASSWORD });

        if (loginRes.status !== 200) {
            console.error('Login failed:', loginRes.body);
            return;
        }

        const token = loginRes.body.token;
        console.log('Login successful. Token obtained.');

        console.log('2. Fetching camps...');
        const campsRes = await getRequest('/api/blood-camps');

        if (campsRes.status !== 200 || !campsRes.body.length) {
            console.error('Failed to fetch camps or no camps found:', campsRes.body);
            return;
        }

        const camp = campsRes.body[0];
        console.log(`Found camp: ${camp.name} (${camp._id})`);

        console.log('3. Attempting registration...');
        const payload = {
            campId: camp._id,
            fullName: 'Debug User',
            email: 'debug@example.com',
            phone: '1234567890',
            age: 25,
            bloodGroup: 'O+',
            certificateId: `CERT-${Date.now()}`,
            hasDonated: true,
            donatedAt: new Date().toISOString()
        };

        console.log('Payload:', payload);

        const regRes = await postRequest('/api/camp-registrations', payload, token);

        console.log('Response Status:', regRes.status);
        console.log('Response Body:', regRes.body);

    } catch (err) {
        console.error('Script error:', err);
    }
};

run();

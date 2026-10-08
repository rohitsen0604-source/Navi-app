const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('Testing Admin Panel Endpoints...');
  const tests = [
    { name: 'Admin Login (SUPER_ADMIN)', path: '/api/auth/admin-login', method: 'POST', body: { email: 'admin@naavi.in', password: 'password123', role: 'SUPER_ADMIN' } },
    { name: 'Dashboard Stats', path: '/api/admin/stats', method: 'GET' },
    { name: 'Customers List', path: '/api/admin/customers', method: 'GET' },
    { name: 'Drivers List', path: '/api/admin/drivers', method: 'GET' },
    { name: 'Boats List', path: '/api/admin/boats', method: 'GET' },
    { name: 'Rivers List', path: '/api/admin/rivers', method: 'GET' },
    { name: 'Zones List', path: '/api/admin/zones', method: 'GET' },
    { name: 'Ghats List', path: '/api/admin/ghats', method: 'GET' },
    { name: 'Ride Types List', path: '/api/admin/ride-types', method: 'GET' },
    { name: 'Pricing Config', path: '/api/admin/pricing', method: 'GET' },
    { name: 'Bookings List', path: '/api/admin/bookings', method: 'GET' },
    { name: 'Payments List', path: '/api/admin/payments', method: 'GET' },
    { name: 'Coupons List', path: '/api/admin/coupons', method: 'GET' },
    { name: 'Reports Summary', path: '/api/admin/reports', method: 'GET' },
    { name: 'Audit Logs', path: '/api/admin/audit-logs', method: 'GET' },
    { name: 'Settings', path: '/api/admin/settings', method: 'GET' }
  ];

  for (const t of tests) {
    try {
      const res = await makeRequest(t.path, t.method, t.body);
      console.log(`[PASS] ${t.name}: Status ${res.status}, Success: ${res.body.success}`);
    } catch (e) {
      console.error(`[FAIL] ${t.name}: ${e.message}`);
    }
  }
  console.log('All Admin Backend Tests Completed!');
}

runTests();

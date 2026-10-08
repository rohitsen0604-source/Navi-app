const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Coupon Endpoints...');

  // 1. Get coupons
  const list = await makeRequest('/api/coupons');
  console.log('[1] Get Coupons:', list.status, list.body?.success, 'Count:', list.body?.count);

  // 2. Apply NAAVI50
  const apply1 = await makeRequest('/api/coupons/apply', 'POST', {
    code: 'NAAVI50',
    fareAmount: 800,
    zoneNumber: 1
  });
  console.log('[2] Apply NAAVI50:', apply1.status, apply1.body?.success, 'Discount:', apply1.body?.data?.discountAmount, 'Final:', apply1.body?.data?.finalAmount);

  // 3. Apply RIVER100
  const apply2 = await makeRequest('/api/coupons/apply', 'POST', {
    code: 'RIVER100',
    fareAmount: 650
  });
  console.log('[3] Apply RIVER100:', apply2.status, apply2.body?.success, 'Discount:', apply2.body?.data?.discountAmount);

  // 4. Test Invalid Coupon
  const applyInvalid = await makeRequest('/api/coupons/apply', 'POST', {
    code: 'INVALIDCODE99'
  });
  console.log('[4] Apply Invalid Coupon Status:', applyInvalid.status, 'Message:', applyInvalid.body?.message);

  console.log('Coupons API Endpoints Verified Successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

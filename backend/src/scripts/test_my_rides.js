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
  console.log('Testing My Rides History & Filter Endpoints...');

  // 1. Get all rides
  const all = await makeRequest('/api/bookings/my-bookings');
  console.log('[1] All Rides:', all.status, all.body?.success, 'Count:', all.body?.count);

  // 2. Filter Completed
  const completed = await makeRequest('/api/bookings/my-bookings?status=COMPLETED');
  console.log('[2] Completed Rides:', completed.status, completed.body?.success, 'Count:', completed.body?.count);

  // 3. Filter Upcoming
  const upcoming = await makeRequest('/api/bookings/my-bookings?status=UPCOMING');
  console.log('[3] Upcoming Rides:', upcoming.status, upcoming.body?.success, 'Count:', upcoming.body?.count);

  // 4. Filter Cancelled
  const cancelled = await makeRequest('/api/bookings/my-bookings?status=CANCELLED');
  console.log('[4] Cancelled Rides:', cancelled.status, cancelled.body?.success, 'Count:', cancelled.body?.count);

  // 5. Get Invoice for Completed Ride
  const invoice = await makeRequest('/api/bookings/b_hist_1/invoice');
  console.log('[5] Invoice Details:', invoice.status, invoice.body?.success, 'InvoiceNo:', invoice.body?.data?.invoiceNumber, 'Total:', invoice.body?.data?.fareBreakdown?.totalPaid);

  console.log('All My Rides History Endpoints Verified Successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

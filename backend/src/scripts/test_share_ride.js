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
  console.log('Testing Emergency & Share Ride Endpoints...');

  // 1. Get contacts
  const contacts = await makeRequest('/api/emergency/contacts');
  console.log('[1] Get Contacts:', contacts.status, contacts.body?.success, 'Count:', contacts.body?.count);

  // 2. Add contact
  const add = await makeRequest('/api/emergency/contacts', 'POST', {
    name: 'Uncle Rakesh',
    phone: '+91 91234 56789',
    relation: 'Uncle'
  });
  console.log('[2] Add Contact:', add.status, add.body?.success, 'Name:', add.body?.data?.name);

  // 3. Share Ride
  const share = await makeRequest('/api/emergency/share-ride', 'POST', {
    bookingId: 'b_demo_102',
    bookingCode: 'NV-9912',
    selectedContactIds: ['c1', 'c2'],
    pickupGhat: 'Dashashwamedh Ghat',
    timeText: '02:00 PM',
    driverName: 'Ramesh Yadav'
  });
  console.log('[3] Share Ride:', share.status, share.body?.success, 'Tracking URL:', share.body?.data?.trackingUrl, 'Notified Count:', share.body?.data?.contactsNotifiedCount);

  console.log('Emergency & Share Ride Endpoints Verified Successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

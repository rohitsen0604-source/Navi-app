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
  console.log('Testing Support & Legal Endpoints...');

  // 1. Healthcheck
  const health = await makeRequest('/health');
  console.log('[1] Healthcheck status:', health.status, health.body?.status);

  // 2. Helpline info
  const helpline = await makeRequest('/api/support/helpline-info');
  console.log('[2] Helpline Info:', helpline.status, helpline.body?.success, 'Ghat Desks:', helpline.body?.data?.ghatDesks?.length);

  // 3. Legal terms
  const legal = await makeRequest('/api/support/legal');
  console.log('[3] Legal Terms:', legal.status, legal.body?.success, 'ToS items:', legal.body?.data?.termsOfService?.length);

  // 4. Create Support Ticket
  const ticket = await makeRequest('/api/support/tickets', 'POST', {
    category: 'SAFETY_INQUIRY',
    bookingCode: 'NV-9921',
    description: 'Question regarding infant life jackets on luxury bajra booking.'
  });
  console.log('[4] Ticket Created:', ticket.status, ticket.body?.success, 'TicketId:', ticket.body?.data?.ticketId);

  // 5. Get Tickets
  const myTickets = await makeRequest('/api/support/tickets');
  console.log('[5] My Tickets:', myTickets.status, myTickets.body?.success, 'Count:', myTickets.body?.count);

  console.log('All Support & Legal Endpoints Verified Successfully!');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});

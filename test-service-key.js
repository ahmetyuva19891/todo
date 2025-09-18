const https = require('https');

// Test with service role key (bypasses RLS)
const SUPABASE_IP = '104.18.38.10';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk1MzA2NiwiZXhwIjoyMDczNTI5MDY2fQ.FYxYOeJmFCQol71WlSMBTk5sAhearNpnhFzsLQzOdas';

console.log('🔍 Testing with service role key...');

const options = {
  hostname: SUPABASE_IP,
  port: 443,
  path: '/rest/v1/kv_store_a218721a',
  method: 'GET',
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Host': 'tqfluqzqeuttdkehszbf.supabase.co'
  }
};

const req = https.request(options, (res) => {
  console.log('📡 Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Response data:', data);
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('📋 Parsed data:', JSON.stringify(json, null, 2));
        console.log('📊 Number of records:', json.length);
      } catch (e) {
        console.log('❌ Failed to parse JSON:', e.message);
      }
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err);
});

req.end();

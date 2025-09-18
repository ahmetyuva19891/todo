const https = require('https');

// Check what's actually in the database
const SUPABASE_IP = '104.18.38.10';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMwNjYsImV4cCI6MjA3MzUyOTA2Nn0.bimE2fEb5VI6HMHBHHUzBEhvyv1NgCr80uQsH7lrVdU';

console.log('🔍 Checking database contents...');

// First, let's try to get all data without any filters
const options = {
  hostname: SUPABASE_IP,
  port: 443,
  path: '/rest/v1/kv_store_a218721a',
  method: 'GET',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Host': 'tqfluqzqeuttdkehszbf.supabase.co'
  }
};

console.log('🔗 Fetching all data from:', SUPABASE_IP, '/rest/v1/kv_store_a218721a');

const req = https.request(options, (res) => {
  console.log('📡 Status:', res.statusCode);
  console.log('📡 Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Raw response data:', data);
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('📋 Parsed data:', JSON.stringify(json, null, 2));
        console.log('📊 Number of records:', json.length);
      } catch (e) {
        console.log('❌ Failed to parse JSON:', e.message);
      }
    } else {
      console.log('❌ Request failed with status:', res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err);
});

req.end();

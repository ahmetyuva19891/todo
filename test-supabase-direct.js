const https = require('https');

// Test direct connection to Supabase
const SUPABASE_IP = '104.18.38.10';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMwNjYsImV4cCI6MjA3MzUyOTA2Nn0.bimE2fEb5VI6HMHBHHUzBEhvyv1NgCr80uQsH7lrVdU';

console.log('🧪 Testing direct Supabase connection...');

const options = {
  hostname: SUPABASE_IP,
  port: 443,
  path: '/rest/v1/kv_store_a218721a?select=*',
  method: 'GET',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Host': 'tqfluqzqeuttdkehszbf.supabase.co'
  }
};

console.log('🔗 Connecting to:', SUPABASE_IP, '/rest/v1/kv_store_a218721a');

const req = https.request(options, (res) => {
  console.log('📡 Status:', res.statusCode);
  console.log('📡 Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Response data:', data);
    
    if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
      console.log('❌ Received HTML error page');
    } else {
      console.log('✅ Received JSON response');
      try {
        const json = JSON.parse(data);
        console.log('📋 Parsed data:', json);
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

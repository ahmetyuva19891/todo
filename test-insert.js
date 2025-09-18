const https = require('https');

// Test direct insert to Supabase
const SUPABASE_IP = '104.18.38.10';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMwNjYsImV4cCI6MjA3MzUyOTA2Nn0.bimE2fEb5VI6HMHBHHUzBEhvyv1NgCr80uQsH7lrVdU';

console.log('🧪 Testing direct Supabase insert...');

const testData = {
  key: `test_${Date.now()}`,
  value: {
    id: `test_${Date.now()}`,
    title: 'Direct Test Todo',
    description: 'Testing direct insert from Node.js',
    priority: 'high',
    completed: false,
    createdDate: new Date().toLocaleDateString(),
    createdTime: new Date().toLocaleTimeString()
  }
};

const options = {
  hostname: SUPABASE_IP,
  port: 443,
  path: '/rest/v1/kv_store_a218721a',
  method: 'POST',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
    'Host': 'tqfluqzqeuttdkehszbf.supabase.co'
  }
};

console.log('🔗 Inserting data:', JSON.stringify(testData, null, 2));

const req = https.request(options, (res) => {
  console.log('📡 Status:', res.statusCode);
  console.log('📡 Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Response data:', data);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Successfully inserted data!');
    } else {
      console.log('❌ Insert failed');
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err);
});

req.write(JSON.stringify(testData));
req.end();

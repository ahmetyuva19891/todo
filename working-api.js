const http = require('http');
const https = require('https');

const PORT = 3001;

// Supabase configuration
const SUPABASE_IP = '104.18.38.10';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMwNjYsImV4cCI6MjA3MzUyOTA2Nn0.bimE2fEb5VI6HMHBHHUzBEhvyv1NgCr80uQsH7lrVdU';

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle different endpoints
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      message: 'API server is working!',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.url === '/todos' && req.method === 'GET') {
    console.log('📥 GET /todos - Fetching todos from Supabase...');
    
    // Get todos from Supabase
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

    console.log('🔗 Connecting to Supabase:', SUPABASE_IP, '/rest/v1/kv_store_a218721a');

    const proxyReq = https.request(options, (proxyRes) => {
      console.log('📡 Supabase response status:', proxyRes.statusCode);
      console.log('📡 Supabase response headers:', proxyRes.headers);
      
      let data = '';
      proxyRes.on('data', (chunk) => {
        data += chunk;
      });
      proxyRes.on('end', () => {
        console.log('📦 Supabase response data:', data);
        
        // Check if response is HTML (error page)
        if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
          console.log('❌ Received HTML error page from Supabase');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Supabase server error', 
            message: 'Received HTML instead of JSON',
            status: proxyRes.statusCode 
          }));
        } else {
          console.log('✅ Successfully received JSON from Supabase');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to connect to Supabase' }));
    });

    proxyReq.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/todos') {
    // Save todo to Supabase
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const todo = JSON.parse(body);
        const options = {
          hostname: SUPABASE_IP,
          port: 443,
          path: '/rest/v1/kv_store_a218721a',
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Host': 'tqfluqzqeuttdkehszbf.supabase.co',
            'Prefer': 'return=minimal,resolution=merge-duplicates'
          }
        };

        const postData = JSON.stringify({
          key: `todo_${todo.id}`,
          value: todo
        });

        const proxyReq = https.request(options, (proxyRes) => {
          let data = '';
          proxyRes.on('data', (chunk) => {
            data += chunk;
          });
          proxyRes.on('end', () => {
            if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 300) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Todo saved successfully' }));
            } else {
              res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to save todo', details: data }));
            }
          });
        });

        proxyReq.on('error', (err) => {
          console.error('Proxy error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to save to Supabase' }));
        });

        proxyReq.write(postData);
        proxyReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Default response
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Working API server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
  console.log(`Todos endpoint: http://localhost:${PORT}/todos`);
});

// Simple API server to bypass CORS issues
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

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

  // Proxy requests to Supabase - try different URL formats
  const supabaseUrl = 'https://tqfluqzqeuttdkehszbf.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMwNjYsImV4cCI6MjA3MzUyOTA2Nn0.bimE2fEb5VI6HMHBHHUzBEhvyv1NgCr80uQsH7lrVdU';

  const targetUrl = `${supabaseUrl}${req.url}`;
  const parsedUrl = url.parse(targetUrl);

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.path,
    method: req.method,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500);
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`Simple API server running on http://localhost:${PORT}`);
  console.log(`This will proxy requests to Supabase and bypass CORS issues`);
});

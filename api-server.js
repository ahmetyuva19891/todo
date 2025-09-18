const { Hono } = require('hono');
const { cors } = require('hono/cors');

const app = new Hono();

// CORS configuration for production
app.use('*', cors({
  origin: ['https://your-domain.vercel.app', 'https://your-domain.netlify.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'apikey'],
}));

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tqfluqzqeuttdkehszbf.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmx1cXpxZXV0dGRrZWhzemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMwNjYsImV4cCI6MjA3MzUyOTA2Nn0.bimE2fEb5VI6HMHBHHUzBEhvyv1NgCr80uQsH7lrVdU';

// Health check endpoint
app.get('/test', (c) => {
  return c.json({ message: 'API server is running', timestamp: new Date().toISOString() });
});

// Get all todos
app.get('/todos', async (c) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kv_store_a218721a?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return c.json({ error: 'Failed to fetch todos' }, 500);
  }
});

// Create or update todo
app.post('/todos', async (c) => {
  try {
    const todo = await c.req.json();
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kv_store_a218721a`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal,resolution=merge-duplicates'
      },
      body: JSON.stringify({
        key: todo.id,
        value: todo
      }),
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving todo:', error);
    return c.json({ error: 'Failed to save todo' }, 500);
  }
});

const port = process.env.PORT || 3001;
app.fire({
  port,
  hostname: '0.0.0.0'
});

console.log(`Production API server running on port ${port}`);
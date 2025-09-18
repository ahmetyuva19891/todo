# 🚀 Production Deployment Guide

## Prerequisites
- GitHub account
- Vercel/Netlify account
- Railway/Render account (for API server)

## Step 1: Deploy API Server

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub
4. Select your repository
5. Add environment variables:
   - `SUPABASE_URL`: `https://tqfluqzqeuttdkehszbf.supabase.co`
   - `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
6. Deploy the `api-server.js` file
7. Note the deployed URL (e.g., `https://your-app.railway.app`)

### Option B: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Build command: `npm install`
5. Start command: `node api-server.js`
6. Add environment variables as above

## Step 2: Deploy Frontend

### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework preset: Vite
4. Add environment variables:
   - `VITE_SUPABASE_URL`: `https://tqfluqzqeuttdkehszbf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `VITE_API_URL`: `https://your-api.railway.app` (from step 1)
5. Deploy

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site settings
6. Deploy

## Step 3: Update API URLs

After deployment, update the API URLs in your frontend:

1. Find all instances of `http://localhost:3001` in your code
2. Replace with your production API URL
3. Redeploy

## Step 4: Configure Supabase (Optional)

For better security in production:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Settings
3. Add your production domain to "Site URL"
4. Add your production domain to "Redirect URLs"

## Step 5: Domain Setup (Optional)

### Custom Domain
1. In Vercel/Netlify, go to Domain settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update CORS settings in API server

## Environment Variables Summary

### Frontend (.env.production)
```
VITE_SUPABASE_URL=https://tqfluqzqeuttdkehszbf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://your-api.railway.app
```

### API Server
```
SUPABASE_URL=https://tqfluqzqeuttdkehszbf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3001
```

## Testing Production

1. Visit your deployed frontend URL
2. Test creating todos
3. Test completing todos
4. Check that data persists in Supabase

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS origins in API server
2. **Environment variables not working**: Check variable names start with `VITE_`
3. **API not responding**: Check API server logs
4. **Build failures**: Check Node.js version compatibility

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Supabase: [supabase.com/docs](https://supabase.com/docs)

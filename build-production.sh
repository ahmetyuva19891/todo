#!/bin/bash

echo "🚀 Building for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in the 'dist' directory"
    echo ""
    echo "Next steps:"
    echo "1. Deploy the 'dist' folder to your hosting platform"
    echo "2. Set up your API server on Railway/Render"
    echo "3. Configure environment variables"
    echo "4. Update CORS settings with your production domain"
else
    echo "❌ Build failed!"
    exit 1
fi

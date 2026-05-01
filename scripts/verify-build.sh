#!/bin/bash

# Build verification script for SFD Delivery Tracker

set -e

echo "🔍 Verifying build setup..."

# Check if required files exist
echo "✓ Checking required files..."
required_files=(
  "package.json"
  "vite.config.ts"
  "Dockerfile"
  "docker-compose.yml"
  "nginx.conf"
  "src/app/App.tsx"
  "public/manifest.json"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

echo "✓ All required files present"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "⚠️  node_modules not found. Installing dependencies..."
  pnpm install
fi

echo "✓ Dependencies installed"

# Try to build
echo "🔨 Building application..."
pnpm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "📦 Build output in ./dist"
  
  # Check dist folder
  if [ -d "dist" ]; then
    echo "✓ Dist folder created"
    echo "📊 Build size:"
    du -sh dist
  fi
else
  echo "❌ Build failed"
  exit 1
fi

echo ""
echo "🚀 Ready for Docker build!"
echo "Run: docker-compose up -d --build"

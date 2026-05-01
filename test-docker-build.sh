#!/bin/bash

echo "🔍 Pre-Docker Build Verification"
echo "================================="
echo ""

# Check Dockerfile
if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile exists (file)"
else
    echo "❌ Dockerfile missing or is a directory"
    exit 1
fi

# Check docker-compose
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml exists"
else
    echo "❌ docker-compose.yml missing"
    exit 1
fi

# Check nginx config
if [ -f "nginx.conf" ]; then
    echo "✅ nginx.conf exists"
else
    echo "❌ nginx.conf missing"
    exit 1
fi

# Check package.json
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
    exit 1
fi

# Check source files
if [ -f "src/app/App.tsx" ]; then
    echo "✅ src/app/App.tsx exists"
else
    echo "❌ src/app/App.tsx missing"
    exit 1
fi

echo ""
echo "🎉 All files ready for Docker build!"
echo ""
echo "Run: docker-compose up -d --build"

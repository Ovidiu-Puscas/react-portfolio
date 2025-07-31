#!/bin/bash

# Custom build script for Firebase deployment
# This script ensures the public directory is properly set up

echo "Starting custom build process for Firebase..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "Error: public directory not found!"
    echo "Creating public directory..."
    mkdir -p public
fi

# Check if index.html exists in public
if [ ! -f "public/index.html" ]; then
    echo "Error: index.html not found in public directory!"
    echo "Current directory contents:"
    ls -la
    echo "Public directory contents:"
    ls -la public/ || echo "Public directory is empty or doesn't exist"
    exit 1
fi

echo "Public directory and index.html found. Proceeding with build..."

# Install dependencies
echo "Installing dependencies..."
npm ci --quiet --no-fund --no-audit

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "Error: Build failed - build directory not created!"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo "Error: Build failed - index.html not found in build directory!"
    echo "Build directory contents:"
    ls -la build/
    exit 1
fi

echo "Build completed successfully!"
echo "Build directory contents:"
ls -la build/

echo "Custom build script completed." 
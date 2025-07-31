#!/bin/bash

# Firebase build script for React app
# This script ensures the public directory is properly included

echo "Starting Firebase build process..."

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "Error: public directory not found!"
    exit 1
fi

# Check if index.html exists in public
if [ ! -f "public/index.html" ]; then
    echo "Error: index.html not found in public directory!"
    exit 1
fi

echo "Public directory and index.html found. Proceeding with build..."

# Install dependencies
npm ci --quiet --no-fund --no-audit

# Build the application
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "Error: Build failed - build directory not created!"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo "Error: Build failed - index.html not found in build directory!"
    exit 1
fi

echo "Build completed successfully!"
echo "Build directory contents:"
ls -la build/

echo "Firebase build script completed."

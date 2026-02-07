#!/bin/bash

# ScrollSoul Music Sync Platform - Deployment Script
# This script sets up and deploys the music sync platform

echo "🎵 ScrollSoul Music Sync Platform - Deployment Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 14.x or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo ""
fi

# Start the server
echo "🚀 Starting ScrollSoul Music Sync Platform..."
echo ""
echo "=================================================="
echo "🌌 System Status: OPERATIONAL"
echo "📡 Ready to track placements, licenses, and royalties"
echo "=================================================="
echo ""

npm start

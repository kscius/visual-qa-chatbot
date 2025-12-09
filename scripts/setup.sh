#!/bin/bash

# Visual Q&A Chatbot - Quick Setup Script (Unix/Linux/macOS)
# This script automates the initial setup process

set -e

echo "🖼️  Visual Q&A Chatbot - Setup Script"
echo "======================================"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version must be 18 or higher"
    echo "Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo ""
    echo "Creating .env from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo ""
    echo "📝 IMPORTANT: Edit backend/.env and add your OpenAI API key!"
    echo "   Open backend/.env in your editor and replace:"
    echo "   OPENAI_API_KEY=your_openai_api_key_here"
    echo "   with your actual API key from: https://platform.openai.com/api-keys"
    echo ""
else
    echo "✅ backend/.env file already exists"
    echo ""
fi

echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your OPENAI_API_KEY"
echo "2. Run the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. In a new terminal, run the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "For more information, see README.md"
echo "======================================"


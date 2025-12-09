# Visual Q&A Chatbot - Quick Setup Script (Windows PowerShell)
# This script automates the initial setup process

$ErrorActionPreference = "Stop"

Write-Host "🖼️  Visual Q&A Chatbot - Setup Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "❌ Error: Node.js version must be 18 or higher" -ForegroundColor Red
        Write-Host "Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Check for .env file
if (!(Test-Path "backend\.env")) {
    Write-Host "⚠️  Warning: backend\.env file not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Created backend\.env" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 IMPORTANT: Edit backend\.env and add your OpenAI API key!" -ForegroundColor Cyan
    Write-Host "   Open backend\.env in your editor and replace:" -ForegroundColor Cyan
    Write-Host "   OPENAI_API_KEY=your_openai_api_key_here" -ForegroundColor Cyan
    Write-Host "   with your actual API key from: https://platform.openai.com/api-keys" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ backend\.env file already exists" -ForegroundColor Green
    Write-Host ""
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend\.env and add your OPENAI_API_KEY"
Write-Host "2. Run the backend:"
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. In a new terminal, run the frontend:"
Write-Host "   cd frontend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "4. Open http://localhost:5173 in your browser"
Write-Host ""
Write-Host "For more information, see README.md"
Write-Host "======================================" -ForegroundColor Cyan


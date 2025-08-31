Write-Host "🚀 Setting up Highway Delite - Full-Stack Note-Taking App" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
Set-Location ..

# Create environment files
Write-Host "🔧 Creating environment files..." -ForegroundColor Yellow

# Frontend .env
if (-not (Test-Path ".env")) {
    @"
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Created frontend .env file" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend .env file already exists" -ForegroundColor Yellow
}

# Backend .env
if (-not (Test-Path "server\.env")) {
    @"
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/highway-delite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OTP Configuration
OTP_EXP_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Google OAuth (optional for development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URL=http://localhost:5000/api/auth/google/callback

# CORS
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath "server\.env" -Encoding UTF8
    Write-Host "✅ Created backend .env file" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env file already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure your environment variables in .env files" -ForegroundColor White
Write-Host "2. Start MongoDB (local or Atlas)" -ForegroundColor White
Write-Host "3. Run the application:" -ForegroundColor White
Write-Host "   - Option 1: npm run dev:full (both frontend and backend)" -ForegroundColor White
Write-Host "   - Option 2: Separate terminals for frontend (npm run dev) and backend (cd server; npm run dev)" -ForegroundColor White
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Health check: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Check README.md for detailed documentation" -ForegroundColor Cyan

Read-Host "Press Enter to continue"

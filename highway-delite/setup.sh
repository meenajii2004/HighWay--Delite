#!/bin/bash

echo "🚀 Setting up Highway Delite - Full-Stack Note-Taking App"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Create environment files
echo "🔧 Creating environment files..."

# Frontend .env
if [ ! -f .env ]; then
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF
    echo "✅ Created frontend .env file"
else
    echo "⚠️  Frontend .env file already exists"
fi

# Backend .env
if [ ! -f server/.env ]; then
    cat > server/.env << EOF
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
EOF
    echo "✅ Created backend .env file"
else
    echo "⚠️  Backend .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in .env files"
echo "2. Start MongoDB (local or Atlas)"
echo "3. Run the application:"
echo "   - Option 1: npm run dev:full (both frontend and backend)"
echo "   - Option 2: Separate terminals for frontend (npm run dev) and backend (cd server && npm run dev)"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000/api"
echo "Health check: http://localhost:5000/api/health"
echo ""
echo "📚 Check README.md for detailed documentation"

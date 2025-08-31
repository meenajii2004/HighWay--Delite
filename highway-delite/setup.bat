@echo off
echo 🚀 Setting up Highway Delite - Full-Stack Note-Taking App
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
cd ..

REM Create environment files
echo 🔧 Creating environment files...

REM Frontend .env
if not exist .env (
    echo VITE_API_BASE_URL=http://localhost:5000/api > .env
    echo VITE_GOOGLE_CLIENT_ID=your-google-client-id >> .env
    echo ✅ Created frontend .env file
) else (
    echo ⚠️  Frontend .env file already exists
)

REM Backend .env
if not exist server\.env (
    echo # Server Configuration > server\.env
    echo PORT=5000 >> server\.env
    echo NODE_ENV=development >> server\.env
    echo. >> server\.env
    echo # Database >> server\.env
    echo DATABASE_URL=mongodb://localhost:27017/highway-delite >> server\.env
    echo. >> server\.env
    echo # JWT Configuration >> server\.env
    echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> server\.env
    echo JWT_EXPIRES_IN=7d >> server\.env
    echo. >> server\.env
    echo # OTP Configuration >> server\.env
    echo OTP_EXP_MINUTES=10 >> server\.env
    echo OTP_MAX_ATTEMPTS=5 >> server\.env
    echo. >> server\.env
    echo # Google OAuth (optional for development) >> server\.env
    echo GOOGLE_CLIENT_ID=your-google-client-id >> server\.env
    echo GOOGLE_CLIENT_SECRET=your-google-client-secret >> server\.env
    echo OAUTH_REDIRECT_URL=http://localhost:5000/api/auth/google/callback >> server\.env
    echo. >> server\.env
    echo # CORS >> server\.env
    echo CORS_ORIGIN=http://localhost:5173 >> server\.env
    echo ✅ Created backend .env file
) else (
    echo ⚠️  Backend .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Configure your environment variables in .env files
echo 2. Start MongoDB (local or Atlas)
echo 3. Run the application:
echo    - Option 1: npm run dev:full (both frontend and backend)
echo    - Option 2: Separate terminals for frontend (npm run dev) and backend (cd server ^&^& npm run dev)
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
echo Health check: http://localhost:5000/api/health
echo.
echo 📚 Check README.md for detailed documentation
pause

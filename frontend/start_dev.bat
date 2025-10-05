@echo off
REM Start frontend development server
echo 🔮 Starting Prism Frontend Development Server...

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start development server
echo 🚀 Starting Vite development server...
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔗 API proxy configured for: http://localhost:8000
npm run dev

pause
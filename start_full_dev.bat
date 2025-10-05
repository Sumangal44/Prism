@echo off
REM Complete Prism Application Startup Script
echo 🔮 Starting Complete Prism Application...
echo.

REM Navigate to project root
cd /d "%~dp0"

echo 📋 Prism Development Environment Setup
echo =====================================
echo.
echo 🔧 Backend: FastAPI with Mistral 7B LLM
echo 🎨 Frontend: React + Vite + Tailwind CSS
echo 🔗 API Proxy: http://localhost:3000 → http://localhost:8000
echo.

REM Start backend in a new window
echo 🚀 Starting Backend Server...
start "Prism Backend" cmd /k "cd backend && start_dev.bat"

REM Wait a moment for backend to initialize
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

REM Start frontend in a new window
echo 🎨 Starting Frontend Development Server...
start "Prism Frontend" cmd /k "cd frontend && start_dev.bat"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📍 Access Points:
echo   🌐 Frontend: http://localhost:3000
echo   🔧 Backend API: http://localhost:8000
echo   📖 API Docs: http://localhost:8000/docs
echo.
echo 💡 Tip: Both servers will auto-reload on code changes
echo.
echo Press any key to exit (this will not stop the servers)
pause > nul
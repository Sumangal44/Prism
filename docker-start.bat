@echo off
echo Starting Prism in Docker Production Mode...

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not running or not installed. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down

REM Build and start services
echo Building and starting services...
docker-compose up --build -d

REM Wait for services to be healthy
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check service health
docker-compose ps

echo.
echo ====================================
echo Prism is starting up!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo ====================================
echo.
echo Press Ctrl+C to stop or close this window
echo Monitoring logs (Ctrl+C to exit logs, services will continue running)...

REM Follow logs
docker-compose logs -f
@echo off
echo Starting Prism in Docker Development Mode...

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not running or not installed. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Stop any existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.dev.yml down

REM Build and start development services
echo Building and starting development services...
docker-compose -f docker-compose.dev.yml up --build

echo Development server stopped.
pause
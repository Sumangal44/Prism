#!/bin/bash

echo "Starting Prism in Docker Production Mode..."

# Check if Docker is running
if ! docker --version > /dev/null 2>&1; then
    echo "Docker is not running or not installed. Please start Docker."
    exit 1
fi

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check service health
docker-compose ps

echo ""
echo "===================================="
echo "Prism is starting up!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "===================================="
echo ""
echo "Press Ctrl+C to stop or close this terminal"
echo "Monitoring logs (Ctrl+C to exit logs, services will continue running)..."

# Follow logs
docker-compose logs -f
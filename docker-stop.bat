@echo off
echo Stopping Prism Docker containers...

REM Stop and remove containers
docker-compose down

REM Optional: Remove images (uncomment if you want to clean up images)
REM docker-compose down --rmi all

REM Optional: Remove volumes (uncomment if you want to clean up data)
REM docker-compose down -v

echo Prism containers stopped.
pause
# 🐳 Prism Docker Deployment

This guide covers running the complete Prism multimodal RAG system in Docker for fast, consistent deployment.

## 🚀 Quick Start

### Production Mode (Recommended for fast response)
```bash
# Windows
.\docker-start.bat

# Linux/macOS
chmod +x docker-start.sh
./docker-start.sh
```

### Development Mode (Live reload)
```bash
# Windows
.\docker-dev.bat

# Linux/macOS
docker-compose -f docker-compose.dev.yml up --build
```

## 📋 Prerequisites

- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- At least 4GB RAM available for containers
- Ports 3000 and 8000 available

## 🏗️ Architecture

### Services
- **Frontend**: React app served by optimized Nginx (Port 3000)
- **Backend**: FastAPI server with Mistral 7B LLM (Port 8000)

### Optimizations for Speed
- Multi-stage Docker builds for minimal image sizes
- Nginx with gzip compression and static file caching
- Health checks for faster startup detection
- Proper resource limits and reservations
- Dedicated Docker network for service communication

## 📁 Volume Mounts

| Volume | Purpose | Type |
|--------|---------|------|
| `./data` | Document storage and processing | Host mount |
| `./models` | LLM model files | Host mount (read-only) |
| `backend_cache` | Python package cache | Named volume |

## 🔧 Configuration Files

### Production
- `docker-compose.yml` - Main production configuration
- `docker-start.bat` / `docker-start.sh` - Production startup scripts
- `docker-stop.bat` - Cleanup script

### Development
- `docker-compose.dev.yml` - Development with live reload
- `docker-dev.bat` - Development startup script

## 🎯 Performance Features

### Backend Optimizations
- Multi-stage build with dependency caching
- Non-root user for security
- Optimized Python settings (`PYTHONUNBUFFERED`, etc.)
- Health checks on `/health` endpoint
- Resource limits (2GB memory limit, 1GB reserved)

### Frontend Optimizations
- Multi-stage build: Node build → Nginx serve
- Static file caching (1 year for assets)
- Gzip compression for all text content
- Security headers included
- Resource limits (512MB memory limit)

### Nginx Performance
- Worker connections: 2048
- Keep-alive optimization
- Buffer size tuning
- Proxy optimizations for API calls

## 🔍 Monitoring

### Health Checks
- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000/health`

### Service Status
```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🛠️ Development Workflow

### Starting Development Environment
```bash
# Windows
.\docker-dev.bat

# Manual start
docker-compose -f docker-compose.dev.yml up --build
```

### Key Differences in Dev Mode
- Source code mounted for live reload
- Vite dev server for frontend (port 5173 → 3000)
- Backend auto-reload enabled
- No production optimizations

### Making Changes
1. Edit files in `./frontend/src/` or `./backend/`
2. Changes auto-reload in development mode
3. For production testing: restart with `.\docker-start.bat`

## 📊 Resource Usage

### Minimum Requirements
- CPU: 2 cores
- Memory: 4GB total
  - Backend: 1-2GB (LLM model loading)
  - Frontend: 256-512MB
- Storage: 2GB+ (for models and data)

### Recommended Specs
- CPU: 4+ cores
- Memory: 8GB+ total
- SSD storage for better I/O performance

## 🔐 Security Features

- Non-root container users
- Security headers in Nginx
- Network isolation with custom bridge
- Read-only model volume mount
- Resource limits to prevent DoS

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Stop existing containers
docker-compose down
```

**Out of memory:**
```bash
# Check resource usage
docker stats

# Adjust memory limits in docker-compose.yml
# Restart Docker Desktop if needed
```

**Model not found:**
```bash
# Ensure Mistral model is in ./models/llm/
ls -la models/llm/mistral-7b-instruct-v0.2.Q4_K_M.gguf

# Re-download if missing (see SETUP_QA.md)
```

**Slow startup:**
```bash
# Check logs for startup progress
docker-compose logs -f backend

# Backend needs time to load LLM model (~30-60s)
```

### Performance Troubleshooting

**Slow API responses:**
- Check backend logs: `docker-compose logs backend`
- Monitor resource usage: `docker stats`
- Ensure SSD storage for model files
- Verify adequate RAM for LLM

**Frontend not loading:**
- Check nginx logs: `docker-compose logs frontend`
- Verify backend health: `curl http://localhost:8000/health`
- Check network connectivity between services

## 📈 Production Deployment

### Environment Variables
```bash
# Backend optimization
UVICORN_WORKERS=1
UVICORN_LOOP=asyncio
PYTHONUNBUFFERED=1

# Frontend optimization  
NODE_ENV=production
VITE_API_URL=http://backend:8000
```

### Scaling Considerations
- Single worker recommended for LLM to avoid memory conflicts
- Nginx handles multiple concurrent frontend requests
- Consider load balancer for multiple backend instances

### Monitoring in Production
- Health check endpoints for uptime monitoring
- Log aggregation for debugging
- Resource monitoring for scaling decisions

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Stop current containers
docker-compose down

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up --build -d
```

### Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data (careful!)
docker system prune -a
```

## 📞 Support

For issues with the Docker setup:
1. Check the troubleshooting section above
2. Review logs: `docker-compose logs -f`
3. Ensure system requirements are met
4. Verify model files are present in `./models/llm/`

---

**Ready to start?** Run `.\docker-start.bat` and access Prism at http://localhost:3000! 🚀
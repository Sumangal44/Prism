# Multi-stage build for optimized production backend
FROM python:3.12-slim as base

# Set environment variables for Python optimization
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

# Build stage for dependencies
FROM base as builder

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --user --no-warn-script-location -r requirements.txt

# Production stage
FROM base as production

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Ensure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p data/uploads data/processed data/indices models/llm && \
    chmod -R 755 data/

# Set Python path
ENV PYTHONPATH=/app

# Create non-root user for security
RUN groupadd -r app && useradd -r -g app app && \
    chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check with faster intervals for development
HEALTHCHECK --interval=15s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run with optimizations for faster startup and response
CMD ["python", "-m", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "1", \
     "--loop", "asyncio", \
     "--access-log", \
     "--reload"]
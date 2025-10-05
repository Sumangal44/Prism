# Multi-stage build for optimized frontend
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Install pnpm for faster package management
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* package-lock.json* bun.lock* ./

# Install dependencies with optimizations
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# Build the application with optimizations
FROM base as builder
RUN npm run build

# Production stage with optimized nginx
FROM nginx:alpine as production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx cache directory
RUN mkdir -p /var/cache/nginx/client_temp

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start nginx with optimized settings
CMD ["nginx", "-g", "daemon off;"]
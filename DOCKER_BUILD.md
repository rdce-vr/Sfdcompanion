# Docker Build Instructions

## Prerequisites
- Docker installed and running
- Docker Compose (optional, but recommended)

## Building the Application

### Method 1: Docker Compose (Recommended)
```bash
# Build and start the container
docker-compose up -d --build

# The app will be available at http://localhost:3000
```

### Method 2: Docker CLI
```bash
# Build the image
docker build -t sfd-delivery-tracker .

# Run the container
docker run -d \
  -p 3000:80 \
  --name sfd-tracker \
  --restart unless-stopped \
  sfd-delivery-tracker
```

## Production Deployment

### Environment Variables
No environment variables required. The app runs entirely client-side with localStorage.

### Port Configuration
The default port is 3000 (mapped to container port 80). To change:

**Docker Compose:**
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 3000 to your desired port
```

**Docker CLI:**
```bash
docker run -d -p 8080:80 --name sfd-tracker sfd-delivery-tracker
```

### Resource Limits
Add resource limits for production:

**Docker Compose:**
```yaml
services:
  sfd-tracker:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

**Docker CLI:**
```bash
docker run -d \
  -p 3000:80 \
  --cpus="0.5" \
  --memory="256m" \
  --name sfd-tracker \
  sfd-delivery-tracker
```

## Build Optimization

The Dockerfile uses multi-stage builds:
1. **Builder stage**: Installs dependencies and builds the app
2. **Production stage**: Serves static files with Nginx

This results in a minimal final image size.

## Troubleshooting

### Build fails during pnpm install
```bash
# Clear Docker build cache
docker builder prune -a

# Rebuild
docker-compose up -d --build --force-recreate
```

### Container won't start
```bash
# Check logs
docker-compose logs -f

# Or for Docker CLI
docker logs sfd-tracker
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change the port in docker-compose.yml
```

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or with Docker CLI
docker stop sfd-tracker
docker rm sfd-tracker
docker build -t sfd-delivery-tracker .
docker run -d -p 3000:80 --name sfd-tracker sfd-delivery-tracker
```

## Health Check

Access `http://localhost:3000` in your browser. The app should load immediately.

## Data Persistence

All data is stored in browser localStorage. No database or volume mounts required.

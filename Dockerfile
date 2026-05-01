# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json only
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy rest of source
COPY . .

# Build
RUN pnpm build

# Production stage
FROM nginx:alpine

# Install tzdata for timezone support
RUN apk add --no-cache tzdata

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp

# Set correct permissions
RUN chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Use non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

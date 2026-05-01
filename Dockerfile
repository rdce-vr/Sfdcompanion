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

# Install tzdata
RUN apk add --no-cache tzdata

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
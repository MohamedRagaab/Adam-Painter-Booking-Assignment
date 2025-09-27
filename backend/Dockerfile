# Multi-stage Dockerfile for production optimization
FROM node:22-alpine AS development

# Install required packages for crypto module
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the application in development mode
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:22-alpine AS production

# Install required packages for crypto module
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from development stage
COPY --from=development --chown=nestjs:nodejs /app/dist ./dist

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["node", "dist/main.js"]


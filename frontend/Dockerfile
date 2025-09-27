# Multi-stage Dockerfile for frontend
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001

# Copy built application
COPY --from=development /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Change ownership
RUN chown -R reactuser:nodejs /usr/share/nginx/html
RUN chown -R reactuser:nodejs /var/cache/nginx
RUN chown -R reactuser:nodejs /var/log/nginx
RUN chown -R reactuser:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R reactuser:nodejs /var/run/nginx.pid

# Switch to non-root user
USER reactuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodeuser:nodejs package*.json ./
COPY --chown=nodeuser:nodejs server.js ./
COPY --chown=nodeuser:nodejs public/ ./public/

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http=require('http');http.get('http://localhost:3000/health',(r)=>{r.statusCode===200?process.exit(0):process.exit(1)}).on('error',()=>process.exit(1))"

# Use dumb-init and start server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
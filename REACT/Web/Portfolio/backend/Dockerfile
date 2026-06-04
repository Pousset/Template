# # Stage 1: Build
# FROM node:22-alpine AS builder

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy source code
# COPY . .

# # Generate Prisma client (when Prisma is configured)
# # RUN npx prisma generate

# # Build the application
# RUN npm run build

# # Stage 2: Production
# FROM node:22-alpine AS production

# WORKDIR /app

# # Create non-root user for security
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nestjs -u 1001

# # Copy package files
# COPY package*.json ./

# # Install production dependencies only
# RUN npm ci --only=production && npm cache clean --force

# # Copy built application from builder
# COPY --from=builder /app/dist ./dist

# # Copy Prisma schema (when Prisma is configured)
# # COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# # COPY --from=builder /app/prisma ./prisma

# # Change ownership to non-root user
# RUN chown -R nestjs:nodejs /app

# # Switch to non-root user
# USER nestjs

# # Expose port
# EXPOSE 3000

# # Start the application
# CMD ["node", "dist/main"]

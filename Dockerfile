# Dockerfile for Next.js 16 with standalone output
# Multi-stage build for optimal image size

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy env for build-time (untuk env lain yang dibutuhkan)
COPY .env.production .env

# ✅ TAMBAHKAN: Override NEXT_PUBLIC_API_URL secara explicit
ARG NEXT_PUBLIC_API_URL=https://www.seraphic.id/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# 🔍 DEBUG: Print semua NEXT_PUBLIC env
RUN echo "=== Environment Check ===" && \
    cat .env | grep NEXT_PUBLIC || echo "No NEXT_PUBLIC in .env" && \
    echo "NEXT_PUBLIC_API_URL from ENV: ${NEXT_PUBLIC_API_URL}"

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
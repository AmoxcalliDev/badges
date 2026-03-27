# check=skip=SecretsUsedInArgOrEnv

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --frozen --prefer-offline --no-audit --no-fund --fetch-retries=5 --fetch-retry-factor=2

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

FROM node:22-alpine AS runner

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app

LABEL org.opencontainers.image.title="Badges" \
    org.opencontainers.image.description="Platform to generate badges to personalize your profiles and projects." \
    org.opencontainers.image.authors="AmoxcalliDev <contact@amoxcalli.dev>" \
    org.opencontainers.image.version="1.0.0" \
    org.opencontainers.image.url="https://github.com/AmoxcalliDev/badges" \
    org.opencontainers.image.vendor="AmoxcalliDev" \
    org.opencontainers.image.licenses="AGPL-3.0" \
    dev.amoxcalli.badges.environment="production" \
    dev.amoxcalli.badges.stack="Next.js" \
    dev.amoxcalli.badges.node-version="25" \
    dev.amoxcalli.badges.maintainer="AmoxcalliDev" \
    dev.amoxcalli.badges.base-image="node:25-alpine"

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "npm run db:deploy && npm run start"]
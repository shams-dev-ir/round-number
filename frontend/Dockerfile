# syntax=docker/dockerfile:1

# Matches the shape of the other frontends on the target server: the app
# listens on 3000 inside the container, publishes no host port, and is reached
# by container name over the shared `proxy` network.

# ---------------------------------------------------------------- deps ----
FROM node:22-alpine AS deps
# Alpine ships musl; some native postinstall steps expect glibc symbols.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --------------------------------------------------------------- build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next/font downloads and self-hosts Estedad/Sora during the build, so this
# stage needs network access.
RUN npm run build

# -------------------------------------------------------------- runner ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

# `output: "standalone"` leaves out public/ and .next/static on purpose,
# assuming a CDN serves them. There is no CDN here, so fold them back in and
# let the bundled server.js serve them.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Lets `docker ps` and compose report real health instead of just "running".
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]

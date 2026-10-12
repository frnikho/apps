# syntax=docker/dockerfile:1.7

ARG BUN_VERSION=1.4.3

FROM oven/bun:${BUN_VERSION}-slim AS base
WORKDIR /usr/src/app

# Dépendances seules : cette couche ne se reconstruit que si le lockfile change.
FROM base AS deps
COPY package.json bun.lock ./
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM deps AS builder
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM oven/bun:${BUN_VERSION}-slim AS final

ARG APP_VERSION=0.0.0-dev
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown

LABEL org.opencontainers.image.title="apps" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}"

RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    APP_VERSION=${APP_VERSION}

# Nitro embarque ses dépendances dans .output : pas de node_modules en runtime.
COPY --from=builder --chown=bun:bun /usr/src/app/.output ./

USER bun
EXPOSE 3000

ENTRYPOINT ["bun", "run", "/app/server/index.mjs"]

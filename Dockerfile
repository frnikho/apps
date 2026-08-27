ARG BUN_VERSION=1.4.0

FROM oven/bun:${BUN_VERSION}-slim AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM oven/bun:${BUN_VERSION}-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run generate-routes && bun run build

FROM oven/bun:${BUN_VERSION}-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV HOST=app.nikho.dev

COPY --from=build /app/.output ./.output

RUN mkdir -p /app/.data/tree
VOLUME ["/app/.data"]

EXPOSE 3000

USER bun

CMD ["bun", "./.output/server/index.mjs"]

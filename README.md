<p align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Bun-Dark.svg" width="72" height="72" alt="garden" />
</p>

<h1 align="center">🌱 garden</h1>

<p align="center">
  <em>My playground</em><br/>
  one repo, many ideas. ship fast, iterate faster.
</p>

<p align="center">
  <a href="https://app.nikho.dev"><img src="https://img.shields.io/badge/live-app.nikho.dev-10b981?style=for-the-badge&logo=vercel&logoColor=white" alt="live" /></a>
  <a href="https://github.com/frnikho/garden/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/frnikho/garden/build.yml?branch=main&label=build&style=for-the-badge&logo=github" alt="build" /></a>
  <a href="https://github.com/frnikho/garden/actions/workflows/release.yml"><img src="https://img.shields.io/github/actions/workflow/status/frnikho/garden/release.yml?branch=main&label=release&style=for-the-badge&logo=semanticrelease" alt="release" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Bun-1.4.0-black?style=flat-square&logo=bun" alt="bun" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="ts" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="react" />
  <img src="https://img.shields.io/badge/TanStack-Start_&_Router-ff4154?style=flat-square" alt="tanstack" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06b6d4?style=flat-square&logo=tailwindcss" alt="tailwind" />
  <img src="https://img.shields.io/badge/Valibot-1.4-ec4899?style=flat-square" alt="valibot" />
  <img src="https://img.shields.io/badge/Biome-checked-60a5fa?style=flat-square" alt="biome" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" alt="mit" />
</p>

> No monorepo ceremony. Each app lives under its own route, shares the same stack, and evolves independently - just one garden where things grow.

---

### ✨ apps

| app | route | what it does |
|-----|-------|--------------|
| **🌳 Tree** | [`/tree`](https://app.nikho.dev/tree) | Visualize & share any folder's `tree`. Customize the look, copy the pretty output, or share via a compressed URL hash - **zero server storage**. Comes with a shell helper: `curl -s https://app.nikho.dev/sh/tree.sh \| bash -- --open` |
| *more sprouting...* | - | - |

---

### 🧱 stack

| layer | tech |
|-------|------|
| **framework** | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) - SSR, file-based routes |
| **ui** | React 19 · [Tailwind 4](https://tailwindcss.com) |
| **server** | [Nitro](https://nitro.build) via `nitro/vite` |
| **state** | [TanStack Query](https://tanstack.com/query) · [nuqs](https://nuqs.47ng.com) (URL-synced, schema-validated) |
| **i18n** | [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) - `en` / `de` |
| **validation** | [Valibot](https://valibot.dev) + [`@t3-oss/env-core`](https://env.t3.gg) (runtime env, not build-time) |
| **tooling** | Vite 8 · TypeScript 7 · [Biome](https://biomejs.dev) · Bun · semantic-release · Docker |

---

### 🚀 quick start

**prereqs:** [Bun](https://bun.sh) (or Node 22+)

```bash
# install
bun install

# dev - http://localhost:3000
bun run dev

# quality
bun run check-types  # tsc --noEmit
bun run check        # biome

# build
bun run build
bun run preview
```

Env is runtime, not build-time - see `src/env.ts` (`HOST` → `http://localhost:3000` in dev, `https://app.nikho.dev` in prod via `getBaseUrl()`).

```bash
# .env
HOST=localhost:3000
# .env.prod
HOST=app.nikho.dev
```

---

### 🗂️ project structure

```
garden/
├── src/
│   ├── routes/        # file-based - one app per route
│   │   ├── tree/      # → /tree
│   │   └── s/         # → /s/:id (short links, 24h TTL)
│   ├── components/    # shared + app/components/<app>/
│   ├── hooks/         # useTreeHash, …
│   ├── lib/           # compress, parsers, schemas, theme, config
│   ├── paraglide/     # generated - do not edit
│   └── styles.css
├── server/
│   └── utils/         # Nitro server utils (treeStore)
├── public/
│   └── sh/            # shell helpers - source of truth, injected with HOST at serve time
├── messages/          # i18n source (en.json, de.json)
└── vite.config.ts     # + tree.sh dev middleware
```

### ➕ add a new app

```tsx
// src/routes/my-app/index.tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/my-app/")({
  component: MyApp,
})

function MyApp() {
  return <div>Hello, garden.</div>
}
```

Then `bun run generate-routes` (or just let dev pick it up). Colocate components under `src/components/my-app/`.

---

### 🐳 deploy

Built for containers - Dokploy-ready.

```bash
docker compose up --build
# or
docker build -t garden . && docker run -p 3000:3000 -e HOST=app.nikho.dev garden
```

`HOST` is injected at **runtime** (Docker entrypoint patches `public/sh/tree.sh` + `getBaseUrl()` reads `process.env.HOST` per-request). No rebuild to change domain.

CI/CD: GitHub Actions → `semantic-release` (conventional commits → changelog + GHCR `ghcr.io/frnikho/garden:latest`) → Dokploy webhook (`DEPLOY_WEBHOOK_URL` secret).

---

### 📜 license

MIT - do what you want. PRs welcome.

<p align="center">
  <sub>built by <a href="https://github.com/frnikho">nikho</a> · <a href="https://app.nikho.dev">app.nikho.dev</a></sub>
</p>

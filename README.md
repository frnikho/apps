# Apps

> My playground - a collection of small apps, experiments, and tools I build for fun.

This repo is where I ship ideas fast. Each app lives under its own route, shares the same stack, and evolves independently. No monorepo ceremony, just one garden where things grow.

---

## Apps

| App | Route | Description |
|-----|-------|-------------|
| **Tree** | [`/tree`](https://app.nikho.dev/tree) | Visualize and share directory structures. Paste or generate a tree, customize the theme, and share via a compressed URL hash - zero server storage. Includes a shell helper: `curl -s https://app.nikho.dev/sh/tree.sh \| bash -- --open` |

More apps coming as they sprout.

---

## Stack

- **Framework** - [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (SSR + file-based routing)
- **UI** - React 19, [Tailwind CSS 4](https://tailwindcss.com)
- **Server** - [Nitro](https://nitro.build) (via `nitro/vite`)
- **State & Data** - [TanStack Query](https://tanstack.com/query), [nuqs](https://nuqs.47ng.com) (URL-synced state)
- **i18n** - [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (`en` / `de`)
- **Validation** - [Valibot](https://valibot.dev)
- **Tooling** - Vite 8, TypeScript 7, [Biome](https://biomejs.dev) (format + lint), Bun

---

## Getting Started

**Prerequisites:** [Bun](https://bun.sh) (or Node 22+)

```bash
# Install
bun install

# Dev server - http://localhost:3000
bun run dev

# Type check
bun run check-types

# Lint & format
bun run check

# Build
bun run build
bun run preview
```

## Project Structure

```
garden/
├── src/
│   ├── routes/        # File-based routes (one app per route)
│   │   ├── tree/      # → /tree
│   │   └── s/         # → /s/:id (short links)
│   ├── components/    # Shared + app-specific components
│   ├── hooks/         # Reusable hooks
│   ├── lib/           # Utilities, parsers, themes
│   ├── paraglide/     # Generated i18n (do not edit manually)
│   └── styles.css     # Global styles (Tailwind)
├── server/
│   └── routes/        # Nitro API routes
├── public/
│   └── sh/            # Shell helpers (e.g. tree.sh)
├── messages/          # i18n source strings (en.json, de.json)
├── project.inlang/    # Paraglide / Inlang config
└── vite.config.ts
```

## Adding a New App

1. Create a route under `src/routes/<my-app>/index.tsx`:
   ```tsx
   import { createFileRoute } from "@tanstack/react-router"

   export const Route = createFileRoute("/my-app/")({
     component: MyApp,
   })

   function MyApp() {
     return <div>Hello, garden.</div>
   }
   ```
2. Run `bun run generate-routes` if needed (or let the dev server pick it up).
3. Add shared components under `src/components/` or colocate under `src/components/<my-app>/`.

## Deployment

Built for container deployment:

```bash
docker compose up --build
# or
docker build -t garden . && docker run -p 3000:3000 garden
```

CI/CD via GitHub Actions + [semantic-release](https://semantic-release.gitbook.io) (conventional commits → automated versioning and changelog).

## License

MIT - do what you want

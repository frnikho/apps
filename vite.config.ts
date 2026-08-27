import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

function treeShDevPlugin() {
  return {
    name: 'tree-sh-dev',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/sh/tree.sh')) return next()
        let raw = (process.env.HOST || 'localhost:3000').trim()
        if (raw === '0.0.0.0' || raw === '0.0.0.0:3000') raw = (process.env.APP_HOST || 'localhost:3000').trim()
        const baseUrl = raw.startsWith('http://') || raw.startsWith('https://')
          ? raw.replace(/\/$/, '')
          : `${raw.startsWith('localhost') || raw.startsWith('127.0.0.1') ? 'http' : 'https'}://${raw.replace(/\/$/, '')}`
        const script = `#!/bin/bash
set -euo pipefail
TARGET="\${1:-.}"
DEPTH="\${2:-5}"
BASE_URL="\${BASE_URL:-${baseUrl}}"
gen_tree() { local target="\$1" depth="\$2"; if command -v tree &>/dev/null; then tree -a --charset ascii -L "\$depth" --dirsfirst "\$target" 2>/dev/null | sed 's/\\x1b\\[[0-9;]*m//g' || find_fallback "\$target" "\$depth"; else find_fallback "\$target" "\$depth"; fi; }
find_fallback() { local target="\$1" depth="\$2"; find "\$target" -maxdepth "\$depth" -not -path '*/\\.*' -print 2>/dev/null | sort | python3 -c "import sys; lines=[l.rstrip('\\n') for l in sys.stdin]; [print('  '*max(0,l.count('/')-1)+l.split('/')[-1]) for l in lines]"; }
RAW=$(gen_tree "\$TARGET" "\$DEPTH"); if [ -z "\$RAW" ]; then echo "(!) no output for \$TARGET" >&2; exit 1; fi
B64=$(printf "%s" "\$RAW" | python3 -c "import sys, base64, zlib; data = sys.stdin.read().encode('utf-8'); compressed = zlib.compress(data, level=9); b64 = base64.urlsafe_b64encode(compressed).decode('ascii').rstrip('='); print(b64)")
URL="\${BASE_URL}/tree#\${B64}"; LEN=\${#URL}; echo "🌳  tree: \$TARGET (depth \$DEPTH)"; echo "🔗  \$URL"; echo "   (\${LEN} chars, hash privé — rien n'est envoyé au serveur)"; if [ "\$LEN" -gt 1800 ]; then echo ""; echo "   ⚠️  URL longue (>1800). Ouvre le lien puis clique 'Générer lien court (24h)' pour partager."; fi
if [[ "\${*:-}" == *"--open"* ]] && command -v xdg-open &>/dev/null; then xdg-open "\$URL" &>/dev/null & elif [[ "\${*:-}" == *"--open"* ]] && command -v open &>/dev/null; then open "\$URL" &>/dev/null & fi
`
        res.setHeader('content-type', 'text/x-shellscript; charset=utf-8')
        res.setHeader('cache-control', 'no-store')
        res.end(script)
      })
    },
  }
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    treeShDevPlugin(),
    devtools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['url', 'baseLocale'],
    }),
    nitro({ serverDir: "server", rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config

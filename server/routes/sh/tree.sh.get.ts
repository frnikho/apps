import { defineEventHandler, setHeader } from "h3";
import { getBaseUrl } from "@lib/config";
export default defineEventHandler((event) => {
  console.log('[tree.sh] HOST=', process.env.HOST, 'APP_HOST=', process.env.APP_HOST, 'NITRO_HOST=', process.env.NITRO_HOST)
  const baseUrl = getBaseUrl();

  // Script bash avec HOST injecté au runtime (pas buildtime)
  const script = `#!/bin/bash
set -euo pipefail

TARGET="\${1:-.}"
DEPTH="\${2:-5}"
# HOST injecté côté serveur au runtime via t3env (prioritaire sur BASE_URL env local)
BASE_URL="\${BASE_URL:-${baseUrl}}"

gen_tree() {
  local target="\$1" depth="\$2"
  if command -v tree &>/dev/null; then
    tree -a --charset ascii -L "\$depth" --dirsfirst "\$target" 2>/dev/null \\
      | sed 's/\\x1b\\[[0-9;]*m//g' \\
      || find_fallback "\$target" "\$depth"
  else
    find_fallback "\$target" "\$depth"
  fi
}

find_fallback() {
  local target="\$1" depth="\$2"
  find "\$target" -maxdepth "\$depth" -not -path '*/\\.*' -print 2>/dev/null | sort | python3 -c "
import sys
lines=[l.rstrip('\\n') for l in sys.stdin]
for l in lines:
    depth=l.count('/')
    name=l.split('/')[-1] or l
    print('  '*max(0,depth-1)+name)
"
}

RAW=$(gen_tree "\$TARGET" "\$DEPTH")
if [ -z "\$RAW" ]; then
  echo "(!) no output for \$TARGET" >&2
  exit 1
fi

B64=$(printf "%s" "\$RAW" | python3 -c "
import sys, base64, zlib
data = sys.stdin.read().encode('utf-8')
compressed = zlib.compress(data, level=9)
b64 = base64.urlsafe_b64encode(compressed).decode('ascii').rstrip('=')
print(b64)
")

URL="\${BASE_URL}/tree#\${B64}"
LEN=\${#URL}

echo "🌳  tree: \$TARGET (depth \$DEPTH)"
echo "🔗  \$URL"
echo "   (\${LEN} chars, hash privé — rien n'est envoyé au serveur)"
if [ "\$LEN" -gt 1800 ]; then
  echo ""
  echo "   ⚠️  URL longue (>1800). Ouvre le lien puis clique 'Générer lien court (24h)' pour partager."
fi
if [[ "\${*:-}" == *"--open"* ]] && command -v xdg-open &>/dev/null; then
  xdg-open "\$URL" &>/dev/null &
elif [[ "\${*:-}" == *"--open"* ]] && command -v open &>/dev/null; then
  open "\$URL" &>/dev/null &
fi
`;

  setHeader(event, "content-type", "text/x-shellscript; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=60");
  return script;
});

#!/bin/sh
set -e

# Runtime HOST injection for public/sh/tree.sh (fichier brut reste en public, mais servi avec HOST du runtime)
# HOST peut être "localhost:3000", "app.nikho.dev" ou "https://app.nikho.dev"
if [ -f "/app/.output/public/sh/tree.sh" ]; then
  RAW_HOST="${HOST:-${APP_HOST:-app.nikho.dev}}"
  RAW_HOST=$(echo "$RAW_HOST" | tr -d '[:space:]')
  if [ -n "$RAW_HOST" ]; then
    if echo "$RAW_HOST" | grep -q "^https\?://"; then
      BASE_URL_VAL=$(echo "$RAW_HOST" | sed 's|/$||')
    elif echo "$RAW_HOST" | grep -q "^localhost\|^127\.0\.0\.1"; then
      BASE_URL_VAL="http://$(echo "$RAW_HOST" | sed 's|/$||')"
    else
      BASE_URL_VAL="https://$(echo "$RAW_HOST" | sed 's|/$||')"
    fi
    # Remplace la ligne BASE_URL dans le fichier servi (runtime, pas buildtime)
    sed -i "s|BASE_URL=\"\${BASE_URL:-.*}\"|BASE_URL=\"\${BASE_URL:-$BASE_URL_VAL}\"|g" /app/.output/public/sh/tree.sh || true
    echo "[entrypoint] /sh/tree.sh → BASE_URL=$BASE_URL_VAL (HOST=$RAW_HOST)"
  fi
fi

exec "$@"

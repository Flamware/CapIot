#!/bin/sh
set -e

TEMPLATE_FILE=/usr/share/nginx/html/env.template.js
OUT_FILE=/usr/share/nginx/html/env.js

echo "[entrypoint] Generating runtime env file..."

if [ -f "$TEMPLATE_FILE" ]; then
  cp "$TEMPLATE_FILE" "$OUT_FILE"

  # Replace placeholders with environment variable values
  sed -i "s|__VITE_API_URL__|${VITE_API_URL:-}|g" "$OUT_FILE"
  sed -i "s|__VITE_INFLUXDB_URL__|${VITE_INFLUXDB_URL:-}|g" "$OUT_FILE"

  echo "[entrypoint] Environment injected successfully:"
  cat "$OUT_FILE"
else
  echo "[entrypoint] WARNING: $TEMPLATE_FILE not found!"
fi

echo "[entrypoint] Starting Nginx..."
exec "$@"

#!/bin/sh

# The correct path to your env-config.js file
CONFIG_FILE="/usr/share/nginx/html/env-config.js"

# Replace the placeholder values with the environment variables provided by Kubernetes
sed -i "s|VITE_API_URL_PLACEHOLDER|${VITE_API_URL}|g" "$CONFIG_FILE"
sed -i "s|VITE_INFLUXDB_URL_PLACEHOLDER|${VITE_INFLUXDB_URL}|g" "$CONFIG_FILE"

# Start Nginx
exec nginx -g "daemon off;"
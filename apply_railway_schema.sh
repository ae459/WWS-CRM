#!/usr/bin/env bash
set -euo pipefail



HOST="${MYSQLHOST:-${DB_HOST:-ballast.proxy.rlwy.net}}"
PORT="${MYSQLPORT:-${DB_PORT:-19394}}"
USER="${MYSQLUSER:-${DB_USER:-root}}"
PASS="${MYSQLPASSWORD:-${DB_PASSWORD:-ODuTDNumEIEBbuqlthAruiVzeKqrsOrD}}"
NAME="${MYSQLDATABASE:-${DB_NAME:-railway}}"

if [[ -z "$HOST" || -z "$USER" || -z "$PASS" || -z "$NAME" ]]; then
  echo "Missing DB connection environment variables."
  echo "Set MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE"
  echo "or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME."
  exit 1
fi

if ! command -v mysql >/dev/null 2>&1; then
  echo "MySQL client not found. Install with: brew install mysql-client"
  exit 1
fi

echo "Applying setup_database.sql to $HOST:$PORT/$NAME ..."
MYSQL_PWD="$PASS" mysql \
  --host="$HOST" \
  --port="$PORT" \
  --user="$USER" \
  --database="$NAME" \
  --ssl-mode=REQUIRED \
  < "$(dirname "$0")/setup_database.sql"

echo "Done. Tables and seed data applied."

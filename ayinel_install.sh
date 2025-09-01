#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# Defaults (override with flags or env)
# -----------------------------
MODE="${MODE:-single}"                          # single | web-only | api-only
DOMAIN_WEB="${DOMAIN_WEB:-ayinel.com}"
DOMAIN_WWW="${DOMAIN_WWW:-www.ayinel.com}"
DOMAIN_API="${DOMAIN_API:-api.ayinel.com}"

REPO_URL="${REPO_URL:-https://github.com/Kovesh-26/ayinelultra.git}"
REPO_BRANCH="${REPO_BRANCH:-main}"
APP_USER="${APP_USER:-${SUDO_USER:-$USER}}"
APP_HOME="$(getent passwd "$APP_USER" | cut -d: -f6)"
APP_ROOT="${APP_ROOT:-$APP_HOME/ayinel}"       # where code lives
WEB_DIR="${WEB_DIR:-apps/web}"
API_DIR="${API_DIR:-apps/api}"

API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-3000}"
NODE_MAJOR="${NODE_MAJOR:-20}"
PNPM_VERSION="${PNPM_VERSION:-9}"

PG_DB="${PG_DB:-ayineldb}"
PG_USER="${PG_USER:-ayinel}"
PG_PASS="${PG_PASS:-}"                          # if blank, generate
JWT_SECRET="${JWT_SECRET:-}"                    # if blank, generate

EMAIL_LETSENCRYPT="${EMAIL_LETSENCRYPT:-admin@$DOMAIN_WEB}"  # change if you want

# -----------------------------
# Helpers
# -----------------------------
log()  { echo -e "\033[1;32m[AYINEL]\033[0m $*"; }
warn() { echo -e "\033[1;33m[WARN]\033[0m $*"; }
err()  { echo -e "\033[1;31m[ERR]\033[0m  $*" >&2; }

usage() {
  cat <<EOF
Ayinel Universal Installer

USAGE:
  sudo bash $0 [options]

OPTIONS:
  --mode <single|web-only|api-only>      (default: $MODE)
  --domain-web <domain>                  (default: $DOMAIN_WEB)
  --domain-www <domain>                  (default: $DOMAIN_WWW)
  --domain-api <domain>                  (default: $DOMAIN_API)

  --repo <git url>                       (default: $REPO_URL)
  --branch <git branch>                  (default: $REPO_BRANCH)
  --app-root <path>                      (default: $APP_ROOT)
  --web-dir <subpath>                    (default: $WEB_DIR)
  --api-dir <subpath>                    (default: $API_DIR)

  --api-port <port>                      (default: $API_PORT)
  --web-port <port>                      (default: $WEB_PORT)

  --pg-db <name>                         (default: $PG_DB)
  --pg-user <user>                       (default: $PG_USER)
  --pg-pass <pass>                       (default: auto-generate)
  --jwt-secret <secret>                  (default: auto-generate)
  --email <letsencrypt email>            (default: $EMAIL_LETSENCRYPT)

EXAMPLES:
  # Single server (web+api+db) on one VPS with your domains
  sudo bash $0 --mode single --domain-web ayinel.com --domain-api api.ayinel.com

  # Only API+DB on a backend server
  sudo bash $0 --mode api-only --domain-api api.ayinel.com

  # Only Web on a frontend server that calls a remote API
  NEXT_PUBLIC_API_BASE=https://api.ayinel.com NEXT_PUBLIC_WS_URL=https://api.ayinel.com/social \
  sudo bash $0 --mode web-only --domain-web ayinel.com

NOTE:
  - Point DNS before running (A records for ayinel.com/api.ayinel.com to this server, CNAME www -> ayinel.com)
  - Re-run is safe for updates; it will pull latest, rebuild, and reload services.
EOF
}

# -----------------------------
# Parse flags
# -----------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode) MODE="$2"; shift 2 ;;
    --domain-web) DOMAIN_WEB="$2"; shift 2 ;;
    --domain-www) DOMAIN_WWW="$2"; shift 2 ;;
    --domain-api) DOMAIN_API="$2"; shift 2 ;;
    --repo) REPO_URL="$2"; shift 2 ;;
    --branch) REPO_BRANCH="$2"; shift 2 ;;
    --app-root) APP_ROOT="$2"; shift 2 ;;
    --web-dir) WEB_DIR="$2"; shift 2 ;;
    --api-dir) API_DIR="$2"; shift 2 ;;
    --api-port) API_PORT="$2"; shift 2 ;;
    --web-port) WEB_PORT="$2"; shift 2 ;;
    --pg-db) PG_DB="$2"; shift 2 ;;
    --pg-user) PG_USER="$2"; shift 2 ;;
    --pg-pass) PG_PASS="$2"; shift 2 ;;
    --jwt-secret) JWT_SECRET="$2"; shift 2 ;;
    --email) EMAIL_LETSENCRYPT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
done

# -----------------------------
# Preconditions
# -----------------------------
if [[ $EUID -ne 0 ]]; then err "Run as root: sudo bash $0"; exit 1; fi
if [[ -z "$PG_PASS" ]]; then PG_PASS="$(openssl rand -base64 24)"; fi
if [[ -z "$JWT_SECRET" ]]; then JWT_SECRET="$(openssl rand -hex 32)"; fi

apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  build-essential git curl ufw ca-certificates nginx \
  software-properties-common unzip jq

# Node + pnpm + PM2
curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
apt-get install -y nodejs
npm install -g pnpm@${PNPM_VERSION} pm2

# Firewall
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
ufw --force enable || true

# Postgres (only for single/api-only)
if [[ "$MODE" != "web-only" ]]; then
  apt-get install -y postgresql postgresql-contrib
  sudo -u postgres psql <<SQL
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${PG_USER}') THEN
      CREATE ROLE ${PG_USER} LOGIN PASSWORD '${PG_PASS}';
   END IF;
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${PG_DB}') THEN
      CREATE DATABASE ${PG_DB} OWNER ${PG_USER};
   END IF;
END
\$do\$;
ALTER ROLE ${PG_USER} WITH CREATEDB;
SQL
fi

# Clone/update repo
mkdir -p "$APP_ROOT"
chown -R "$APP_USER":"$APP_USER" "$APP_ROOT"
if [[ -d "$APP_ROOT/.git" ]]; then
  sudo -u "$APP_USER" git -C "$APP_ROOT" fetch origin "$REPO_BRANCH"
  sudo -u "$APP_USER" git -C "$APP_ROOT" checkout "$REPO_BRANCH"
  sudo -u "$APP_USER" git -C "$APP_ROOT" pull
else
  sudo -u "$APP_USER" git clone -b "$REPO_BRANCH" "$REPO_URL" "$APP_ROOT"
fi

# Write envs depending on mode
if [[ "$MODE" != "web-only" ]]; then
  cat >"$APP_ROOT/$API_DIR/.env" <<ENV
NODE_ENV=production
PORT=${API_PORT}
DATABASE_URL=postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public
JWT_SECRET=${JWT_SECRET}
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# CLOUDFLARE_STREAM_TOKEN=
ENV
  chown "$APP_USER":"$APP_USER" "$APP_ROOT/$API_DIR/.env"
fi

# If caller provided API base/WS URL via env, honor it; otherwise default to local api
NEXT_PUBLIC_API_BASE="${NEXT_PUBLIC_API_BASE:-https://${DOMAIN_API}}"
NEXT_PUBLIC_WS_URL="${NEXT_PUBLIC_WS_URL:-https://${DOMAIN_API}/social}"

if [[ "$MODE" != "api-only" ]]; then
  cat >"$APP_ROOT/$WEB_DIR/.env.local" <<ENV
NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV
  chown "$APP_USER":"$APP_USER" "$APP_ROOT/$WEB_DIR/.env.local"
fi

# Install & build
pushd "$APP_ROOT" >/dev/null
sudo -u "$APP_USER" pnpm install --frozen-lockfile || sudo -u "$APP_USER" pnpm install
popd >/dev/null

if [[ "$MODE" != "api-only" ]]; then
  pushd "$APP_ROOT/$WEB_DIR" >/dev/null
  sudo -u "$APP_USER" pnpm build || sudo -u "$APP_USER" npm run build
  popd >/dev/null
fi

if [[ "$MODE" != "web-only" ]]; then
  pushd "$APP_ROOT/$API_DIR" >/dev/null
  sudo -u "$APP_USER" pnpm build || sudo -u "$APP_USER" npm run build
  sudo -u "$APP_USER" npx prisma generate
  sudo -u "$APP_USER" npx prisma migrate deploy
  popd >/dev/null
fi

# PM2 services
if [[ "$MODE" != "api-only" ]]; then
  sudo -u "$APP_USER" pm2 delete ayinel-web >/dev/null 2>&1 || true
  sudo -u "$APP_USER" pm2 start "pnpm start" --name ayinel-web --cwd "$APP_ROOT/$WEB_DIR" --time --update-env
fi

if [[ "$MODE" != "web-only" ]]; then
  sudo -u "$APP_USER" pm2 delete ayinel-api >/dev/null 2>&1 || true
  sudo -u "$APP_USER" pm2 start "node dist/main.js" --name ayinel-api --cwd "$APP_ROOT/$API_DIR" --time --update-env
fi

sudo -u "$APP_USER" pm2 save
pm2 startup systemd -u "$APP_USER" --hp "$APP_HOME" >/dev/null 2>&1 || true
systemctl restart pm2-"$APP_USER" || true

# Nginx sites
rm -f /etc/nginx/sites-enabled/default || true

if [[ "$MODE" != "api-only" ]]; then
cat >/etc/nginx/sites-available/ayinel_web.conf <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name ${DOMAIN_WEB} ${DOMAIN_WWW};
  location / {
    proxy_pass http://127.0.0.1:${WEB_PORT};
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
NGINX
ln -sf /etc/nginx/sites-available/ayinel_web.conf /etc/nginx/sites-enabled/ayinel_web.conf
fi

if [[ "$MODE" != "web-only" ]]; then
cat >/etc/nginx/sites-available/ayinel_api.conf <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name ${DOMAIN_API};
  location / {
    proxy_pass http://127.0.0.1:${API_PORT};
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
NGINX
ln -sf /etc/nginx/sites-available/ayinel_api.conf /etc/nginx/sites-enabled/ayinel_api.conf
fi

nginx -t && systemctl reload nginx

# HTTPS
apt-get install -y certbot python3-certbot-nginx
if [[ "$MODE" != "api-only" ]]; then
  certbot --nginx -d "${DOMAIN_WEB},${DOMAIN_WWW}" -m "${EMAIL_LETSENCRYPT}" --agree-tos --non-interactive || warn "Certbot web failed (DNS not ready?)"
fi
if [[ "$MODE" != "web-only" ]]; then
  certbot --nginx -d "${DOMAIN_API}" -m "${EMAIL_LETSENCRYPT}" --agree-tos --non-interactive || warn "Certbot api failed (DNS not ready?)"
fi

# Summary
cat <<EOF

================= AYINEL READY ✅ =================
Mode:          ${MODE}
Code:          ${APP_ROOT}
User:          ${APP_USER}

Web:
  Domain:      ${DOMAIN_WEB} ${DOMAIN_WWW}
  Local port:  ${WEB_PORT}
API:
  Domain:      ${DOMAIN_API}
  Local port:  ${API_PORT}

Database (if provisioned):
  Name:        ${PG_DB}
  User:        ${PG_USER}
  Pass:        ${PG_PASS}

PM2:
  pm2 status
  pm2 logs ayinel-web
  pm2 logs ayinel-api

Re-run HTTPS later if DNS needed more time:
  certbot --nginx -d ${DOMAIN_WEB},${DOMAIN_WWW} -m ${EMAIL_LETSENCRYPT} --agree-tos
  certbot --nginx -d ${DOMAIN_API} -m ${EMAIL_LETSENCRYPT} --agree-tos
===================================================
EOF

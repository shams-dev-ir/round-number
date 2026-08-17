#!/usr/bin/env bash
#
# One-time registration of Rondix on a server that already routes everything
# through an nginx-proxy container. Run once, as root:
#
#   sudo bash register-site.sh 62.106.95.197.nip.io
#
# Afterwards every deploy is just GitHub Actions doing `compose pull && up -d`.
#
# This touches nothing that belongs to the other projects: it adds one vhost
# file, one compose project, and reloads the proxy. It never restarts, edits or
# removes another site.

set -euo pipefail

# Accepts more than one hostname. Useful because traffic normally arrives via
# the CDN, so having a second name that points straight at this box gives a way
# to tell "origin is broken" apart from "CDN is misconfigured".
#   bash register-site.sh roundnumber.8ads8.ir 62.106.95.197.nip.io
SERVER_NAMES="$*"
SERVER_NAME="${1:-}"
APP_DIR=/opt/rondix
PROXY_CONTAINER=nginx-proxy
PROXY_CONF_DIR=/opt/nginx/conf.d
PROXY_NETWORK=proxy
CONTAINER_NAME=rondix-frontend
here="$(cd "$(dirname "$0")" && pwd)"

if [[ -z "$SERVER_NAME" ]]; then
  echo "usage: sudo bash register-site.sh <domain> [more-domains...]" >&2
  echo "example: sudo bash register-site.sh roundnumber.8ads8.ir 62.106.95.197.nip.io" >&2
  exit 1
fi

if [[ "$SERVER_NAME" == *SERVER_IP* || "$SERVER_NAME" == *YOUR_* ]]; then
  echo "'$SERVER_NAME' still contains a placeholder — use the real hostname." >&2
  exit 1
fi

if [[ $EUID -ne 0 ]]; then
  echo "run as root: sudo bash register-site.sh $SERVER_NAME" >&2
  exit 1
fi

# ---------------------------------------------------------------- checks ----

echo "==> Verifying the environment this expects"

command -v docker >/dev/null || { echo "docker not found" >&2; exit 1; }

if ! docker network inspect "$PROXY_NETWORK" >/dev/null 2>&1; then
  echo "docker network '$PROXY_NETWORK' does not exist." >&2
  echo "The other frontends use it; check 'docker network ls'." >&2
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$PROXY_CONTAINER"; then
  echo "container '$PROXY_CONTAINER' is not running." >&2
  exit 1
fi

if [[ ! -d "$PROXY_CONF_DIR" ]]; then
  echo "$PROXY_CONF_DIR not found — that is the proxy's mounted conf.d." >&2
  exit 1
fi

# Refuse to shadow a hostname another site already answers for.
for name in $SERVER_NAMES; do
  clash="$(grep -rlE "^[[:space:]]*server_name[[:space:]].*(^|[[:space:]])${name}([[:space:]]|;)" \
    "$PROXY_CONF_DIR" 2>/dev/null | grep -v '/rondix\.conf$' || true)"
  if [[ -n "$clash" ]]; then
    echo "server_name ${name} is already served by:" >&2
    echo "$clash" >&2
    exit 1
  fi
done

echo "    docker ok, network '$PROXY_NETWORK' ok, proxy '$PROXY_CONTAINER' running"

# ------------------------------------------------------------- app files ----

echo "==> Installing compose project to $APP_DIR"
mkdir -p "$APP_DIR"
cp "$here/docker-compose.yml" "$APP_DIR/docker-compose.yml"

# The deploy user needs to manage only this compose project.
if ! id -u deploy >/dev/null 2>&1; then
  echo "==> Creating deploy user"
  adduser --disabled-password --gecos "" deploy
fi
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chown -R deploy:deploy "$APP_DIR"

# Reloading the proxy is the only privileged action CI performs.
echo "==> Granting scoped sudo for the proxy reload only"
cat > /etc/sudoers.d/rondix-deploy <<EOF
deploy ALL=(root) NOPASSWD: /usr/bin/docker exec $PROXY_CONTAINER nginx -s reload, /usr/bin/docker exec $PROXY_CONTAINER nginx -t
EOF
chmod 440 /etc/sudoers.d/rondix-deploy
visudo -cf /etc/sudoers.d/rondix-deploy

# ----------------------------------------------------------------- vhost ----

echo "==> Adding vhost for: ${SERVER_NAMES}"
sed -e "s/SERVER_NAMES/${SERVER_NAMES}/g" -e "s/SERVER_NAME/${SERVER_NAME}/g" "$here/rondix.conf" > "$PROXY_CONF_DIR/rondix.conf"

# If our vhost is bad, take it back out rather than leaving the proxy unable to
# reload for every other site on the box.
if ! docker exec "$PROXY_CONTAINER" nginx -t; then
  echo "proxy rejected the new vhost — removing it and leaving the proxy as it was" >&2
  rm -f "$PROXY_CONF_DIR/rondix.conf"
  docker exec "$PROXY_CONTAINER" nginx -t
  exit 1
fi

docker exec "$PROXY_CONTAINER" nginx -s reload
echo "    vhost installed and proxy reloaded"

echo
echo "==> Done."
for n in $SERVER_NAMES; do echo "  Site will answer on: http://$n"; done
echo
echo "  Next:"
echo "   1. Add the CI public key to /home/deploy/.ssh/authorized_keys"
echo "   2. Set SSH_HOST / SSH_USER / SSH_PRIVATE_KEY secrets in GitHub"
echo "   3. Run the Deploy workflow"
echo
echo "  Logs:   docker logs -f ${CONTAINER_NAME}"
echo "  Status: docker ps --filter name=${CONTAINER_NAME}"

#!/usr/bin/env bash
#
# Issues a Let's Encrypt certificate and switches the Rondix vhost to HTTPS.
# Run once, as root, after the site is already answering over HTTP:
#
#   sudo bash enable-ssl.sh roundnumber.8ads8.ir you@example.com
#
# Safe to re-run: certbot skips a certificate that is still valid, and a vhost
# that fails nginx -t is rolled back to the previous one.

set -euo pipefail

SERVER_NAME="${1:-}"
EMAIL="${2:-}"
PROXY_CONTAINER=nginx-proxy
PROXY_CONF_DIR=/opt/nginx/conf.d
CERT_DIR=/opt/nginx/certbot/conf
WEBROOT=/opt/nginx/certbot/www
VHOST="$PROXY_CONF_DIR/rondix.conf"
here="$(cd "$(dirname "$0")" && pwd)"

if [[ -z "$SERVER_NAME" || -z "$EMAIL" ]]; then
  echo "usage: sudo bash enable-ssl.sh <domain> <email>" >&2
  echo "example: sudo bash enable-ssl.sh roundnumber.8ads8.ir you@example.com" >&2
  exit 1
fi

[[ $EUID -eq 0 ]] || { echo "run as root" >&2; exit 1; }
[[ -f "$VHOST" ]] || { echo "$VHOST not found — run register-site.sh first" >&2; exit 1; }

# The existing server_name list is preserved, so any extra hostnames (such as
# the direct-to-origin one) keep working.
SERVER_NAMES="$(sed -n 's/^[[:space:]]*server_name[[:space:]]\+\(.*\);[[:space:]]*$/\1/p' "$VHOST" | head -1)"
SERVER_NAMES="${SERVER_NAMES:-$SERVER_NAME}"
echo "==> Hostnames on this vhost: $SERVER_NAMES"

# ------------------------------------------------------- reachability ----
# Fail here rather than burning a Let's Encrypt rate-limit slot on a domain
# whose challenge cannot be delivered.
echo "==> Checking the ACME challenge path is reachable"
probe="acme-probe-$$"
mkdir -p "$WEBROOT/.well-known/acme-challenge"
echo "$probe" > "$WEBROOT/.well-known/acme-challenge/$probe"
got="$(curl -s --max-time 15 "http://${SERVER_NAME}/.well-known/acme-challenge/${probe}" || true)"
rm -f "$WEBROOT/.well-known/acme-challenge/$probe"
if [[ "$got" != "$probe" ]]; then
  echo "Challenge path is not reachable at http://${SERVER_NAME}/" >&2
  echo "Got: '${got:0:120}'" >&2
  echo "Certificate issuance would fail. Check DNS and any CDN in front." >&2
  exit 1
fi
echo "    reachable"

# ------------------------------------------------------------ issue ----
echo "==> Requesting certificate for ${SERVER_NAME}"
docker run --rm \
  -v "$CERT_DIR:/etc/letsencrypt" \
  -v "$WEBROOT:/var/www/certbot" \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d "$SERVER_NAME" --agree-tos -m "$EMAIL" -n --keep-until-expiring

if [[ ! -f "$CERT_DIR/live/$SERVER_NAME/fullchain.pem" ]]; then
  echo "certificate not found after certbot run" >&2
  exit 1
fi
echo "    certificate present"

# ------------------------------------------------------------ swap ----
echo "==> Switching the vhost to HTTPS"
backup="${VHOST}.pre-ssl.bak"
cp "$VHOST" "$backup"

sed -e "s/SERVER_NAMES/${SERVER_NAMES}/g" -e "s/SERVER_NAME/${SERVER_NAME}/g" \
  "$here/rondix-ssl.conf" > "$VHOST"

if ! docker exec "$PROXY_CONTAINER" nginx -t; then
  echo "proxy rejected the TLS vhost — restoring the HTTP one" >&2
  mv -f "$backup" "$VHOST"
  docker exec "$PROXY_CONTAINER" nginx -t
  exit 1
fi

docker exec "$PROXY_CONTAINER" nginx -s reload
echo "    vhost switched and proxy reloaded (previous kept at $backup)"

echo
echo "==> Done. https://${SERVER_NAME}"
echo
echo "  Renewal: certbot only renews within 30 days of expiry, so a monthly"
echo "  cron entry is enough. Add one if this server has no renewal job yet:"
echo "    0 3 1 * * docker run --rm -v $CERT_DIR:/etc/letsencrypt -v $WEBROOT:/var/www/certbot certbot/certbot renew --quiet && docker exec $PROXY_CONTAINER nginx -s reload"

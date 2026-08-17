#!/usr/bin/env bash
#
# One-time server preparation for the Rondix frontend.
# Run once, as root, on a fresh Ubuntu/Debian VPS:
#
#   sudo bash server-setup.sh 203.0.113.5.nip.io
#
# After this, every deploy is handled by GitHub Actions — you never run this
# script again.

set -euo pipefail

SERVER_NAME="${1:-}"
APP_DIR=/var/www/rondix
DEPLOY_USER=deploy
NODE_MAJOR=22

if [[ -z "$SERVER_NAME" ]]; then
  echo "usage: sudo bash server-setup.sh <domain-or-nip.io-host>" >&2
  echo "example: sudo bash server-setup.sh 203.0.113.5.nip.io" >&2
  exit 1
fi

# Catch the placeholder being pasted through verbatim, which would leave nginx
# listening for a hostname that resolves nowhere.
if [[ "$SERVER_NAME" == *SERVER_IP* || "$SERVER_NAME" == *YOUR_* ]]; then
  echo "'$SERVER_NAME' still contains a placeholder." >&2
  echo "Substitute your real address, e.g. $(hostname -I 2>/dev/null | awk '{print $1}').nip.io" >&2
  exit 1
fi

if [[ $EUID -ne 0 ]]; then
  echo "run this as root (sudo bash server-setup.sh ...)" >&2
  exit 1
fi

# An earlier failed run of this script may have left a second NodeSource entry
# behind. Two entries for the same repo with different Signed-By keyrings make
# apt refuse to read its source list at all, breaking every apt command — so
# undo our own leftovers before touching apt.
if [[ -f /etc/apt/keyrings/nodesource.gpg && -f /usr/share/keyrings/nodesource.gpg ]]; then
  echo "==> Repairing duplicate NodeSource apt entry from a previous run"
  rm -f /etc/apt/sources.list.d/nodesource.list /etc/apt/keyrings/nodesource.gpg
fi

if ! apt-get update -qq 2>/dev/null; then
  echo "==> apt sources unreadable; dropping this script's NodeSource entry and retrying"
  rm -f /etc/apt/sources.list.d/nodesource.list /etc/apt/keyrings/nodesource.gpg
  apt-get update -qq
fi

echo "==> Installing nginx, rsync"
apt-get install -y ca-certificates curl gnupg rsync nginx sudo

# Node: only touch apt if a new enough runtime isn't already there. Adding a
# second NodeSource entry when the server already has one makes apt abort with
# "Conflicting values set for option Signed-By", which breaks *every* apt
# command on the box — so check first and reconcile rather than blindly append.
node_major=0
if command -v node >/dev/null 2>&1; then
  node_major=$(node -v | sed 's/^v\([0-9]*\).*/\1/')
fi

if [[ "$node_major" -ge 20 ]]; then
  echo "==> Node $(node -v) already installed — skipping NodeSource setup"
else
  echo "==> Installing Node ${NODE_MAJOR} from NodeSource"
  # Drop any prior NodeSource config, whichever layout it used, so exactly one
  # entry with one keyring remains.
  rm -f /etc/apt/sources.list.d/nodesource.list \
        /etc/apt/sources.list.d/nodesource.sources \
        /etc/apt/keyrings/nodesource.gpg \
        /usr/share/keyrings/nodesource.gpg

  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
    > /etc/apt/sources.list.d/nodesource.list

  apt-get update -qq
  apt-get install -y nodejs
fi

echo "==> Node version: $(node --version)"
if [[ "$(node -v | sed 's/^v\([0-9]*\).*/\1/')" -lt 20 ]]; then
  echo "Node 20+ is required to run the Next.js server bundle." >&2
  exit 1
fi

echo "==> Creating ${DEPLOY_USER} user and ${APP_DIR}"
id -u "$DEPLOY_USER" &>/dev/null || adduser --system --group --shell /bin/bash --home "/home/$DEPLOY_USER" "$DEPLOY_USER"
mkdir -p "$APP_DIR/releases" "/home/$DEPLOY_USER/.ssh"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR" "/home/$DEPLOY_USER"
chmod 700 "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"

echo "==> Installing systemd unit"
cp "$(dirname "$0")/rondix.service" /etc/systemd/system/rondix.service
systemctl daemon-reload
systemctl enable rondix

# The deploy user must restart the service from CI, and nothing more.
echo "==> Granting scoped sudo for the restart only"
cat > /etc/sudoers.d/rondix-deploy <<EOF
$DEPLOY_USER ALL=(root) NOPASSWD: /bin/systemctl restart rondix, /bin/systemctl status rondix, /usr/bin/systemctl restart rondix, /usr/bin/systemctl status rondix
EOF
chmod 440 /etc/sudoers.d/rondix-deploy
visudo -cf /etc/sudoers.d/rondix-deploy

echo "==> Configuring nginx for ${SERVER_NAME}"
sed "s/SERVER_NAME/${SERVER_NAME}/g" "$(dirname "$0")/nginx.conf" > /etc/nginx/sites-available/rondix
ln -sfn /etc/nginx/sites-available/rondix /etc/nginx/sites-enabled/rondix
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo
echo "==> Done. Next steps:"
echo "  1. Paste the CI public key into /home/${DEPLOY_USER}/.ssh/authorized_keys"
echo "  2. Push to main — GitHub Actions will deploy the first release"
echo "  3. Enable HTTPS:  sudo certbot --nginx -d ${SERVER_NAME}"
echo
echo "  Logs:    journalctl -u rondix -f"
echo "  Status:  systemctl status rondix"

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
elif [[ "$node_major" -gt 0 ]]; then
  # Something else on this server is already using this Node. Replacing the
  # system runtime underneath a running project is not a call this script gets
  # to make silently.
  cat >&2 <<MSG

Node v${node_major} is installed and other projects on this server may depend
on it. This script will not upgrade it for you.

Rondix needs Node 20 or newer. Pick one:

  a) Upgrade system Node yourself, after checking your other apps tolerate it:
       curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
       apt-get install -y nodejs

  b) Leave system Node alone and install a private copy just for Rondix:
       curl -fsSL https://fnm.vercel.app/install | bash
       fnm install ${NODE_MAJOR}
     then point ExecStart in /etc/systemd/system/rondix.service at that binary.

MSG
  exit 1
else
  echo "==> No Node found — installing Node ${NODE_MAJOR} from NodeSource"
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

# This box runs other projects, so never assume a port is ours to take. Pick
# the first free one and record it where both systemd and the deploy workflow
# can read it back.
echo "==> Selecting a free port"
port_in_use() {
  ss -tlnH "sport = :$1" 2>/dev/null | grep -q . && return 0
  return 1
}

APP_PORT=""
if [[ -f /etc/rondix.env ]]; then
  # Re-running setup: keep the port we already published to nginx and CI.
  APP_PORT="$(sed -n 's/^PORT=//p' /etc/rondix.env)"
  echo "    reusing previously assigned port ${APP_PORT}"
fi

if [[ -z "$APP_PORT" ]]; then
  for candidate in 3000 3100 3200 3300 4010 4020 5010 5020; do
    if ! port_in_use "$candidate"; then
      APP_PORT="$candidate"
      break
    fi
    echo "    port $candidate is taken by another project, skipping"
  done
fi

if [[ -z "$APP_PORT" ]]; then
  echo "No free port found in the candidate list." >&2
  exit 1
fi
echo "    using port ${APP_PORT}"

cat > /etc/rondix.env <<EOF
NODE_ENV=production
PORT=${APP_PORT}
HOSTNAME=127.0.0.1
EOF
chmod 644 /etc/rondix.env

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

# Refuse to hijack a hostname another project already answers for.
existing="$(grep -rlE "^[[:space:]]*server_name[[:space:]].*(^|[[:space:]])${SERVER_NAME}([[:space:]]|;)" \
  /etc/nginx/sites-enabled/ 2>/dev/null | grep -v '/rondix$' || true)"
if [[ -n "$existing" ]]; then
  echo "server_name ${SERVER_NAME} is already served by:" >&2
  echo "$existing" >&2
  echo "Pick a different hostname so the existing site keeps working." >&2
  exit 1
fi

sed -e "s/SERVER_NAME/${SERVER_NAME}/g" -e "s/APP_PORT/${APP_PORT}/g" \
  "$(dirname "$0")/nginx.conf" > /etc/nginx/sites-available/rondix
ln -sfn /etc/nginx/sites-available/rondix /etc/nginx/sites-enabled/rondix

# Note: sites-enabled/default is intentionally left alone — other projects on
# this server may depend on it as the catch-all server block.

# If our block is broken, roll it back rather than leaving nginx unreloadable
# for every other site on the box.
if ! nginx -t; then
  echo "nginx rejected the new config — removing it and leaving nginx untouched" >&2
  rm -f /etc/nginx/sites-enabled/rondix
  nginx -t
  exit 1
fi
systemctl reload nginx

echo
echo "==> Done. Next steps:"
echo "  1. Paste the CI public key into /home/${DEPLOY_USER}/.ssh/authorized_keys"
echo "  2. Push to main — GitHub Actions will deploy the first release"
echo "  3. Enable HTTPS:  sudo certbot --nginx -d ${SERVER_NAME}"
echo
echo "  Logs:    journalctl -u rondix -f"
echo "  Status:  systemctl status rondix"

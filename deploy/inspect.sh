#!/usr/bin/env bash
#
# Read-only survey of how this server routes traffic, so a new project can be
# added in the same style as the existing ones.
#
# Run from Windows PowerShell (avoids all quoting problems):
#   Get-Content "D:\all_project\round number\deploy\inspect.sh" | ssh root@SERVER "bash -s"
#
# Prints no secrets: container environments are filtered to routing keys only.

echo "=== PROXY CONTAINER ==="
docker inspect nginx-proxy --format 'image:    {{.Config.Image}}' 2>/dev/null || echo "nginx-proxy not found"
docker inspect nginx-proxy --format 'networks: {{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null
echo "mounts:"
docker inspect nginx-proxy --format '{{range .Mounts}}  {{.Source}} -> {{.Destination}}{{println}}{{end}}' 2>/dev/null

echo
echo "=== PROXY SIBLINGS (acme / docker-gen companions) ==="
docker ps -a --format '{{.Names}}\t{{.Image}}' 2>/dev/null | grep -iE 'acme|docker-gen|proxy|letsencrypt' || echo "  none"

echo
echo "=== HOW EACH APP IS ROUTED ==="
for c in $(docker ps --format '{{.Names}}' 2>/dev/null); do
  echo "--- $c"
  docker inspect "$c" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
    | grep -iE '^(VIRTUAL_HOST|VIRTUAL_PORT|LETSENCRYPT_HOST|LETSENCRYPT_EMAIL|PORT|HOSTNAME)=' \
    | sed 's/^/    /' || true
  docker inspect "$c" --format '    networks: {{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null
  docker inspect "$c" --format '    restart:  {{.HostConfig.RestartPolicy.Name}}' 2>/dev/null
done

echo
echo "=== DOCKER NETWORKS ==="
docker network ls 2>/dev/null

echo
echo "=== PROJECT DIRECTORIES ==="
ls -1d /root/*/ /opt/*/ /srv/*/ /home/*/ 2>/dev/null | head -30

echo
echo "=== COMPOSE FILES ==="
find /root /opt /srv /home -maxdepth 4 -name 'docker-compose*.y*ml' -o -maxdepth 4 -name 'compose*.y*ml' 2>/dev/null | head -20

echo
echo "=== A REPRESENTATIVE COMPOSE FILE ==="
sample=$(find /root /opt /srv /home -maxdepth 4 \( -name 'docker-compose*.y*ml' -o -name 'compose*.y*ml' \) 2>/dev/null | head -1)
if [ -n "$sample" ]; then
  echo "# $sample"
  # Redact anything that looks like a credential before printing.
  sed -E 's/(PASSWORD|SECRET|TOKEN|KEY|PASS)([A-Z_]*)[[:space:]]*[:=][[:space:]]*.*/\1\2: <redacted>/I' "$sample"
else
  echo "  none found"
fi

echo
echo "=== SYSTEM NGINX ==="
echo "active: $(systemctl is-active nginx 2>/dev/null || echo inactive)"
ls -1 /etc/nginx/sites-enabled/ 2>/dev/null | sed 's/^/  /'

echo
echo "=== NATIVE NEXT SERVICE (behyarzist) ==="
systemctl cat behyarzist.service 2>/dev/null | grep -E 'ExecStart|WorkingDirectory|Environment|User=' | sed 's/^/  /' || echo "  n/a"

echo
echo "=== DISK ==="
df -h / | tail -1

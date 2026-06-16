#!/bin/bash
# ============================================================
# VANNES BATTERIES — Setup CT Proxmox (Debian 12)
# Exécuter en root dans le CT
# ============================================================

set -e

echo "=== VANNES BATTERIES — Setup Proxmox CT ==="

# 1. System update
echo "[1/7] Mise à jour système..."
apt update && apt upgrade -y

# 2. Install Node.js 20
echo "[2/7] Installation Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install Redis
echo "[3/7] Installation Redis..."
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Config Redis : appendonly + 128MB max + LRU
cat > /etc/redis/redis.conf.d/vannes-batteries.conf << 'REDISCONF'
appendonly yes
appendfsync everysec
maxmemory 128mb
maxmemory-policy allkeys-lru
bind 127.0.0.1
port 6379
REDISCONF
systemctl restart redis-server

# Vérifier Redis
redis-cli ping | grep -q PONG && echo "  ✓ Redis OK (PONG)" || echo "  ✗ Redis FAILED"

# 4. Install PM2 + Nginx
echo "[4/7] Installation PM2 + Nginx..."
npm install -g pm2
apt install -y nginx certbot python3-certbot-nginx

# 5. Create app directory
echo "[5/7] Création répertoire /opt/vannes-batteries..."
mkdir -p /opt/vannes-batteries

# 6. Clone & build
echo "[6/7] Clone du repo..."
cd /opt/vannes-batteries
if [ ! -d ".git" ]; then
  git clone https://github.com/Caratrac22/vannes-batteries.git .
else
  git pull
fi

echo "  Créer .env.local puis lancer :"
echo "  nano /opt/vannes-batteries/.env.local"
echo ""
echo "  Contenu de .env.local :"
echo "  ───────────────────────"
echo "  GOOGLE_PLACES_API_KEY=\"AIzaSyBNM3tQSFO9kTTUVo5W26BW5i9JHDw-vc0\""
echo "  GOOGLE_PLACE_ID=\"ChIJleF5jcIeEEgRYzVDrJbLPoA\""
echo "  NEXT_PUBLIC_GOOGLE_MAPS_KEY=\"AIzaSyBNM3tQSFO9kTTUVo5W26BW5i9JHDw-vc0\""
echo "  REDIS_URL=\"redis://127.0.0.1:6379\""
echo ""

# 7. Final instructions
echo "[7/7] Prochaines étapes :"
echo ""
echo "  cd /opt/vannes-batteries"
echo "  nano .env.local              # <- remplir les variables"
echo "  npm ci"
echo "  npm run build"
echo "  pm2 start npm --name vannes-batteries -- start"
echo "  pm2 save && pm2 startup"
echo ""
echo "  Puis configurer Nginx :"
echo "  cp /opt/vannes-batteries/deploy/nginx.conf /etc/nginx/sites-available/vannes-batteries.conf"
echo "  ln -sf /etc/nginx/sites-available/vannes-batteries.conf /etc/nginx/sites-enabled/"
echo "  rm -f /etc/nginx/sites-enabled/default"
echo "  nginx -t && systemctl reload nginx"
echo "  certbot --nginx -d vannes-batteries.fr -d www.vannes-batteries.fr"
echo ""
echo "  Vérifications :"
echo "  redis-cli ping                         # -> PONG"
echo "  pm2 status                             # -> vannes-batteries online"
echo "  curl -s http://localhost:3000/api/hours # -> JSON avec isOpenNow"
echo ""
echo "=== Setup terminé ==="

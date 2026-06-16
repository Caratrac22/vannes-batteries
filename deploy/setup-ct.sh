#!/bin/bash
# ============================================================
# VANNES BATTERIES — Setup CT Proxmox (Debian 12)
# Exécuter en root dans le CT
# ============================================================

set -e

echo "=== VANNES BATTERIES — Setup Proxmox CT ==="

# 1. System update
echo "[1/6] Mise à jour système..."
apt update && apt upgrade -y

# 2. Install Node.js 20
echo "[2/6] Installation Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install Docker (optionnel, pour mode container)
echo "[3/6] Installation Docker..."
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 4. Install PM2 + Nginx
echo "[4/6] Installation PM2 + Nginx..."
npm install -g pm2
apt install -y nginx certbot python3-certbot-nginx

# 5. Create app directory
echo "[5/6] Création répertoire /opt/vannes-batteries..."
mkdir -p /opt/vannes-batteries
cd /opt/vannes-batteries

# 6. Clone repo (sera fait manuellement ou via git)
echo "[6/6] Prêt. Prochaines étapes :"
echo "  cd /opt/vannes-batteries"
echo "  git clone https://github.com/Caratrac22/vannes-batteries.git ."
echo "  cp .env.example .env.local  # <- remplir les variables"
echo "  npm ci"
echo "  npm run build"
echo "  pm2 start npm --name vannes-batteries -- start"
echo "  pm2 save && pm2 startup"
echo ""
echo "  Puis configurer Nginx avec :"
echo "  cp /opt/vannes-batteries/deploy/nginx.conf /etc/nginx/sites-available/vannes-batteries.conf"
echo "  ln -s /etc/nginx/sites-available/vannes-batteries.conf /etc/nginx/sites-enabled/"
echo "  nginx -t && systemctl reload nginx"
echo "  certbot --nginx -d vannes-batteries.fr -d www.vannes-batteries.fr"

echo ""
echo "=== Setup terminé ==="

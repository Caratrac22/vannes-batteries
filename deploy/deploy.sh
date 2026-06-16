#!/bin/bash
# ============================================================
# VANNES BATTERIES — Deploy (PM2 mode)
# Exécuter après le setup initial
# ============================================================

set -e

cd /opt/vannes-batteries

echo "=== Déploiement VANNES BATTERIES ==="

# Pull latest
echo "[1/4] Pull latest code..."
git pull origin master

# Install deps
echo "[2/4] Installation dépendances..."
npm ci --omit=dev

# Build
echo "[3/4] Build production..."
npm run build

# Restart PM2
echo "[4/4] Restart PM2..."
pm2 restart vannes-batteries || pm2 start npm --name "vannes-batteries" -- start
pm2 save

echo ""
echo "=== Déploiement terminé ==="
echo "Site : https://vannes-batteries.fr"

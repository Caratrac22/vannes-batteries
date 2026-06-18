import paramiko, sys, io, urllib.request, ssl, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=30)

def run(cmd, timeout=30):
    s,o,e = n.exec_command(cmd, timeout=timeout)
    return o.read().decode('utf-8', errors='replace').strip()

# 1. PM2 status
print("=== PM2 Status ===")
print(run("pct exec 100 -- pm2 show vannes-batteries 2>&1 | grep -E 'status|uptime|exec cwd|restarts'"))

# 2. Git version on server
print("\n=== Git version ===")
print(run("pct exec 100 -- bash -c 'cd /opt/vannes-batteries && git log --oneline -3'"))

# 3. Files exist (YouTubeEmbed, updated FerrariShowcase, updated Navbar, updated context.tsx)
print("\n=== Key files ===")
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/components/ui/YouTubeEmbed.tsx 2>&1"))
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/components/sections/FerrariShowcase.tsx 2>&1"))
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/components/layout/Navbar.tsx 2>&1"))
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/lib/i18n/context.tsx 2>&1"))
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/app/page.tsx 2>&1"))

# 4. Check that page.tsx has YouTubeEmbed
print("\n=== page.tsx has YouTubeEmbed? ===")
print(run("pct exec 100 -- grep -c 'YouTubeEmbed' /opt/vannes-batteries/app/page.tsx"))

# 5. Check FerrariShowcase has lighter overlay
print("\n=== FerrariShowcase overlay ===")
print(run("pct exec 100 -- grep 'bg-gradient-to-b' /opt/vannes-batteries/components/sections/FerrariShowcase.tsx"))

# 6. Check Navbar has no left padding
print("\n=== Navbar padding ===")
print(run("pct exec 100 -- grep 'px-' /opt/vannes-batteries/components/layout/Navbar.tsx | head -3"))

# 7. Check context.tsx returns "fr" always
print("\n=== i18n default locale ===")
print(run("pct exec 100 -- grep -A2 'browserLang\\|return.*fr' /opt/vannes-batteries/lib/i18n/context.tsx | head -5"))

# 8. HTTP test
print("\n=== HTTP test ===")
print(run("pct exec 100 -- curl -so /dev/null -w '%{http_code}' http://localhost:3000 2>&1"))

# 9. Check build output exists
print("\n=== Build output ===")
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/.next/BUILD_ID 2>&1"))

# 10. NPM proxy configs (nginx)
print("\n=== NPM proxy configs ===")
print(run("pct exec 103 -- ls -la /opt/npm/data/nginx/proxy_host/17.conf 2>&1"))
print(run("pct exec 103 -- head -5 /opt/npm/data/nginx/proxy_host/17.conf 2>&1"))

# 11. SSL cert
print("\n=== SSL cert ===")
print(run("pct exec 103 -- docker exec nginx-proxy-manager openssl x509 -in /etc/letsencrypt/live/vannes-batteries.fr/fullchain.pem -noout -subject -dates 2>&1"))

# 12. Full HTTPS test from Proxmox
print("\n=== HTTPS from Proxmox ===")
for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr", "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
    print(f"  {url}: {run(f'curl -sk -o /dev/null -w \"%{{http_code}}\" {url} 2>&1')}")

# 13. Check YouTube embed renders
print("\n=== YouTube in HTML ===")
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
r = urllib.request.urlopen("https://vannes-batteries.fr", timeout=10, context=ctx)
html = r.read().decode('utf-8', errors='replace')
print(f"  YouTubeEmbed component: {'YES' if 'youtube' in html.lower() or 'kbaoiROYaB4' in html else 'NO (client-side, expected)'}")
print(f"  FerrariShowcase: {'YES' if 'ferrari california' in html.lower() or 'Ferrari California' in html else 'NO'}")
print(f"  YouTube section wrapper: {'YES' if 'Qui sommes-nous' in html else 'NO'}")

n.close()
print("\nDONE")

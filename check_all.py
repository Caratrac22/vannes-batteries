import paramiko
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

checks = [
    ("HOME", "curl -sI http://localhost:3000/ | head -1"),
    ("SERVICES", "curl -sI http://localhost:3000/services | head -1"),
    ("ABOUT", "curl -sI http://localhost:3000/a-propos | head -1"),
    ("CONTACT", "curl -sI http://localhost:3000/contact | head -1"),
    ("API_HOURS", "curl -s http://localhost:3000/api/hours | head -c 200"),
    ("API_REVIEWS", "curl -s http://localhost:3000/api/reviews | head -c 200"),
    ("SITEMAP", "curl -sI http://localhost:3000/sitemap.xml | head -1"),
    ("OG_IMAGE", "curl -sI http://localhost:3000/og-image | head -1"),
    ("ROBOTS", "curl -sI http://localhost:3000/robots.txt | head -1"),
    ("PM2", "pm2 jlist | python3 -c \"import sys,json;d=json.load(sys.stdin)[0];print(f'status={d[\"pm2_env\"][\"status\"]} mem={d[\"monit\"][\"memory\"]} restarts={d[\"pm2_env\"][\"restart_time\"]}')\""),
    ("REDIS", "redis-cli ping"),
    ("NGINX", "systemctl is-active nginx"),
    ("SSL", "echo | openssl s_client -connect localhost:443 -servername localhost 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | head -2"),
]

for label, cmd in checks:
    stdin, stdout, stderr = node.exec_command(f'pct exec 100 -- bash -c "{cmd}"', timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    status = "OK" if out and "error" not in out.lower() and "ERR" not in err else "WARN"
    print(f"[{status}] {label}: {out[:150]}")

node.close()

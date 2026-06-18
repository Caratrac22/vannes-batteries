import paramiko, io, sys, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

checks = [
    ('UPTIME', 'uptime -p'),
    ('DISK', 'df -h / | tail -1'),
    ('PM2', 'pm2 jlist'),
    ('REDIS', 'redis-cli ping'),
    ('NGINX', 'systemctl is-active nginx'),
    ('SITE', 'curl -sI http://localhost:3000 | head -1'),
    ('API_HOURS', 'curl -s http://localhost:3000/api/hours | head -c 100'),
    ('ENV', 'cat /opt/vannes-batteries/.env.local 2>/dev/null | head -5; echo "---"; ls -la /opt/vannes-batteries/.env* 2>/dev/null'),
    ('CLOUDFLARED', 'which cloudflared 2>/dev/null; echo $?'),
    ('NPM_VERSIONS', 'node -v; npm -v'),
]

for label, cmd in checks:
    stdin, stdout, stderr = node.exec_command(f'pct exec 100 -- bash -c "{cmd}"', timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    status = 'OK' if out and 'error' not in out.lower() and err.lower().count('error') < 2 else 'WARN'
    print(f'[{status}] {label}: {out[:250]}')

node.close()

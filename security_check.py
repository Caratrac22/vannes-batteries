import paramiko
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

checks = [
    ("NPM_AUDIT", "cd /opt/vannes-batteries && npm audit 2>&1 | tail -3"),
    ("SECURITY_HEADERS", "curl -sI http://localhost:3000/ 2>/dev/null | grep -iE 'x-frame|x-content|strict-transport|permissions|content-security'"),
    ("API_HOURS_RATE", "for i in 1 2 3 4 5; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:3000/api/hours; done"),
    ("API_REVIEWS_RATE", "for i in 1 2 3 4 5; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:3000/api/reviews; done"),
    ("REDIS_PING", "redis-cli ping"),
    ("ENV_SAFE", "grep -r 'ghp_' /opt/vannes-batteries/.env* 2>/dev/null; echo 'no secrets found'"),
    ("GIT_ENV", "cd /opt/vannes-batteries && git ls-files '*.env*' '*.env.local' '*.env.production'"),
    ("NGINX_SSL", "curl -sI https://localhost/ -k 2>/dev/null | head -1"),
    ("PM2_STATUS", "pm2 status --no-daemon 2>/dev/null | grep vannes"),
]

for label, cmd in checks:
    stdin, stdout, stderr = node.exec_command(f'pct exec 100 -- bash -c "{cmd}"', timeout=30)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    combined = (out + err).lower()
    if "error" in combined and label not in ["API_HOURS_RATE", "API_REVIEWS_RATE"]:
        status = "FAIL"
    elif not out and not err:
        status = "WARN"
    else:
        status = "OK"
    print(f"[{status}] {label}:")
    for line in out.split('\n'):
        if line.strip():
            print(f"    {line.strip()}")

node.close()

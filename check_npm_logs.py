import paramiko, sys, io, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=15):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def ct(cmd):
    return run(f"pct exec 103 -- {cmd}")

# Check archive directory
print("=== Archive dir ===")
print(ct("docker exec nginx-proxy-manager ls -la /etc/letsencrypt/archive/npm-21/ 2>&1"))
print(ct("docker exec nginx-proxy-manager ls -la /etc/letsencrypt/archive/ 2>&1"))

# Verify symlinks
print("\n=== Verify cert symlinks ===")
print(ct("docker exec nginx-proxy-manager readlink -f /etc/letsencrypt/live/npm-21/fullchain.pem 2>&1"))
print(ct("docker exec nginx-proxy-manager readlink -f /etc/letsencrypt/live/npm-21/privkey.pem 2>&1"))

# Check NPM internal nginx config template for proxy hosts
print("\n=== NPM data nginx structure ===")
print(ct("docker exec nginx-proxy-manager ls -la /data/nginx/"))
print(ct("docker exec nginx-proxy-manager ls -la /data/nginx/proxy_host/"))

# Check if there are error logs for config generation
print("\n=== NPM backend logs ===")
print(ct("docker exec nginx-proxy-manager ls -la /data/logs/"))
print(ct("docker exec nginx-proxy-manager tail -30 /data/logs/fallback_error.log 2>/dev/null"))

# Try to manually read the generated config location
print("\n=== Nginx conf include for proxy hosts ===")
print(ct("docker exec nginx-proxy-manager grep -r 'proxy_host' /etc/nginx/ --include='*.conf' 2>/dev/null | head -10"))

# Check the actual nginx include
print("\n=== Nginx main conf http section ===")
print(ct("docker exec nginx-proxy-manager cat /etc/nginx/nginx.conf | grep -A50 'http {'"))

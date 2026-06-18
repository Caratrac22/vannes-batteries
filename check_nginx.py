import paramiko, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def ct(cmd, timeout=15):
    stdin, stdout, stderr = node.exec_command(f'pct exec 103 -- bash -c "{cmd}"', timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

# Test HTTP (port 80) from NPM
print("=== Test HTTP depuis NPM ===")
print(ct("docker exec nginx-proxy-manager curl -s -o /dev/null -w 'HTTP %{http_code} - %{redirect_url}' http://vannes-batteries.fr", timeout=10))

# Test without SSL cert
print("\n=== Test local NPM ===")
print(ct("docker exec nginx-proxy-manager curl -s -H 'Host: vannes-batteries.fr' http://localhost:80 -o /dev/null -w '%{http_code}'", timeout=10))

# Check if cert exists in NPM DB
print("\n=== Certificats NPM ===")
print(ct("sqlite3 /opt/npm/data/database.sqlite 'SELECT id, domain_names, provider, nice_name FROM certificate'"))

# Check if maybe user added a cert
print("\n=== Auto cert ? ===")
print(ct("ls -la /opt/npm/data/nginx/proxy_host/16.conf && cat /opt/npm/data/nginx/proxy_host/16.conf | head -30"))

# Check from outside world
import urllib.request
try:
    r = urllib.request.urlopen("http://vannes-batteries.fr", timeout=10)
    print(f"\n=== From outside (HTTP) ===")
    print(f"  Status: {r.status}")
    print(f"  URL: {r.url}")
    print(f"  Headers: {dict(r.headers)}")
except Exception as e:
    print(f"\n=== From outside error: {e}")

# Force SSL cert creation via API
print("\n=== Demande certificat SSL (forcer par API) ===")
# First login
login = ct('docker exec nginx-proxy-manager curl -s -X POST http://localhost:81/api/tokens -H "Content-Type: application/json" -d @/dev/stdin <<PAYLOAD 2>&1', timeout=10)
print(f"  Login: {login[:100]}")

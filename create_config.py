import paramiko, sys, io, base64, time, ssl, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

cfg = """# ------------------------------------------------------------
# vannes-batteries.fr
# ------------------------------------------------------------

map $scheme $hsts_header {
    https   "max-age=63072000; preload";
}

server {
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;

  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  server_name vannes-batteries.fr;

  ssl_certificate /etc/letsencrypt/live/npm-21/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/npm-21/privkey.pem;
  include conf.d/include/letsencrypt-acme-challenge.conf;
  include conf.d/include/ssl-cache.conf;
  include conf.d/include/ssl-ciphers.conf;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection $http_connection;
  proxy_http_version 1.1;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  location / {
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_http_version 1.1;
    include conf.d/include/proxy.conf;
  }

  include /data/nginx/custom/server_proxy[.]conf;
}

server {
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;

  listen 80;
  listen [::]:80;

  server_name vannes-batteries.fr;

  include conf.d/include/letsencrypt-acme-challenge.conf;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection $http_connection;
  proxy_http_version 1.1;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  location / {
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_http_version 1.1;
    include conf.d/include/proxy.conf;
  }

  include /data/nginx/custom/server_proxy[.]conf;
}
"""

# Write file on Proxmox host
data = base64.b64encode(cfg.encode('utf-8')).decode('ascii')
run(f"echo '{data}' | base64 -d > /root/17.conf")

# Push into CT 103
run("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")

# Verify
print("=== Verify file ===")
print(run("pct exec 103 -- wc -l /opt/npm/data/nginx/proxy_host/17.conf"))
print(run("pct exec 103 -- head -3 /opt/npm/data/nginx/proxy_host/17.conf"))

# Nginx test
print("\n=== Nginx test ===")
print(run("pct exec 103 -- docker exec nginx-proxy-manager nginx -t 2>&1"))

# Reload
print("\n=== Reload ===")
print(run("pct exec 103 -- docker exec nginx-proxy-manager nginx -s reload 2>&1"))
time.sleep(2)

# Test
print("\n=== Test HTTPS ===")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
try:
    r = urllib.request.urlopen("https://vannes-batteries.fr", timeout=15, context=ctx)
    print(f"Status: {r.status} OK!")
except Exception as e:
    print(f"Error: {e}")

print("\n=== Test HTTP ===")
try:
    r = urllib.request.urlopen("http://vannes-batteries.fr", timeout=10)
    print(f"{r.status} -> {r.url}")
except Exception as e:
    print(f"{e}")

print("\n=== Config files in CT ===")
print(run("pct exec 103 -- ls -la /opt/npm/data/nginx/proxy_host/"))

node.close()

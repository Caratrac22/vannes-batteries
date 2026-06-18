import paramiko, sys, io, json, time, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def ct(cmd):
    return run(f"pct exec 103 -- {cmd}")

# Write config file using docker cp via /tmp
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

  listen 80;
listen [::]:80;

listen 443 ssl http2;
listen [::]:443 ssl http2;

  server_name vannes-batteries.fr;

  include conf.d/include/letsencrypt-acme-challenge.conf;
  include conf.d/include/ssl-cache.conf;
  include conf.d/include/ssl-ciphers.conf;
  ssl_certificate /etc/letsencrypt/live/npm-21/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/npm-21/privkey.pem;

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

  # Custom
  include /data/nginx/custom/server_proxy[.]conf;
}
"""

# Write to host filesystem in CT 103
run("cat > /opt/npm/data/nginx/proxy_host/17.conf << 'EOFCFG'\n" + cfg + "EOFCFG")
print("Config file written via pct exec cat")

# Verify
print("\n=== Verify config file ===")
print(ct("cat /opt/npm/data/nginx/proxy_host/17.conf | head -5"))

# Test nginx
print("\n=== Nginx test ===")
print(ct("docker exec nginx-proxy-manager nginx -t 2>&1"))

# Reload nginx
print("\n=== Reload ===")
print(ct("docker exec nginx-proxy-manager nginx -s reload 2>&1"))
time.sleep(2)

# Test HTTPS
print("\n=== Test HTTPS ===")
try:
    import ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    r = urllib.request.urlopen("https://vannes-batteries.fr", timeout=15, context=ctx)
    print(f"  Status: {r.status} OK!")
except Exception as e:
    print(f"  {e}")

print("\n=== Test HTTP ===")
try:
    r = urllib.request.urlopen("http://vannes-batteries.fr", timeout=10)
    print(f"  {r.status} -> {r.url}")
except Exception as e:
    print(f"  {e}")
    
# Check config listing
print("\n=== All proxy configs ===")
print(ct("ls -la /opt/npm/data/nginx/proxy_host/"))

node.close()
print("DONE")

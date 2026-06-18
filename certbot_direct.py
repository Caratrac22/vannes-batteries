import paramiko, sys, io, base64, urllib.request, time, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=60):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def ctx(cmd):
    return run(f"pct exec 103 -- docker exec nginx-proxy-manager {cmd}")

# Step 1: Write a temp nginx config without SSL (port 80 only)
cfg_temp = """server {
  listen 80;
  listen [::]:80;
  server_name vannes-batteries.fr www.vannes-batteries.fr;
  return 200 "ok";
}
"""
data = base64.b64encode(cfg_temp.encode('utf-8')).decode('ascii')
run(f"echo '{data}' | base64 -d > /root/17.conf")
run("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")

# Remove any other config referencing npm-21
print("=== Remove/deactivate old SSL config ===")
print(ctx("rm -f /etc/letsencrypt/live/npm-21 2>/dev/null; echo removed || echo notfound"))
print(ctx("nginx -t 2>&1"))

# Reload nginx
print("\n=== Reload nginx ===")
print(ctx("nginx -s reload 2>&1"))
time.sleep(2)

# Check port 80 is working
print("\n=== Test HTTP temp config ===")
try:
    r = urllib.request.urlopen("http://vannes-batteries.fr", timeout=10)
    print(f"  Status: {r.status}")
except Exception as e:
    print(f"  {e}")

# Step 2: Run certbot standalone (nginx should be on port 80 only now)
print("\n=== Run certbot ===")
# First kill nginx to free port 80
print(ctx("nginx -s quit 2>&1 || kill $(cat /var/run/nginx.pid 2>/dev/null) 2>&1 || true"))
time.sleep(3)
# Check port 80 is free
print(ctx("ss -tlnp | grep ':80 ' || echo 'port 80 free'"))

print("\n=== Certbot standalone ===")
result = ctx("certbot certonly --standalone --non-interactive --agree-tos --email voltaltoprime@proton.me "
             "-d vannes-batteries.fr -d www.vannes-batteries.fr "
             "--config /etc/letsencrypt.ini --work-dir /tmp/letsencrypt-lib --logs-dir /data/logs 2>&1")
print(result)

# Start nginx
print("\n=== Start nginx ===")
print(ctx("nginx 2>&1"))

# Check cert
print("\n=== Check new cert files ===")
result = ctx("ls -la /etc/letsencrypt/live/")
print(result)

# Find cert that has both domains
lines = result.strip().split('\n')
for line in lines:
    if line.endswith('/'):
        name = line.split()[-1].rstrip('/')
        if name == 'vannes-batteries.fr':
            target = f"/etc/letsencrypt/live/{name}/"
            break
else:
    target = ctx("find /etc/letsencrypt/live -name 'fullchain.pem' | head -1")

print(f"\nTarget cert: {target}")

# Verify cert
print(ctx(f"openssl x509 -in {target}fullchain.pem -noout -subject -dates 2>&1"))

# Write final nginx config
cfg = f"""# ------------------------------------------------------------
# vannes-batteries.fr + www.vannes-batteries.fr
# ------------------------------------------------------------

server {{
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;

  listen 443 ssl;
  listen [::]:443 ssl;
  http2 on;

  server_name vannes-batteries.fr www.vannes-batteries.fr;

  ssl_certificate {target}fullchain.pem;
  ssl_certificate_key {target}privkey.pem;
  include conf.d/include/letsencrypt-acme-challenge.conf;
  include conf.d/include/ssl-cache.conf;
  include conf.d/include/ssl-ciphers.conf;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  location / {{
    include conf.d/include/proxy.conf;
  }}
}}

server {{
  listen 80;
  listen [::]:80;

  server_name vannes-batteries.fr www.vannes-batteries.fr;

  include conf.d/include/letsencrypt-acme-challenge.conf;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  if ($scheme = http) {{
    return 301 https://$host$request_uri;
  }}

  location / {{
    include conf.d/include/proxy.conf;
  }}
}}
"""
data = base64.b64encode(cfg.encode('utf-8')).decode('ascii')
run(f"echo '{data}' | base64 -d > /root/17.conf")
run("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")

# Nginx test and reload
print("\n=== Nginx test ===")
print(ctx("nginx -t 2>&1"))
print(ctx("nginx -s reload 2>&1"))
time.sleep(2)

# Test all
print("\n=== Testing all URLs ===")
import ssl
ctx2 = ssl.create_default_context()
ctx2.check_hostname = False
ctx2.verify_mode = ssl.CERT_NONE
for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr",
            "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
    try:
        r = urllib.request.urlopen(url, timeout=10, context=ctx2 if url.startswith("https") else None)
        body = r.read().decode('utf-8', errors='replace')
        title = body[body.find('<title>'):body.find('</title>')+8] if '<title>' in body else 'N/A'
        print(f"  {url}: {r.status} -> {r.url} ({title[:60]})")
    except Exception as e:
        print(f"  {url}: {e}")

# Clean up proxy host 16 config (redirect www to root, since root now handles www)
cfg16 = """server {
  listen 80;
  listen [::]:80;

  server_name www.vannes-batteries.fr;

  access_log /data/logs/proxy-host-16_access.log proxy;
  error_log /data/logs/proxy-host-16_error.log warn;

  return 301 https://vannes-batteries.fr$request_uri;
}
"""
data16 = base64.b64encode(cfg16.encode('utf-8')).decode('ascii')
run(f"echo '{data16}' | base64 -d > /root/16.conf")
run("pct push 103 /root/16.conf /opt/npm/data/nginx/proxy_host/16.conf")
ctx("nginx -s reload 2>&1")

node.close()

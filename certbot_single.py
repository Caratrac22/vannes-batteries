import paramiko, sys, io, base64, json, urllib.request, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=60):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def ctx(cmd):
    return run(f"pct exec 103 -- docker exec nginx-proxy-manager {cmd}")

# Keep HTTP-only config for ACME, create cert for vannes-batteries.fr only
cfg_acme = """server {
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;

  listen 80;
  listen [::]:80;

  server_name vannes-batteries.fr www.vannes-batteries.fr;

  include conf.d/include/letsencrypt-acme-challenge.conf;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  location / {
    include conf.d/include/proxy.conf;
  }
}
"""
data = base64.b64encode(cfg_acme.encode('utf-8')).decode('ascii')
run(f"echo '{data}' | base64 -d > /root/17.conf")
run("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")
print("HTTP-only config set")
ctx("nginx -t 2>&1")
ctx("nginx -s reload 2>&1")
time.sleep(2)

# Create cert for vannes-batteries.fr only
print("\n=== Certbot webroot for vannes-batteries.fr only ===")
result = ctx("certbot certonly --webroot -w /data/letsencrypt-acme-challenge "
             "--non-interactive --agree-tos --email voltaltoprime@proton.me "
             "-d vannes-batteries.fr "
             "--config /etc/letsencrypt.ini --work-dir /tmp/letsencrypt-lib --logs-dir /data/logs 2>&1")
print(result)

# Check cert
target = ctx("find /etc/letsencrypt/live -maxdepth 1 -type d -name 'vannes-batteries*' 2>/dev/null")
if not target:
    target = ctx("find /etc/letsencrypt/live -maxdepth 1 | tail -1")
target = target.strip().split('\n')[-1] + '/'
print(f"\nCert path: {target}")
print(ctx(f"openssl x509 -in {target}fullchain.pem -noout -subject -dates 2>&1"))

# Write final config with SSL for both domains (only vannes-batteries.fr actually has cert)
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

# Test + reload
print("\n=== Nginx test ===")
print(ctx("nginx -t 2>&1"))
print(ctx("nginx -s reload 2>&1"))
time.sleep(2)

# Test all with SSL
import ssl
print("\n=== Testing ===")
ctx2 = ssl.create_default_context()
ctx2.check_hostname = False
ctx2.verify_mode = ssl.CERT_NONE
for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr",
            "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
    try:
        r = urllib.request.urlopen(url, timeout=10, context=ctx2 if url.startswith("https") else None)
        print(f"  {url}: {r.status} -> {r.url}")
    except Exception as e:
        print(f"  {url}: {e}")

node.close()

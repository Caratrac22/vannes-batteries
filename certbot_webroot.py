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

# Remove 16.conf (www redirect interferes with ACME)
print("=== Remove 16.conf ===")
print(run("pct exec 103 -- rm /opt/npm/data/nginx/proxy_host/16.conf 2>&1 || true"))
print(run("pct exec 103 -- ls /opt/npm/data/nginx/proxy_host/16.conf 2>&1 || echo 'deleted'"))

# Update 17.conf to serve ACME for both domains via HTTP
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

# Reload nginx
print(ctx("nginx -t 2>&1"))
print(ctx("nginx -s reload 2>&1"))
time.sleep(2)

# Test both domains HTTP
print("\n=== HTTP test ===")
for url in ["http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
    try:
        r = urllib.request.urlopen(url, timeout=10)
        print(f"  {url}: {r.status} {len(r.read())} bytes")
    except Exception as e:
        print(f"  {url}: {e}")

# Run certbot
print("\n=== Certbot webroot ===")
result = ctx("certbot certonly --webroot -w /data/letsencrypt-acme-challenge "
             "--non-interactive --agree-tos --email voltaltoprime@proton.me "
             "-d vannes-batteries.fr -d www.vannes-batteries.fr "
             "--config /etc/letsencrypt.ini --work-dir /tmp/letsencrypt-lib --logs-dir /data/logs 2>&1")
print(result)

# Find new cert
print("\n=== Find new cert ===")
out = ctx("ls -la /etc/letsencrypt/live/")
print(out)

# Check which vannes-batteries.fr cert exists
target = "/etc/letsencrypt/live/vannes-batteries.fr/"
cert_check = ctx(f"ls {target}fullchain.pem 2>&1")
print(f"Cert check: {cert_check}")

if "No such" in cert_check:
    # Try to find by subject
    for line in out.strip().split('\n')[3:]:
        if '/live/' in line:
            name = line.split()[-1].rstrip('/')
            sub = ctx(f"openssl x509 -in /etc/letsencrypt/live/{name}/fullchain.pem -noout -subject 2>/dev/null")
            if 'vannes-batteries.fr' in sub or 'www' in sub:
                target = f"/etc/letsencrypt/live/{name}/"
                print(f"Found cert: {target}")
                break
else:
    print(f"Found direct: {target}")

if "No such" not in cert_check or target:
    print(ctx(f"openssl x509 -in {target}fullchain.pem -noout -subject -dates 2>&1"))

    # Write final config with SSL
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
    print("\n=== Final nginx test ===")
    print(ctx("nginx -t 2>&1"))
    print(ctx("nginx -s reload 2>&1"))
    time.sleep(2)

    # Test all
    import ssl
    print("\n=== Testing all URLs ===")
    ctx2 = ssl.create_default_context()
    ctx2.check_hostname = False
    ctx2.verify_mode = ssl.CERT_NONE
    for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr",
                "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
        try:
            r = urllib.request.urlopen(url, timeout=10, context=ctx2 if url.startswith("https") else None)
            body = r.read().decode('utf-8', errors='replace')
            title = body[body.find('<title>'):body.find('</title>')+8] if '<title>' in body else 'N/A'
            print(f"  {url}: {r.status} -> {r.url}")
        except Exception as e:
            print(f"  {url}: {e}")

node.close()

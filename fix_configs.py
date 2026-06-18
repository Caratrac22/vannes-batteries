import paramiko, sys, io, base64, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def write_ct(pth, content):
    data = base64.b64encode(content.encode('utf-8')).decode('ascii')
    run(f"echo '{data}' | base64 -d > /root/{pth.replace('/','_')}")
    run(f"pct push 103 /root/{pth.replace('/','_')} {pth}")

# Config for vannes-batteries.fr - $forward_scheme MUST be http (backend is HTTP)
cfg_root = """# ------------------------------------------------------------
# vannes-batteries.fr
# ------------------------------------------------------------

server {
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;

  listen 443 ssl;
  listen [::]:443 ssl;
  http2 on;

  server_name vannes-batteries.fr;

  ssl_certificate /etc/letsencrypt/live/npm-21/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/npm-21/privkey.pem;
  include conf.d/include/letsencrypt-acme-challenge.conf;
  include conf.d/include/ssl-cache.conf;
  include conf.d/include/ssl-ciphers.conf;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  location / {
    include conf.d/include/proxy.conf;
  }
}

server {
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;

  listen 80;
  listen [::]:80;

  server_name vannes-batteries.fr;

  include conf.d/include/letsencrypt-acme-challenge.conf;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  if ($scheme = http) {
    return 301 https://$host$request_uri;
  }

  location / {
    include conf.d/include/proxy.conf;
  }
}
"""

write_ct("/opt/npm/data/nginx/proxy_host/17.conf", cfg_root)
print("Config 17 rewritten")

# Nginx test
print("\n=== Nginx test ===")
print(run("pct exec 103 -- docker exec nginx-proxy-manager nginx -t 2>&1"))

# Reload
print("\n=== Reload ===")
print(run("pct exec 103 -- docker exec nginx-proxy-manager nginx -s reload 2>&1"))
time.sleep(2)

# Test
import ssl, urllib.request
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in ["https://vannes-batteries.fr", "http://vannes-batteries.fr"]:
    try:
        r = urllib.request.urlopen(url, timeout=10, context=ctx if url.startswith("https") else None)
        print(f"  {url}: {r.status} -> {r.url}")
        if r.status == 200:
            body = r.read().decode('utf-8', errors='replace')
            print(f"  Title: {body[body.find('<title>'):body.find('</title>')+8] if '<title>' in body else 'N/A'}")
    except Exception as e:
        print(f"  {url}: {e}")

# Also check the HTTP redirect (should redirect to HTTPS)
# Use no redirect
import http.client
conn = http.client.HTTPConnection("vannes-batteries.fr", 80, timeout=10)
conn.request("GET", "/", headers={"Host": "vannes-batteries.fr"})
resp = conn.getresponse()
print(f"\n  HTTP raw: {resp.status} -> {resp.getheader('Location', 'none')}")
conn.close()

node.close()

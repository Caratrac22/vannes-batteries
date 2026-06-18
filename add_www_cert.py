import paramiko, sys, io, base64, time, ssl, urllib.request
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=60)

def r(c):
    s, o, e = n.exec_command(c, timeout=60)
    return o.read().decode('utf-8', errors='replace').strip()

def ctx(c):
    return r(f"pct exec 103 -- docker exec nginx-proxy-manager {c}")

# Update 17.conf to HTTP-only (no SSL) so nginx can restart cleanly
cfg_http = """server {
  set $forward_scheme http;
  set $server         "192.168.1.62";
  set $port           3000;
  listen 80; listen [::]:80;
  server_name vannes-batteries.fr www.vannes-batteries.fr;
  include conf.d/include/letsencrypt-acme-challenge.conf;
  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;
  location / { include conf.d/include/proxy.conf; }
}"""
d = base64.b64encode(cfg_http.encode()).decode()
r(f"echo '{d}' | base64 -d > /root/17.conf")
r("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")
ctx("nginx -t 2>&1")
ctx("nginx -s reload 2>&1")
time.sleep(2)

print("=== Certbot webroot for both domains ===")
result = ctx("certbot certonly --webroot -w /data/letsencrypt-acme-challenge "
             "--non-interactive --agree-tos --email voltaltoprime@proton.me "
             "--expand -d vannes-batteries.fr -d www.vannes-batteries.fr "
             "--config /etc/letsencrypt.ini --work-dir /tmp/letsencrypt-lib --logs-dir /data/logs 2>&1")
print(result)

if "Successfully received" in result or "Certificate is saved" in result:
    cert_path = "/etc/letsencrypt/live/vannes-batteries.fr/"
    print(ctx(f"openssl x509 -in {cert_path}fullchain.pem -noout -subject -dates 2>&1"))

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

  ssl_certificate {cert_path}fullchain.pem;
  ssl_certificate_key {cert_path}privkey.pem;
  include conf.d/include/letsencrypt-acme-challenge.conf;
  include conf.d/include/ssl-cache.conf;
  include conf.d/include/ssl-ciphers.conf;

  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;

  location / {{ include conf.d/include/proxy.conf; }}
}}

server {{
  listen 80; listen [::]:80;
  server_name vannes-batteries.fr www.vannes-batteries.fr;
  include conf.d/include/letsencrypt-acme-challenge.conf;
  access_log /data/logs/proxy-host-17_access.log proxy;
  error_log /data/logs/proxy-host-17_error.log warn;
  if ($scheme = http) {{ return 301 https://$host$request_uri; }}
  location / {{ include conf.d/include/proxy.conf; }}
}}"""
    d2 = base64.b64encode(cfg.encode()).decode()
    r(f"echo '{d2}' | base64 -d > /root/17.conf")
    r("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")

    print(ctx("nginx -t 2>&1"))
    print(ctx("nginx -s reload 2>&1"))
    time.sleep(2)

    print("\n=== Tests ===")
    c2 = ssl.create_default_context(); c2.check_hostname = False; c2.verify_mode = ssl.CERT_NONE
    for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr",
                "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
        try:
            r2 = urllib.request.urlopen(url, timeout=10, context=c2 if url.startswith("https") else None)
            print(f"  {url}: {r2.status} -> {r2.url}")
        except Exception as e:
            print(f"  {url}: {e}")
else:
    print("Certbot failed, need to wait more")

n.close()

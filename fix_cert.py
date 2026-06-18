import paramiko, sys, io, json, urllib.request, time, base64

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

# Login with UI credentials and get a proper token
print("=== Login to NPM API ===")
login_data = {
    "identity": "voltaltoprime@proton.me",
    "secret": "ALEXhub14072023@#",
    "scope": "user"
}
req = urllib.request.Request(
    "http://192.168.1.58:81/api/tokens",
    data=json.dumps(login_data).encode('utf-8'),
    headers={"Content-Type": "application/json"},
    method="POST"
)
try:
    resp = urllib.request.urlopen(req, timeout=30)
    token_data = json.loads(resp.read().decode('utf-8'))
    token = token_data.get("token", "")
    print(f"Login OK, token: {token[:30]}...")
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8', errors='replace')
    print(f"Login failed: {e.code}: {body}")
    exit(1)

def npm(path, method="GET", data=None):
    url = f"http://192.168.1.58:81/api{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    if data:
        req.data = json.dumps(data).encode('utf-8')
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        return {"error": f"{e.code}: {body}"}

# List all proxy hosts
print("\n=== Proxy hosts ===")
hosts = npm("/nginx/proxy-hosts")
if isinstance(hosts, list):
    for h in hosts:
        print(f"  [{h['id']}] {h['domain_names']} enabled={h['enabled']} cert_id={h.get('certificate_id')}")
else:
    print(hosts)

# List all certs
print("\n=== Certificates ===")
certs = npm("/nginx/certificates")
if isinstance(certs, list):
    for c in certs:
        print(f"  [{c['id']}] {c['domain_names']} provider={c.get('provider')} provisioned={c.get('meta',{}).get('provisioned')}")
else:
    print(certs)

# Get cert 21 detail
print("\n=== Certificate 21 ===")
cert21 = npm("/nginx/certificates/21")
print(json.dumps(cert21, indent=2)[:500])

# Update cert 21 to include www
if "error" not in cert21:
    print("\n=== Update cert 21 to add www ===")
    cert21["domain_names"] = ["vannes-batteries.fr", "www.vannes-batteries.fr"]
    result = npm("/nginx/certificates/21", "PUT", cert21)
    if "error" in result:
        print(f"  Update failed: {result['error']}")
        # Maybe need to delete and recreate
        print("\n=== Deleting cert 21 ===")
        del_res = npm("/nginx/certificates/21", "DELETE")
        print(f"  Delete: {del_res.get('error', 'OK')}")
        
        print("\n=== Create new multi-domain cert ===")
        new_cert = npm("/nginx/certificates", "POST", {
            "domain_names": ["vannes-batteries.fr", "www.vannes-batteries.fr"],
            "letsencrypt_email": "voltaltoprime@proton.me",
            "letsencrypt_agree": True,
            "meta": {}
        })
        print(json.dumps(new_cert, indent=2))
        new_id = new_cert.get("id")
        
        if new_id:
            print("\n=== Wait for provisioning ===")
            for i in range(15):
                time.sleep(10)
                st = npm(f"/nginx/certificates/{new_id}")
                nice = st.get("nice_name", "")
                prov = st.get("meta", {}).get("provisioned", False)
                print(f"  [{i+1}] nice_name={nice} provisioned={prov}")
                if nice:
                    break
            
            if nice:
                # Create nginx configs with new cert path
                print(f"\n=== New cert path: /etc/letsencrypt/live/{nice}/ ===")
                # Write updated config
                node.close()
                
                # Now update config files
                import base64
                node2 = paramiko.SSHClient()
                node2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                node2.connect('100.70.136.90', username='root', password='alex', timeout=10)
                
                def run2(cmd):
                    s, o, e = node2.exec_command(cmd, timeout=30)
                    return o.read().decode('utf-8', errors='replace').strip()
                
                cert_path = f"/etc/letsencrypt/live/{nice}/"
                
                cfg_root = f"""# ------------------------------------------------------------
# vannes-batteries.fr
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
                data = base64.b64encode(cfg_root.encode('utf-8')).decode('ascii')
                run2(f"echo '{data}' | base64 -d > /root/17.conf")
                run2("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")
                
                # Test and reload
                print(run2("pct exec 103 -- docker exec nginx-proxy-manager nginx -t 2>&1"))
                print(run2("pct exec 103 -- docker exec nginx-proxy-manager nginx -s reload 2>&1"))
                time.sleep(2)
                
                # Test
                import ssl
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
                for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr", "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
                    try:
                        r = urllib.request.urlopen(url, timeout=10, context=ctx if url.startswith("https") else None)
                        print(f"  {url}: {r.status} -> {r.url}")
                    except Exception as e:
                        print(f"  {url}: {e}")
                
                node2.close()
    else:
        print(f"  Update OK")
else:
    print(f"Cannot get cert 21: {cert21.get('error')}")

# If update failed, try delete and recreate
print("\n=== Deleting cert 21 ===")
del_res = npm("/nginx/certificates/21", "DELETE")
print(f"  Delete result: {del_res}")

print("\n=== Create new multi-domain cert (attempt 1 - minimal) ===")
new_cert = npm("/nginx/certificates", "POST", {
    "domain_names": ["vannes-batteries.fr", "www.vannes-batteries.fr"],
    "provider": "letsencrypt"
})
if "error" in new_cert:
    print(f"Attempt 1 failed: {new_cert['error'][:200]}")
    print("\n=== Attempt 2 - with meta ===")
    new_cert = npm("/nginx/certificates", "POST", {
        "domain_names": ["vannes-batteries.fr", "www.vannes-batteries.fr"],
        "provider": "letsencrypt",
        "meta": {"dns_challenge": False}
    })
if "error" in new_cert:
    print(f"Attempt 2 failed: {new_cert['error'][:200]}")
    print("\n=== Attempt 3 - no provider, with LE fields ===")
    new_cert = npm("/nginx/certificates", "POST", {
        "domain_names": ["vannes-batteries.fr", "www.vannes-batteries.fr"],
        "letsencrypt_email": "voltaltoprime@proton.me",
        "letsencrypt_agree": True
    })
if "error" in new_cert:
    print(f"Attempt 3 failed: {new_cert['error'][:200]}")
    print("\n=== Attempt 4 - provider + LE fields ===")
    new_cert = npm("/nginx/certificates", "POST", {
        "domain_names": ["vannes-batteries.fr", "www.vannes-batteries.fr"],
        "provider": "letsencrypt",
        "letsencrypt_email": "voltaltoprime@proton.me",
        "letsencrypt_agree": True
    })

print(json.dumps(new_cert, indent=2))
new_id = new_cert.get("id")

if new_id:
    print(f"\n=== New cert ID: {new_id} ===")
    for i in range(15):
        time.sleep(10)
        st = npm(f"/nginx/certificates/{new_id}")
        if "error" in st:
            print(f"  [{i+1}] Error: {st['error']}")
            continue
        nice = st.get("nice_name", "")
        prov = st.get("meta", {}).get("provisioned", False)
        print(f"  [{i+1}] nice_name={nice} provisioned={prov}")
        if nice:
            break
    
    if nice:
        cert_path = f"/etc/letsencrypt/live/{nice}/"
        print(f"\n=== New cert path: {cert_path} ===")
        
        # Update nginx config
        node2 = paramiko.SSHClient()
        node2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        node2.connect('100.70.136.90', username='root', password='alex', timeout=10)
        
        def run2(cmd):
            s, o, e = node2.exec_command(cmd, timeout=30)
            return o.read().decode('utf-8', errors='replace').strip()
        
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
        run2(f"echo '{data}' | base64 -d > /root/17.conf")
        run2("pct push 103 /root/17.conf /opt/npm/data/nginx/proxy_host/17.conf")
        
        # Test and reload
        print(run2("pct exec 103 -- docker exec nginx-proxy-manager nginx -t 2>&1"))
        print(run2("pct exec 103 -- docker exec nginx-proxy-manager nginx -s reload 2>&1"))
        time.sleep(2)
        
        # Test all URLs
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr", "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
            try:
                r = urllib.request.urlopen(url, timeout=10, context=ctx if url.startswith("https") else None)
                print(f"  {url}: {r.status} -> {r.url}")
            except Exception as e:
                print(f"  {url}: {e}")
        
        node2.close()

node.close()

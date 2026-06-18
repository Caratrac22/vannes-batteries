import paramiko, sys, io, json, urllib.request, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

token = run("pct exec 103 -- sqlite3 /opt/npm/data/database.sqlite \"SELECT value FROM auth WHERE type='token' LIMIT 1\"").strip()
print(f"Token: {token[:20]}...")

npm_api = "http://192.168.1.58:81/api"

def npm(path, method="GET", data=None):
    url = f"{npm_api}{path}"
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
print("=== Current proxy hosts ===")
hosts = npm("/nginx/proxy-hosts")
if isinstance(hosts, list):
    for h in hosts:
        print(f"  [{h['id']}] {h['domain_names']} cert_id={h.get('certificate_id')}")
else:
    print(hosts)

# List all certs
print("\n=== Current certs ===")
certs = npm("/nginx/certificates")
if isinstance(certs, list):
    for c in certs:
        print(f"  [{c['id']}] domains={c['domain_names']} provider={c.get('provider')} meta={c.get('meta',{}).get('dns_challenge')}")
else:
    print(certs)

# Check if proxy 16 and 17 exist at all
print("\n=== Proxy host 16 ===")
print(json.dumps(npm("/nginx/proxy-hosts/16"), indent=2)[:300])
print("\n=== Proxy host 17 ===")
print(json.dumps(npm("/nginx/proxy-hosts/17"), indent=2)[:300])

# Create cert with correct format
print("\n=== Create new LE cert ===")
cert_data = {
    "domain_names": ["vannes-batteries.fr", "www.vannes-batteries.fr"],
    "letsencrypt_email": "voltaltoprime@proton.me",
    "letsencrypt_agree": True,
    "provider": "letsencrypt",
    "meta": {"dns_challenge": False}
}
new_cert = npm("/nginx/certificates", "POST", cert_data)
print(json.dumps(new_cert, indent=2))
new_cert_id = new_cert.get("id")

if new_cert_id and not new_cert.get("error"):
    print(f"\nNew cert ID: {new_cert_id}")
    for i in range(15):
        time.sleep(5)
        st = npm(f"/nginx/certificates/{new_cert_id}")
        nice = st.get("nice_name", "")
        prov = st.get("meta", {}).get("provisioned", False)
        print(f"  [{i+1}] nice_name={nice} provisioned={prov}")
        if nice:
            break
    
    print(f"Final: {json.dumps(st, indent=2)}")
    nice = st.get("nice_name", "")
    print(f"\n=== Check cert path: /etc/letsencrypt/live/{nice}/ ===")
    print(run(f"pct exec 103 -- docker exec nginx-proxy-manager ls -la /etc/letsencrypt/live/{nice}/"))

node.close()

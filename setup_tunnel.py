import json, urllib.request, sys, paramiko, io, base64, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

CF_TOKEN = "cfat_amr1ZYNuf5ZaL9xlH6qkW2kk1z9Tb0iUJ7dt1QDM6f9cdd12"
ACCOUNT_ID = "c701d2ed2277751a557fb471467c1c00"
TUNNEL_ID = "fb562011-5f39-4a9c-8a5a-7808e02835bc"

def api(method, path, data=None):
    req = urllib.request.Request(f"https://api.cloudflare.com/client/v4/{path}")
    req.add_header("Authorization", f"Bearer {CF_TOKEN}")
    req.add_header("Content-Type", "application/json")
    if data:
        req.data = json.dumps(data).encode()
    req.method = method
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return json.loads(resp.read().decode())
    except Exception as e:
        err_body = ""
        if hasattr(e, 'read'):
            err_body = e.read().decode()[:500]
        return {"error": str(e)[:200], "code": getattr(e, 'code', 0), "body": err_body}

print("=== 1. Token tunnel ===")
result = api("GET", f"accounts/{ACCOUNT_ID}/cfd_tunnel/{TUNNEL_ID}/token")
if result.get("success") and result.get("result"):
    tunnel_token = result["result"]
    print(f"Token OK ({len(tunnel_token)} chars)")
else:
    print(f"Erreur: {json.dumps(result)[:300]}")
    exit(1)

print("=== 2. SSH Proxmox ===")
node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)
sftp = node.open_sftp()

print("  Connecte")

# Write credentials.json via pct push (using temp file on host)
creds = json.dumps({
    "AccountTag": ACCOUNT_ID,
    "TunnelID": TUNNEL_ID,
    "TunnelName": "vannes-batteries-tunnel",
    "TunnelSecret": tunnel_token
}, indent=2)

# Write temp file on Proxmox
with sftp.open('/tmp/tunnel_creds.json', 'w') as f:
    f.write(creds)

# Write config.yml on Proxmox
config = f"""tunnel: {TUNNEL_ID}
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - hostname: vb.alexhub.shop
    service: http://localhost:3000
  - hostname: www.vannes-batteries.fr
    service: http://localhost:3000
  - hostname: vannes-batteries.fr
    service: http://localhost:3000
  - service: http_status:404
"""
with sftp.open('/tmp/tunnel_config.yml', 'w') as f:
    f.write(config)

# Write service file on Proxmox
service = """[Unit]
Description=Cloudflare Tunnel - vannes-batteries
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloudflared tunnel run
Restart=on-failure
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
"""
with sftp.open('/tmp/cloudflared-vb.service', 'w') as f:
    f.write(service)

sftp.close()

print("  Fichiers uploades sur Proxmox")

# Run commands on CT via Proxmox
def ct(cmd, timeout=20):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

# Create directory
ct('pct exec 100 -- mkdir -p /etc/cloudflared')

# Copy files to CT
ct('pct push 100 /tmp/tunnel_creds.json /etc/cloudflared/credentials.json')
ct('pct push 100 /tmp/tunnel_config.yml /etc/cloudflared/config.yml')
ct('pct push 100 /tmp/cloudflared-vb.service /etc/systemd/system/cloudflared-vb.service')
ct('pct exec 100 -- chmod 600 /etc/cloudflared/credentials.json')
print("  Fichiers copies sur CT")

# Setup service
ct('pct exec 100 -- systemctl daemon-reload')
ct('pct exec 100 -- systemctl stop cloudflared 2>/dev/null; pct exec 100 -- systemctl disable cloudflared 2>/dev/null')
ct('pct exec 100 -- systemctl enable cloudflared-vb')
print("  Service cree")

print("=== 3. Demarrage ===")
out = ct('pct exec 100 -- systemctl restart cloudflared-vb 2>&1')
print(f"  Restart: {out[:200]}")
time.sleep(3)
out = ct('pct exec 100 -- systemctl status cloudflared-vb --no-pager -l 2>&1 | head -15')
print(f"\n{out}")

print("\n=== 4. Verification locale ===")
out = ct('pct exec 100 -- curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null')
print(f"  localhost:3000 -> HTTP {out}")
out = ct("pct exec 100 -- ps aux | grep cloudflared | grep -v grep | awk '{print $2, $11}'")
print(f"  Process: {out[:200]}")

node.close()
print("\nDONE")

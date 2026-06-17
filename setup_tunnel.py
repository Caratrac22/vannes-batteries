import paramiko
import sys
import io
import json
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

API_TOKEN = "cfat_amr1ZYNuf5ZaL9xlH6qkW2kk1z9Tb0iUJ7dt1QDM6f9cdd12"
ACCOUNT_ID = "c701d2ed2277751a557fb471467c1c00"
DOMAIN = "vannes-batteries.fr"

def api_call(method, url, data=None):
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(url, method=method, headers=headers)
    if data:
        req.data = json.dumps(data).encode()
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"API Error {e.code}: {body}")
        return json.loads(body) if body else {}

# 1. List zones
print("=== ZONES ===")
result = api_call("GET", f"https://api.cloudflare.com/client/v4/zones?name={DOMAIN}")
zone_id = None
if result.get("result"):
    zone_id = result["result"][0]["id"]
    print(f"Zone ID: {zone_id}")
    print(f"Nameservers: {result['result'][0].get('name_servers')}")
    print(f"Status: {result['result'][0].get('status')}")
else:
    print("Zone not found, listing all zones...")
    result2 = api_call("GET", "https://api.cloudflare.com/client/v4/zones")
    for z in result2.get("result", []):
        print(f"  {z['name']} (id: {z['id']}, status: {z['status']})")

if not zone_id:
    print("ERROR: Domain not on Cloudflare yet")
    sys.exit(1)

# 2. Create tunnel
print("\n=== CREATE TUNNEL ===")
result = api_call("POST", f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/cfd_tunnel", {
    "name": "vannes-batteries-tunnel",
    "tunnel_secret": None
})
print(json.dumps(result, indent=2))

if result.get("success"):
    tunnel_id = result["result"]["id"]
    tunnel_token = result["result"]["token"]
    print(f"\nTunnel ID: {tunnel_id}")
    print(f"Token: {tunnel_token[:20]}...")
    
    # 3. Configure tunnel route
    print("\n=== CONFIGURE ROUTE ===")
    result = api_call("PUT", f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/cfd_tunnel/{tunnel_id}/configurations", {
        "config": {
            "ingress": [
                {
                    "hostname": DOMAIN,
                    "service": "http://192.168.1.62:3000"
                },
                {
                    "hostname": f"www.{DOMAIN}",
                    "service": "http://192.168.1.62:3000"
                },
                {
                    "service": "http_status:404"
                }
            ]
        }
    })
    print(json.dumps(result, indent=2))
    
    # 4. Add DNS CNAME records
    print("\n=== ADD DNS RECORDS ===")
    for subdomain in ["@", "www"]:
        result = api_call("POST", f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records", {
            "type": "CNAME",
            "name": subdomain,
            "content": f"{tunnel_id}.cfargotunnel.com",
            "proxied": True
        })
        print(f"{subdomain} -> {result.get('success', False)}")
        if not result.get("success"):
            print(json.dumps(result, indent=2))
    
    # 5. Delete old A records
    print("\n=== DELETE OLD RECORDS ===")
    result = api_call("GET", f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records?per_page=100")
    for rec in result.get("result", []):
        if rec["type"] == "A" or (rec["type"] == "CNAME" and rec["name"] == "www"):
            del_result = api_call("DELETE", f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{rec['id']}")
            print(f"Deleted {rec['type']} {rec['name']} -> {del_result.get('success')}")
    
    print(f"\n=== TUNNEL TOKEN (for cloudflared) ===")
    print(tunnel_token)
else:
    print("Failed to create tunnel")

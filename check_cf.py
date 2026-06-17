import json
import urllib.request

API_TOKEN = "cfat_amr1ZYNuf5ZaL9xlH6qkW2kk1z9Tb0iUJ7dt1QDM6f9cdd12"
ACCOUNT_ID = "c701d2ed2277751a557fb471467c1c00"

def api_call(url):
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"Error {e.code}: {body}")
        return json.loads(body) if body else {}

# Try account-level zones
print("=== Account zones ===")
r = api_call(f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/zones")
print(json.dumps(r, indent=2)[:2000])

# Try list all zones
print("\n=== All zones (direct) ===")
r = api_call("https://api.cloudflare.com/client/v4/zones")
for z in r.get("result", []):
    print(f"  {z['name']} -> {z['id']} ({z['status']})")

# Try token permissions
print("\n=== Token permissions ===")
r = api_call(f"https://api.cloudflare.com/client/v4/user/tokens/detail")
if r.get("success"):
    policies = r.get("result", {}).get("policies", [])
    for p in policies:
        print(f"  Permission: {p}")

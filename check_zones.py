import json, urllib.request, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

CF_TOKEN = "cfat_oNkoK44U5SxQCQkQ7YabYuQqogB8qhumrMPUE6iy0e9b13f9"
ZONE_ID = "eae1bbc9e1027906d7ef9b455a595651"

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
    except urllib.error.HTTPError as e:
        return {"_error": True, "code": e.code, "body": e.read().decode()[:500]}
    except Exception as e:
        return {"_error": True, "msg": str(e)[:200]}

print("=== Zone details ===")
result = api("GET", f"zones/{ZONE_ID}")
if result.get("_error"):
    print(f"Erreur: {result}")
else:
    z = result.get("result", {})
    print(f"  name={z.get('name')}, status={z.get('status')}")
    print(f"  ns={z.get('name_servers')}")
    print(f"  paused={z.get('paused')}, verified={z.get('original_registrar')}")

print("\n=== DNS records ===")
result = api("GET", f"zones/{ZONE_ID}/dns_records")
if result.get("_error"):
    print(f"Erreur: {result}")
else:
    for r in result.get("result", []):
        print(f"  {r['type']:5} {r['name']:40} -> {r['content']:30} proxied={r.get('proxied', False)}")
    if not result.get("result"):
        print("  (aucun enregistrement)")

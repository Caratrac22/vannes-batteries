import urllib.request, ssl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Fetch www HTML and look for Wix markers
r = urllib.request.urlopen("https://www.vannes-batteries.fr", timeout=15, context=ctx)
body = r.read().decode('utf-8', errors='replace')
print(f"Server: {r.headers.get('Server')}")
print(f"Length: {len(body)}")
print("--- First 2000 chars ---")
print(body[:2000])
print("--- Last 500 chars ---")
print(body[-500:])

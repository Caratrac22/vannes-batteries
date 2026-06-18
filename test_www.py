import paramiko, sys, io, urllib.request, ssl

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Check content of www vs root
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr"]:
    r = urllib.request.urlopen(url, timeout=10, context=ctx)
    body = r.read().decode('utf-8', errors='replace')
    title = body[body.find('<title>'):body.find('</title>')+8] if '<title>' in body else 'N/A'
    has_nextjs = 'id=\"__next\"' in body or '_N_E' in body
    print(f"{url}:")
    print(f"  Status: {r.status}")
    print(f"  Server: {r.headers.get('Server', '?')}")
    print(f"  Title: {title}")
    print(f"  Next.js app: {has_nextjs}")
    print(f"  Length: {len(body)}")
    # Check for Wix-specific content
    if 'wix' in body.lower()[:10000]:
        print(f"  Wix content detected!")
    else:
        print(f"  No Wix content (good)")
    print()

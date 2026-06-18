import urllib.request, ssl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in [
    "https://vannes-batteries.fr/robots.txt",
    "https://www.vannes-batteries.fr/robots.txt",
    "https://vannes-batteries.fr/sitemap.xml",
    "https://www.vannes-batteries.fr/sitemap.xml",
    "https://www.vannes-batteries.fr/sitemap-0.xml",
]:
    try:
        r = urllib.request.urlopen(url, timeout=10, context=ctx)
        body = r.read().decode('utf-8', errors='replace')
        print(f"\n=== {url} ({r.status}) ===")
        print(body[:1000])
    except Exception as e:
        print(f"\n=== {url} === ERROR: {e}")

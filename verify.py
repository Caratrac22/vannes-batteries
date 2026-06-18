import urllib.request, ssl, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE

for url in ["https://vannes-batteries.fr", "https://www.vannes-batteries.fr",
            "http://vannes-batteries.fr", "http://www.vannes-batteries.fr"]:
    try:
        r = urllib.request.urlopen(url, timeout=10, context=ctx if url.startswith("https") else None)
        body = r.read(50000).decode('utf-8', errors='replace')
        title = body[body.find('<title>'):body.find('</title>')+8] if '<title>' in body else 'N/A'
        has_footer = 'VANNES BATTERIES' in body[-10000:]
        has_youtube = 'youtube' in body.lower() or 'kbaoiROYaB4' in body
        has_wix = 'wix' in body[:5000].lower()
        print(f"  {url}: {r.status}")
        print(f"    title: {title[:70]}")
        print(f"    YouTube embed: {'✅' if has_youtube else '❌'}")
        print(f"    Wix content: {'⚠️' if has_wix else '✅ clean'}")
    except Exception as e:
        print(f"  {url}: {type(e).__name__}: {e}")
    print()

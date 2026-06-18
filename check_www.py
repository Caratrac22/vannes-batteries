import paramiko, sys, io, urllib.request, ssl

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=10)
s,o,e = n.exec_command("curl -s -I http://www.vannes-batteries.fr 2>&1", timeout=30)
print("=== From Proxmox ===")
print(o.read().decode(errors='replace')[:500])

s2,o2,e2 = n.exec_command("curl -s -I https://www.vannes-batteries.fr 2>&1", timeout=30)
print("=== From Proxmox (HTTPS) ===")
print(o2.read().decode(errors='replace')[:500])

# Check DNS from different resolvers
s3,o3,e3 = n.exec_command("nslookup www.vannes-batteries.fr 8.8.8.8 2>&1", timeout=30)
print("=== DNS Google ===")
print(o3.read().decode(errors='replace')[:300])

s4,o4,e4 = n.exec_command("nslookup www.vannes-batteries.fr 1.1.1.1 2>&1", timeout=30)
print("=== DNS Cloudflare ===")
print(o4.read().decode(errors='replace')[:300])

n.close()

# Check from local
print("\n=== Local test ===")
for url in ["http://www.vannes-batteries.fr", "https://www.vannes-batteries.fr"]:
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        r = urllib.request.urlopen(url, timeout=10, context=ctx if url.startswith("https") else None)
        body = r.read(5000).decode('utf-8', errors='replace')
        title = body[body.find('<title>'):body.find('</title>')+8] if '<title>' in body else 'N/A'
        print(f"  {url}: {r.status} title={title[:80]}")
    except Exception as ex:
        print(f"  {url}: {type(ex).__name__}: {ex}")

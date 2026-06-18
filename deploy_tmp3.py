import paramiko, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=60)

def run(cmd):
    s,o,e = n.exec_command(cmd, timeout=300)
    return (o.read()+e.read()).decode('utf-8', errors='replace')

print("=== Git pull ===")
print(run("pct exec 100 -- git -C /opt/vannes-batteries fetch origin"))
print(run("pct exec 100 -- git -C /opt/vannes-batteries reset --hard origin/master"))
print(run("pct exec 100 -- git -C /opt/vannes-batteries log --oneline -3"))

print("=== Build ===")
print(run("pct exec 100 -- bash -c 'cd /opt/vannes-batteries && npm run build 2>&1'"))

print("=== PM2 restart ===")
print(run("pct exec 100 -- pm2 restart vannes-batteries"))

print("=== HTTP check ===")
print(run("pct exec 100 -- curl -so /dev/null -w 'HTTP: %{http_code}' https://www.vannes-batteries.fr/"))

print("=== CSP check ===")
print(run("pct exec 100 -- curl -sI https://www.vannes-batteries.fr/ | head -15"))

n.close()

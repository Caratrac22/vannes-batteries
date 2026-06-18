import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=300)

def run(cmd):
    s,o,e = n.exec_command(cmd, timeout=300)
    out = o.read().decode('utf-8', errors='replace')
    err = e.read().decode('utf-8', errors='replace')
    return out + err

# Step 1: git fetch + pull
print("=== Git fetch + pull ===")
print(run("pct exec 100 -- bash -c 'cd /opt/vannes-batteries && git fetch origin && git log --oneline -3 origin/master'"))

# Force pull
print("\n=== Git pull ===")
print(run("pct exec 100 -- bash -c 'cd /opt/vannes-batteries && git reset --hard origin/master && git log --oneline -3'"))

# Step 2: Check YouTubeEmbed exists now
print("\n=== YouTubeEmbed check ===")
print(run("pct exec 100 -- ls -la /opt/vannes-batteries/components/ui/YouTubeEmbed.tsx 2>&1"))

# Step 3: Build
print("\n=== Build ===")
print(run("pct exec 100 -- bash -c 'cd /opt/vannes-batteries && npm run build 2>&1'"))

# Step 4: Restart PM2
print("\n=== PM2 restart ===")
print(run("pct exec 100 -- pm2 restart vannes-batteries"))

n.close()

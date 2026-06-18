import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=180)

def r(c):
    s, o, e = n.exec_command(c, timeout=180)
    return o.read().decode('utf-8', errors='replace')

cmd = "pct exec 100 -- bash -c 'cd /opt/vannes-batteries && git pull && npm run build && pm2 restart vannes-batteries'"
print(r(cmd))
n.close()

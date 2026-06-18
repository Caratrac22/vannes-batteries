import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=30)
s,o,e = n.exec_command("pct exec 100 -- bash -c 'cd /opt/vannes-batteries && git pull && npm run build && pm2 restart vannes-batteries'", timeout=300)
print(o.read().decode(errors='replace'))
n.close()

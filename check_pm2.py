import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=10)

s, o, e = n.exec_command("pct exec 100 -- pm2 show vannes-batteries", timeout=30)
print(o.read().decode())
n.close()

import paramiko
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

cmd = "pct exec 100 -- curl -sI http://localhost:3000/"
stdin, stdout, stderr = node.exec_command(cmd, timeout=30)
headers = stdout.read().decode('utf-8', errors='replace')
for line in headers.split('\n'):
    low = line.lower().strip()
    if any(k in low for k in ['content-security', 'x-frame', 'x-content', 'strict-transport', 'permissions', 'http/']):
        print(line.strip())

node.close()

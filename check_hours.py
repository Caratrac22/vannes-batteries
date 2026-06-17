import paramiko
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

stdin, stdout, stderr = node.exec_command('pct exec 100 -- curl -s http://localhost:3000/api/hours', timeout=30)
out = stdout.read().decode('utf-8', errors='replace')
print(out[:1000])
node.close()

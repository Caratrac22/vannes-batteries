import paramiko
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def run_pct(node, ctid, cmd):
    pct_cmd = f"pct exec {ctid} -- bash -c \"{cmd}\""
    stdin, stdout, stderr = node.exec_command(pct_cmd, timeout=600)
    return stdout.read().decode('utf-8', errors='replace'), stderr.read().decode('utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

steps = [
    ('RESET', 'cd /opt/vannes-batteries && git fetch origin && git reset --hard origin/master && git clean -fd'),
    ('INSTALL', 'cd /opt/vannes-batteries && npm install 2>&1 | tail -5'),
    ('BUILD', 'cd /opt/vannes-batteries && npm run build 2>&1 | tail -8'),
    ('RESTART', 'cd /opt/vannes-batteries && pm2 restart vannes-batteries && pm2 save'),
]

for label, cmd in steps:
    print(f'\n=== {label} ===')
    out, err = run_pct(node, 100, cmd)
    if out.strip(): print(out.strip())
    if err.strip(): print('ERR:', err.strip())

time.sleep(3)
out, err = run_pct(node, 100, 'curl -sI http://localhost:3000 | head -3')
print(f'\n=== SITE === {out.strip()}')
node.close()
print('\n=== DONE ===')

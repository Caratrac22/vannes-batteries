import paramiko, sys, io, json, time, base64

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def ct(cmd):
    return run(f"pct exec 103 -- {cmd}")

# First check the correct path
print("=== Check NPM data dir ===")
print(ct("ls /opt/npm/data/nginx/proxy_host/ 2>/dev/null || echo 'no /opt/npm'"))
print(ct("ls /opt/ 2>/dev/null"))
print(ct("docker inspect nginx-proxy-manager --format='{{range .Mounts}}{{.Source}} -> {{.Destination}}{{\"\\n\"}}{{end}}' 2>/dev/null"))

# Check what path the data is on
print("\n=== Docker volume ===")
print(ct("docker volume inspect npm_data 2>/dev/null || docker volume ls"))

# Find the actual mount point
print("\n=== Find NPM volume ===")
print(ct("mount | grep npm 2>/dev/null | head -5"))
print(ct("ls /var/lib/docker/volumes/npm_data/_data/nginx/proxy_host/ 2>/dev/null | head -10"))
print(ct("ls -la /var/lib/docker/volumes/ 2>/dev/null | head -10"))

node.close()

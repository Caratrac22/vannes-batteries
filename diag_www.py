import paramiko, sys, io, urllib.request, ssl

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

n = paramiko.SSHClient()
n.set_missing_host_key_policy(paramiko.AutoAddPolicy())
n.connect('100.70.136.90', username='root', password='alex', timeout=10)

# Test from Proxmox directly against NPM's internal IP
def run(cmd):
    s,o,e = n.exec_command(cmd, timeout=30)
    return o.read().decode(errors='replace')

# Test www from Proxmox (via external IP)
print("=== curl www via external IP ===")
print(run("curl -sk -o /dev/null -w 'Status: %{http_code} Server: %{server}\n' https://www.vannes-batteries.fr 2>&1"))

# Test www from Proxmox via internal NPM IP
print("\n=== curl www via NPM internal IP (Host header) ===")
print(run("curl -sk -o /dev/null -w 'Status: %{http_code} Server: %{server}\n' -H 'Host: www.vannes-batteries.fr' https://192.168.1.58 2>&1"))

# Test root from Proxmox
print("\n=== curl root via external IP ===")
print(run("curl -sk -o /dev/null -w 'Status: %{http_code} Server: %{server}\n' https://vannes-batteries.fr 2>&1"))

# Check iptables on Proxmox
print("\n=== iptables NAT ===")
print(run("iptables -t nat -L -n 2>/dev/null | head -30 || echo 'no iptables'"))

# Check nginx configs
print("\n=== Nginx configs in use ===")
print(run("pct exec 103 -- ls -la /opt/npm/data/nginx/proxy_host/"))

# Check default host config
print("\n=== NPM default host ===")
print(run("pct exec 103 -- cat /opt/npm/data/nginx/default_host/*.conf 2>/dev/null | head -20"))

# Check what nginx default server is
print("\n=== Nginx default server config ===")
print(run("pct exec 103 -- grep -r 'default_server' /etc/nginx/ /data/nginx/ --include='*.conf' 2>/dev/null | head -10"))

n.close()

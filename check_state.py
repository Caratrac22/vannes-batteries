import paramiko, sys, io, json, base64, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=30):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

# Check container status
print("=== Container status ===")
print(run("pct exec 103 -- docker ps --filter name=nginx-proxy-manager --format '{{.ID}} {{.Status}} {{.Ports}}'"))

# Check database content
print("\n=== Database: proxy hosts ===")
print(run("pct exec 103 -- sqlite3 /opt/npm/data/database.sqlite \"SELECT id, domain_names, certificate_id FROM proxy_host\" 2>/dev/null || echo 'no table'"))

print("\n=== Database: certificates ===")
print(run("pct exec 103 -- sqlite3 /opt/npm/data/database.sqlite \"SELECT id, domain_names, nice_name, provider FROM certificate\" 2>/dev/null || echo 'no table'"))

# Check if proxy_host table has different name
print("\n=== All tables ===")
print(run("pct exec 103 -- sqlite3 /opt/npm/data/database.sqlite \".tables\" 2>/dev/null"))

# Check schema of tables
print("\n=== Proxy host table schema ===")
print(run("pct exec 103 -- sqlite3 /opt/npm/data/database.sqlite \".schema proxy_host\" 2>/dev/null"))

print("\n=== Certificate table schema ===")
print(run("pct exec 103 -- sqlite3 /opt/npm/data/database.sqlite \".schema certificate\" 2>/dev/null"))

# Check NPM logs for errors
print("\n=== NPM backend logs (last 20) ===")
print(run("pct exec 103 -- docker logs nginx-proxy-manager --tail 20 2>&1"))

# Try direct container inspect
print("\n=== Container inspect ===")
print(run("pct exec 103 -- docker inspect nginx-proxy-manager --format='{{.State.Status}} {{.State.StartedAt}}'"))

node.close()

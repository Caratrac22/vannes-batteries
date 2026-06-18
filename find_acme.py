import paramiko, sys, io, base64, json, urllib.request, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=10)

def run(cmd, timeout=60):
    stdin, stdout, stderr = node.exec_command(cmd, timeout=timeout)
    return stdout.read().decode('utf-8', errors='replace').strip()

def ctx(cmd):
    return run(f"pct exec 103 -- docker exec nginx-proxy-manager {cmd}")

# Find the acme challenge include file
print("=== ACME challenge config ===")
print(ctx("cat /etc/nginx/conf.d/include/letsencrypt-acme-challenge.conf 2>/dev/null || find /etc/nginx -name '*.conf' -exec grep -l 'acme\\|challenge' {} \\; 2>/dev/null"))

# Check NPM default config for acme root
print("\n=== Default host config ===")
print(ctx("cat /data/nginx/default_host/*.conf 2>/dev/null | head -30"))

# Look at the actual NPM nginx include for the acme challenge
print("\n=== Scan for webroot ===")
print(ctx("grep -r 'acme\\|webroot\\|well-known' /etc/nginx/ /data/nginx/ 2>/dev/null | head -10"))

# Also check if standalone mode uses the default location
print("\n=== Check /tmp/letsencrypt ===")
print(ctx("ls -la /tmp/letsencrypt-www/ 2>/dev/null || ls -la /tmp/letsencrypt*/ 2>/dev/null || echo 'no default dir'"))
print(ctx("cat /etc/letsencrypt.ini 2>/dev/null | head -20"))

# Let me just check NPM's internal script for cert renewal
print("\n=== NPM SSL module ===")
print(ctx("find /app -name '*.js' -path '*/ssl*' 2>/dev/null | head -5"))

# Or just check the NPM backend source for the cert creation logic
print("\n=== NPM backend cert creation ===")
print(ctx("grep -r 'certbot' /app/ 2>/dev/null | head -20"))

# Let me check if there's a certbot wrapper in NPM
print("\n=== NPM internal cert scripts ===")
print(ctx("ls /app/ 2>/dev/null | head -20"))

# Actually, let me just check the NPM backend API for schema validation
print("\n=== NPM routes ===")
print(ctx("grep -r 'certificate' /app/backend/routes/ 2>/dev/null | head -20"))
print(ctx("grep -r 'joi.*certificate\\|schema.*certificate\\|certificate.*schema' /app/backend/ 2>/dev/null | head -10"))

node.close()

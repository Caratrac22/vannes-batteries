import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

node = paramiko.SSHClient()
node.set_missing_host_key_policy(paramiko.AutoAddPolicy())
node.connect('100.70.136.90', username='root', password='alex', timeout=15)

def run_pct(node, ctid, cmd):
    pct_cmd = f"pct exec {ctid} -- bash -c \"{cmd}\""
    stdin, stdout, stderr = node.exec_command(pct_cmd, timeout=30)
    return stdout.read().decode('utf-8', errors='replace'), stderr.read().decode('utf-8', errors='replace')

# 1. Call API with correct field mask
print("=== GOOGLE API WITH HEADER ===")
out, err = run_pct(node, 100, """curl -s "https://places.googleapis.com/v1/places/ChIJleF5jcIeEEgRYzVDrJbLPoA?key=AIzaSyBNM3tQSFO9kTTUVo5W26BW5i9JHDw-vc0&languageCode=fr" \
  -H "X-Goog-FieldMask: currentOpeningHours.openNow,currentOpeningHours.weekdayDescriptions,regularOpeningHours.weekdayDescriptions,businessStatus" 2>&1""")
print(out.strip())

# 2. Call OLD API
print("\n=== OLD API (place details) ===")
out, err = run_pct(node, 100, """curl -s "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJleF5jcIeEEgRYzVDrJbLPoA&key=AIzaSyBNM3tQSFO9kTTUVo5W26BW5i9JHDw-vc0&language=fr&fields=opening_hours" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result',{}); oh=r.get('opening_hours',{}); print('open_now:', oh.get('open_now')); print('weekday_text:', oh.get('weekday_text'))" 2>&1""")
print(out.strip())

# 3. What time is it in France now?
print("\n=== TIME IN FRANCE ===")
out, err = run_pct(node, 100, "TZ=Europe/Paris date")
print(out.strip())

node.close()

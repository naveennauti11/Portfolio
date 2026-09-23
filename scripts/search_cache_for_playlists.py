import os
import glob
import re

cache_dirs = [
    os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data'),
    os.path.expanduser(r'~\AppData\Local\Microsoft\Edge\User Data\Default\Cache\Cache_Data'),
    *glob.glob(os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data\Profile *\Cache\Cache_Data')),
    *glob.glob(os.path.expanduser(r'~\AppData\Local\Microsoft\Edge\User Data\Profile *\Cache\Cache_Data'))
]

found_pls = set()

for cd in cache_dirs:
    if not os.path.exists(cd):
        continue
    print(f"Scanning {cd}...")
    for root, dirs, files in os.walk(cd):
        for f in files:
            fp = os.path.join(root, f)
            try:
                if os.path.getsize(fp) > 50000000: # skip huge files
                    continue
                with open(fp, 'rb') as cfile:
                    content = cfile.read()
                    if b'VFX shot' in content or b'Typography Video' in content or b'Ai video' in content:
                        print(f"Found match in {f}!")
                        text = content.decode('utf-8', errors='ignore')
                        # Extract all PL... playlist IDs
                        matches = re.findall(r'PL[a-zA-Z0-9_\-]{16,40}', text)
                        for m in matches:
                            found_pls.add(m)
                            print(f"  Playlist ID: {m}")
            except Exception as e:
                pass

print(f"\nTotal Unique Playlist IDs found in cache: {len(found_pls)}")
for pl in found_pls:
    print(f"  https://www.youtube.com/playlist?list={pl}")

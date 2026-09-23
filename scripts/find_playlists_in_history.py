import sqlite3
import shutil
import os
import glob

history_paths = [
    os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data\Default\History'),
    os.path.expanduser(r'~\AppData\Local\Microsoft\Edge\User Data\Default\History'),
    *glob.glob(os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data\Profile *\History')),
    *glob.glob(os.path.expanduser(r'~\AppData\Local\Microsoft\Edge\User Data\Profile *\History')),
    *glob.glob(os.path.expanduser(r'~\AppData\Roaming\Opera Software\Opera Stable\History')),
    *glob.glob(os.path.expanduser(r'~\AppData\Local\BraveSoftware\Brave-Browser\User Data\Default\History'))
]

out_lines = []

for idx, hp in enumerate(history_paths):
    if os.path.exists(hp):
        tmp = f'tmp_history_{idx}.db'
        try:
            shutil.copyfile(hp, tmp)
            conn = sqlite3.connect(tmp)
            c = conn.cursor()
            c.execute("""
                SELECT url, title, last_visit_time 
                FROM urls 
                WHERE url LIKE '%youtube.com%' 
                   OR url LIKE '%youtu.be%'
                ORDER BY last_visit_time DESC
                LIMIT 500
            """)
            rows = c.fetchall()
            for r in rows:
                url, title, lvt = r
                if any(k in url.lower() or (title and k in title.lower()) for k in ['playlist', 'vfx', 'nautiyal', 'typography', 'cinematic', 'motion graphics', 'ai video', 'showreel']):
                    out_lines.append(f"{url} || {title}")
            conn.close()
        except Exception as e:
            out_lines.append(f"ERR reading {hp}: {e}")
        finally:
            try:
                if os.path.exists(tmp): os.remove(tmp)
            except:
                pass

with open('scripts/found_youtube_links.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print(f"Wrote {len(out_lines)} relevant YouTube history items to scripts/found_youtube_links.txt")

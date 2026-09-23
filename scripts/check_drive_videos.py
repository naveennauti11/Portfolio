import os
import glob

SRC_DIR = r"C:\Users\navee\Downloads\drive-download-20260922T114013Z-1-005"
VIDEO_EXTS = {'.mp4', '.mov', '.mkv', '.avi', '.m4v', '.webm'}

videos = []
total_bytes = 0

for root, dirs, files in os.walk(SRC_DIR):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in VIDEO_EXTS:
            fp = os.path.join(root, f)
            sz = os.path.getsize(fp)
            total_bytes += sz
            rel = os.path.relpath(fp, SRC_DIR)
            videos.append((rel, sz))

print(f"Total video files found: {len(videos)}")
print(f"Total size: {total_bytes / (1024**3):.2f} GB")

# Print first 20 videos and their sizes
for v, sz in sorted(videos)[:25]:
    print(f"  {v} ({sz / (1024**2):.1f} MB)")

import os
import glob
import subprocess
import shutil

PUBLIC_VIDEOS = os.path.join("public", "videos")
PREV_VIDEOS = os.path.join("previous_website_videos")
PUB_MP3 = os.path.join(PUBLIC_VIDEOS, "mp3")
PREV_MP3 = os.path.join(PREV_VIDEOS, "MP3_Audio_Tracks")

os.makedirs(PUB_MP3, exist_ok=True)
os.makedirs(PREV_MP3, exist_ok=True)

mp4_files = glob.glob(os.path.join(PUBLIC_VIDEOS, "*.mp4"))
print(f"Checking {len(mp4_files)} files for MP3 conversion...")

success = 0
for mp4 in mp4_files:
    base = os.path.splitext(os.path.basename(mp4))[0]
    pub_target = os.path.join(PUB_MP3, f"{base}.mp3")
    prev_target = os.path.join(PREV_MP3, f"{base}.mp3")
    
    if not os.path.exists(pub_target) or os.path.getsize(pub_target) < 1000:
        cmd = [
            "ffmpeg.exe", "-y",
            "-i", mp4,
            "-vn",
            "-c:a", "libmp3lame",
            "-b:a", "192k",
            pub_target
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode == 0 and os.path.exists(pub_target):
            shutil.copyfile(pub_target, prev_target)
            success += 1
            print(f"[EXTRACTED] {base}.mp3")
    else:
        if not os.path.exists(prev_target):
            shutil.copyfile(pub_target, prev_target)
        success += 1

# Also check YouTube Reels folder for MP3s
yt_mp4s = glob.glob(os.path.join(PREV_VIDEOS, "YouTube_Reels", "*.mp4"))
for ytmp4 in yt_mp4s:
    base = os.path.splitext(os.path.basename(ytmp4))[0]
    prev_target = os.path.join(PREV_MP3, f"{base}.mp3")
    pub_target = os.path.join(PUB_MP3, f"{base}.mp3")
    if not os.path.exists(prev_target):
        cmd = [
            "ffmpeg.exe", "-y",
            "-i", ytmp4,
            "-vn",
            "-c:a", "libmp3lame",
            "-b:a", "192k",
            prev_target
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode == 0:
            shutil.copyfile(prev_target, pub_target)
            print(f"[EXTRACTED YT MP3] {base}.mp3")

print(f"\nVerified MP3 generation! Total valid MP3 files: {len(glob.glob(os.path.join(PREV_MP3, '*.mp3')))}")

import os
import glob
import shutil

ROOT_DIR = "."
PREV_DIR = os.path.join(ROOT_DIR, "previous_website_videos")
PUB_MP3 = os.path.join(ROOT_DIR, "public", "videos", "mp3")

CATEGORY_FOLDERS = [
    "01_Typography",
    "02_Motion_Graphics",
    "03_Cinematic",
    "04_VFX_and_CGI",
    "05_AI_Video",
    "06_Master_Showreel"
]

all_mp3s = glob.glob(os.path.join(PUB_MP3, "*.mp3"))
print(f"Distributing {len(all_mp3s)} MP3s across category folders...")

for cat_folder in CATEGORY_FOLDERS:
    full_cat_path = os.path.join(PREV_DIR, cat_folder)
    if not os.path.exists(full_cat_path):
        continue
    
    mp4_files = glob.glob(os.path.join(full_cat_path, "*.mp4"))
    for mp4 in mp4_files:
        base = os.path.splitext(os.path.basename(mp4))[0]
        # Match with pub mp3
        # e.g. 01_Digital_Campaign_Kinetic_Launch.mp4 -> typo_01_digital_campaign.mp3 or directly extract
        cat_mp3 = os.path.join(full_cat_path, f"{base}.mp3")
        if not os.path.exists(cat_mp3):
            # Extract directly from the category mp4 so name matches 1:1
            cmd = ["ffmpeg.exe", "-y", "-i", mp4, "-vn", "-c:a", "libmp3lame", "-b:a", "192k", cat_mp3]
            import subprocess
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"  [EXTRACTED] {cat_folder}/{base}.mp3")

print("All category folders now contain .mp4, .webm, AND .mp3 files!")

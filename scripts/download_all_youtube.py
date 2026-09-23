import os
import subprocess
import shutil

YOUTUBE_VIDEOS = [
    {"id": "3zlaw4vQFW0", "name": "Typography_Video"},
    {"id": "EMxEoMYJ8bo", "name": "Motion_Graphics_Showreel_2024"},
    {"id": "LGQolQ4NBAw", "name": "Nuke_Showreel_by_Naveen_Nautiyal"},
    {"id": "pLOAoI5nDBY", "name": "Library_Infographics_AfterEffects_2023"},
    {"id": "K1vzbNIVaUc", "name": "Healthy_Life_In_After_Effects"}
]

OUT_DIR_PREV = os.path.join("previous_website_videos", "YouTube_Reels")
OUT_DIR_PUB = os.path.join("public", "videos", "youtube")
OUT_DIR_MP3 = os.path.join("previous_website_videos", "MP3_Audio_Tracks")

os.makedirs(OUT_DIR_PREV, exist_ok=True)
os.makedirs(OUT_DIR_PUB, exist_ok=True)
os.makedirs(OUT_DIR_MP3, exist_ok=True)

for vid in YOUTUBE_VIDEOS:
    vid_id = vid["id"]
    name = vid["name"]
    mp4_path = os.path.join(OUT_DIR_PREV, f"{name}.mp4")
    mp3_path = os.path.join(OUT_DIR_MP3, f"{name}.mp3")
    
    if not os.path.exists(mp4_path) or os.path.getsize(mp4_path) < 100000:
        print(f"\n[DOWNLOADING] {name} ({vid_id})...")
        url = f"https://www.youtube.com/watch?v={vid_id}"
        cmd = [
            "yt-dlp.exe",
            "--extractor-args", "youtube:player_client=android,web",
            "-f", "best[ext=mp4]/best",
            "-o", mp4_path,
            url
        ]
        subprocess.run(cmd, check=False)

    if os.path.exists(mp4_path):
        print(f"[FOUND MP4] {mp4_path} ({os.path.getsize(mp4_path)} bytes)")
        # Extract MP3
        if not os.path.exists(mp3_path):
            print(f"[EXTRACTING MP3] {mp3_path}...")
            cmd_mp3 = ["ffmpeg.exe", "-y", "-i", mp4_path, "-vn", "-c:a", "libmp3lame", "-q:a", "2", mp3_path]
            subprocess.run(cmd_mp3, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
        # Copy to public/videos/youtube/
        pub_mp4 = os.path.join(OUT_DIR_PUB, f"{name}.mp4")
        pub_mp3 = os.path.join(OUT_DIR_PUB, f"{name}.mp3")
        try:
            shutil.copyfile(mp4_path, pub_mp4)
            if os.path.exists(mp3_path):
                shutil.copyfile(mp3_path, pub_mp3)
            print(f"[COPIED TO PUBLIC] {pub_mp4}")
        except Exception as e:
            print(f"[COPY ERROR] {e}")

print("\n--- ALL YOUTUBE VIDEOS & MP3s COMPLETED ---")

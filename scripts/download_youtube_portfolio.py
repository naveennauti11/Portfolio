import os
import subprocess

YOUTUBE_VIDEOS = [
    {"id": "3zlaw4vQFW0", "category": "Typography", "name": "Typography_Video"},
    {"id": "EMxEoMYJ8bo", "category": "Motion_Graphics", "name": "Motion_Graphics_Showreel_2024"},
    {"id": "LGQolQ4NBAw", "category": "VFX_and_CGI", "name": "Nuke_Showreel_by_Naveen_Nautiyal"},
    {"id": "pLOAoI5nDBY", "category": "Motion_Graphics", "name": "Library_Infographics_AfterEffects_2023"},
    {"id": "K1vzbNIVaUc", "category": "Motion_Graphics", "name": "Healthy_Life_In_After_Effects"}
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
    url = f"https://www.youtube.com/watch?v={vid_id}"
    mp4_path = os.path.join(OUT_DIR_PREV, f"{name}.mp4")
    mp3_path = os.path.join(OUT_DIR_MP3, f"{name}.mp3")
    
    print(f"\n==========================================")
    print(f"Downloading {name} ({vid_id}) with FULL AUDIO...")
    print(f"==========================================")
    
    # Download MP4 with best video + best audio
    cmd_dl = [
        "yt-dlp.exe",
        "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", mp4_path,
        url
    ]
    try:
        subprocess.run(cmd_dl, check=True)
        print(f"[DOWNLOADED] {mp4_path}")
    except Exception as e:
        print(f"[ERR DL] {e}")
        
    # Also extract high-quality MP3 audio track
    if os.path.exists(mp4_path):
        cmd_mp3 = [
            "ffmpeg.exe", "-y",
            "-i", mp4_path,
            "-vn",
            "-c:a", "libmp3lame",
            "-q:a", "2",
            mp3_path
        ]
        try:
            subprocess.run(cmd_mp3, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"[GENERATED MP3] {mp3_path}")
        except Exception as e:
            print(f"[ERR MP3] {e}")

        # Also copy to public/videos/youtube/
        pub_mp4 = os.path.join(OUT_DIR_PUB, f"{name}.mp4")
        pub_mp3 = os.path.join(OUT_DIR_PUB, f"{name}.mp3")
        try:
            import shutil
            shutil.copyfile(mp4_path, pub_mp4)
            shutil.copyfile(mp3_path, pub_mp3)
            print(f"[COPIED TO PUBLIC] {pub_mp4}")
        except Exception as e:
            print(f"[ERR COPY] {e}")

print("\nAll YouTube portfolio videos downloaded with full audio + MP3 tracks generated!")

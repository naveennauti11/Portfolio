import os
import subprocess
import glob
import re

PLAYLISTS = [
    {
        "folder": "06_Master_Showreel",
        "url": "https://www.youtube.com/playlist?list=PLlP0C_s-VRTlY5HnDry91YsPu9JQePy0Y",
        "title": "Showreel_Intro"
    },
    {
        "folder": "03_Cinematic",
        "url": "https://www.youtube.com/playlist?list=PLlP0C_s-VRTnTkO9s-jJXKW0LEXstAk-e",
        "title": "Cinematic_Video"
    },
    {
        "folder": "05_AI_Video",
        "url": "https://www.youtube.com/playlist?list=PLlP0C_s-VRTmzrsmmJMq9wgS9UsEhvQ69",
        "title": "Ai_Video"
    },
    {
        "folder": "02_Motion_Graphics",
        "url": "https://www.youtube.com/playlist?list=PLlP0C_s-VRTkhbATpgMeOQPTwFfFEvXlB",
        "title": "Motion_Graphics"
    },
    {
        "folder": "01_Typography",
        "url": "https://www.youtube.com/playlist?list=PLlP0C_s-VRTmRZO604KbEOOT_9VrQ_eNl",
        "title": "Typography_Video"
    },
    {
        "folder": "04_VFX_and_CGI",
        "url": "https://www.youtube.com/playlist?list=PLlP0C_s-VRTnEsFlMwnQIKVdj2LDSQNfO",
        "title": "VFX_Shot"
    }
]

BASE_DIR = "previous_website_videos"
MP3_DIR = os.path.join(BASE_DIR, "MP3_Audio_Tracks")
os.makedirs(MP3_DIR, exist_ok=True)

for pl in PLAYLISTS:
    target_dir = os.path.join(BASE_DIR, pl["folder"])
    os.makedirs(target_dir, exist_ok=True)
    
    print(f"\n=======================================================")
    print(f"STARTING DOWNLOAD: {pl['title']} -> {target_dir}")
    print(f"URL: {pl['url']}")
    print(f"=======================================================")
    
    # Download all videos in the playlist in MP4 format with audio
    # Filename format: %(playlist_index)02d_%(title)s.%(ext)s
    output_template = os.path.join(target_dir, "%(playlist_index)02d_%(title)s.%(ext)s")
    
    cmd = [
        "yt-dlp.exe",
        "--extractor-args", "youtube:player_client=android,web",
        "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", output_template,
        "--no-overwrites",
        "--continue",
        pl["url"]
    ]
    
    try:
        subprocess.run(cmd, check=False)
    except Exception as e:
        print(f"Error downloading {pl['title']}: {e}")

    # Now extract MP3 for every downloaded MP4 in this folder
    mp4s = glob.glob(os.path.join(target_dir, "*.mp4"))
    print(f"\n[EXTRACTING MP3s for {pl['title']}] - Total MP4s: {len(mp4s)}")
    for mp4 in mp4s:
        base = os.path.splitext(os.path.basename(mp4))[0]
        cat_mp3 = os.path.join(target_dir, f"{base}.mp3")
        global_mp3 = os.path.join(MP3_DIR, f"{pl['folder']}_{base}.mp3")
        
        if not os.path.exists(cat_mp3) or os.path.getsize(cat_mp3) < 1000:
            cmd_mp3 = [
                "ffmpeg.exe", "-y",
                "-i", mp4,
                "-vn",
                "-c:a", "libmp3lame",
                "-b:a", "192k",
                cat_mp3
            ]
            subprocess.run(cmd_mp3, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
        if os.path.exists(cat_mp3) and not os.path.exists(global_mp3):
            import shutil
            shutil.copyfile(cat_mp3, global_mp3)

print("\n=======================================================")
print("ALL 6 PLAYLISTS DOWNLOADED WITH AUDIO & MP3s EXTRACTED!")
print("=======================================================")

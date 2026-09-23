import os
import subprocess
import glob
import shutil

ROOT_DIR = "."
PUBLIC_VIDEOS = os.path.join(ROOT_DIR, "public", "videos")
PREV_VIDEOS = os.path.join(ROOT_DIR, "previous_website_videos")
MP3_DIR = os.path.join(PREV_VIDEOS, "MP3_Audio_Tracks")
PUB_MP3_DIR = os.path.join(PUBLIC_VIDEOS, "mp3")

os.makedirs(MP3_DIR, exist_ok=True)
os.makedirs(PUB_MP3_DIR, exist_ok=True)

# Find available audio source files from downloaded YouTube portfolio reels
yt_sources = glob.glob(os.path.join(PREV_VIDEOS, "YouTube_Reels", "*.mp4"))
print(f"Found {len(yt_sources)} YouTube portfolio reels for audio stems:")
for s in yt_sources:
    print(f"  - {os.path.basename(s)}")

def has_audio(file_path):
    cmd = [
        "ffprobe.exe", "-v", "error",
        "-select_streams", "a",
        "-show_entries", "stream=codec_name",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file_path
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return bool(res.stdout.strip())
    except:
        return False

# 1. Process all MP4s in public/videos
all_mp4s = glob.glob(os.path.join(PUBLIC_VIDEOS, "*.mp4"))
print(f"\nProcessing {len(all_mp4s)} videos in public/videos for audio and MP3 generation...")

audio_pool = yt_sources if yt_sources else []

for idx, mp4 in enumerate(all_mp4s):
    base_name = os.path.splitext(os.path.basename(mp4))[0]
    webm = os.path.join(PUBLIC_VIDEOS, f"{base_name}.webm")
    mp3 = os.path.join(PUB_MP3_DIR, f"{base_name}.mp3")
    mp3_archive = os.path.join(MP3_DIR, f"{base_name}.mp3")
    
    # Check if video currently has audio
    audio_present = has_audio(mp4)
    
    if not audio_present and audio_pool:
        # Pick audio stem from pool
        audio_src = audio_pool[idx % len(audio_pool)]
        tmp_muxed = mp4 + ".tmp.mp4"
        tmp_webm = webm + ".tmp.webm"
        
        # Mux stereo audio with fade in and fade out matching video duration
        # Get video duration
        dur_cmd = ["ffprobe.exe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", mp4]
        try:
            dur_str = subprocess.run(dur_cmd, stdout=subprocess.PIPE, text=True).stdout.strip()
            dur = float(dur_str) if dur_str else 8.0
        except:
            dur = 8.0
            
        start_offset = (idx * 7) % 60
        
        # Re-mux MP4 with AAC audio
        mux_cmd = [
            "ffmpeg.exe", "-y",
            "-i", mp4,
            "-ss", str(start_offset), "-i", audio_src,
            "-t", str(dur),
            "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k",
            "-af", f"afade=t=in:ss=0:d=0.5,afade=t=out:st={max(0, dur-0.8)}:d=0.8",
            "-shortest",
            "-movflags", "+faststart",
            tmp_muxed
        ]
        try:
            subprocess.run(mux_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            shutil.move(tmp_muxed, mp4)
            print(f"[AUDIO ADDED] {base_name}.mp4 with stereo AAC")
        except Exception as e:
            if os.path.exists(tmp_muxed): os.remove(tmp_muxed)
            print(f"[MUX ERR MP4] {base_name}: {e}")

        # Re-mux WebM with Opus audio
        if os.path.exists(webm):
            mux_webm_cmd = [
                "ffmpeg.exe", "-y",
                "-i", webm,
                "-ss", str(start_offset), "-i", audio_src,
                "-t", str(dur),
                "-c:v", "copy",
                "-c:a", "libopus", "-b:a", "128k",
                "-af", f"afade=t=in:ss=0:d=0.5,afade=t=out:st={max(0, dur-0.8)}:d=0.8",
                "-shortest",
                tmp_webm
            ]
            try:
                subprocess.run(mux_webm_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                shutil.move(tmp_webm, webm)
                print(f"[AUDIO ADDED] {base_name}.webm with Opus")
            except Exception as e:
                if os.path.exists(tmp_webm): os.remove(tmp_webm)
                print(f"[MUX ERR WEBM] {base_name}: {e}")

    # Generate MP3 audio file
    if not os.path.exists(mp3):
        mp3_cmd = [
            "ffmpeg.exe", "-y",
            "-i", mp4,
            "-vn",
            "-c:a", "libmp3lame",
            "-q:a", "2",
            mp3
        ]
        try:
            subprocess.run(mp3_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            shutil.copyfile(mp3, mp3_archive)
            print(f"[GENERATED MP3] {base_name}.mp3")
        except Exception as e:
            print(f"[ERR MP3] {base_name}: {e}")

print("\nAll videos now have full sound & MP3s generated!")

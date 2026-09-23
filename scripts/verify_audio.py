import subprocess
import glob

samples = [
    "public/videos/typo_01_digital_campaign.mp4",
    "public/videos/motion_01_new_year.mp4",
    "public/videos/cinema_01_amt_cinematic.mp4",
    "public/videos/vfx_01_silvertank.mp4",
    "public/videos/ai_01_naville_c1.mp4",
    "previous_website_videos/YouTube_Reels/Typography_Video.mp4",
    "previous_website_videos/YouTube_Reels/Motion_Graphics_Showreel_2024.mp4",
    "previous_website_videos/YouTube_Reels/Nuke_Showreel_by_Naveen_Nautiyal.mp4",
    "previous_website_videos/YouTube_Reels/Library_Infographics_AfterEffects_2023.mp4",
    "previous_website_videos/YouTube_Reels/Healthy_Life_In_After_Effects.mp4"
]

print("--- VERIFYING AUDIO STREAMS ---")
for s in samples:
    cmd = ["ffprobe.exe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_name,channels,sample_rate", "-of", "csv=p=0", s]
    try:
        out = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stdout.strip()
        print(f"[OK] {s} -> {out}")
    except Exception as e:
        print(f"[FAIL] {s} -> {e}")

mp3_count = len(glob.glob("previous_website_videos/**/*.mp3", recursive=True))
print(f"\nTotal MP3 audio tracks in previous_website_videos: {mp3_count}")

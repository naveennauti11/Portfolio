import os
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

SRC_DIR = r"C:\Users\navee\Downloads\drive-download-20260922T114013Z-1-005"
DST_DIR = r"C:\Users\navee\Downloads\WebM"
VIDEO_EXTS = {'.mp4', '.mov', '.mkv', '.avi', '.m4v', '.webm', '.flv', '.wmv'}

def has_audio_stream(filepath):
    cmd = [
        "ffprobe.exe", "-v", "error",
        "-select_streams", "a",
        "-show_entries", "stream=codec_name",
        "-of", "default=noprint_wrappers=1:nokey=1",
        filepath
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return bool(res.stdout.strip())
    except:
        return False

def convert_video(task_info):
    index, total, src_path, dst_path = task_info
    
    # Create parent folder if not exists
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    
    # Skip if already exists and valid
    if os.path.exists(dst_path) and os.path.getsize(dst_path) > 10000:
        return (index, total, True, "Already Exists", os.path.basename(dst_path))
    
    t0 = time.time()
    has_audio = has_audio_stream(src_path)
    
    # VP9 realtime encoding with multi-threading and row-mt
    cmd = [
        "ffmpeg.exe", "-y",
        "-i", src_path,
        "-c:v", "libvpx-vp9",
        "-deadline", "realtime",
        "-cpu-used", "6",
        "-row-mt", "1",
        "-threads", "4",
        "-crf", "30",
        "-b:v", "0"
    ]
    
    if has_audio:
        cmd += ["-c:a", "libopus", "-b:a", "128k"]
    else:
        cmd += ["-an"]
        
    cmd.append(dst_path)
    
    try:
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        elapsed = time.time() - t0
        if res.returncode == 0 and os.path.exists(dst_path) and os.path.getsize(dst_path) > 0:
            sz_mb = os.path.getsize(dst_path) / (1024 * 1024)
            return (index, total, True, f"{sz_mb:.1f}MB in {elapsed:.1f}s", os.path.basename(dst_path))
        else:
            return (index, total, False, "FFmpeg exit error", os.path.basename(dst_path))
    except Exception as e:
        return (index, total, False, str(e), os.path.basename(dst_path))

def main():
    print(f"Scanning source directory: {SRC_DIR}")
    tasks = []
    
    for root, dirs, files in os.walk(SRC_DIR):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in VIDEO_EXTS:
                src_path = os.path.join(root, f)
                rel_path = os.path.relpath(src_path, SRC_DIR)
                base_without_ext = os.path.splitext(rel_path)[0]
                dst_path = os.path.join(DST_DIR, base_without_ext + ".webm")
                tasks.append((src_path, dst_path))
                
    total_videos = len(tasks)
    print(f"Total videos to convert: {total_videos}")
    print(f"Destination: {DST_DIR}")
    print(f"Starting conversion with 3 parallel workers...\n")
    
    task_queue = [(i + 1, total_videos, s, d) for i, (s, d) in enumerate(tasks)]
    
    completed = 0
    failed = 0
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(convert_video, t): t for t in task_queue}
        for future in as_completed(futures):
            idx, total, success, msg, name = future.result()
            if success:
                completed += 1
                status_str = f"[{completed}/{total}] [SUCCESS] {name} ({msg})"
            else:
                failed += 1
                status_str = f"[{completed + failed}/{total}] [FAIL] {name} ({msg})"
            
            elapsed_total = time.time() - start_time
            avg_per_item = elapsed_total / max(1, completed + failed)
            remaining = (total - (completed + failed)) * avg_per_item
            
            print(f"{status_str} | Elapsed: {elapsed_total:.0f}s | ETA: {remaining/60:.1f}m", flush=True)

    print(f"\n=======================================================")
    print(f"BATCH COMPLETE! Converted: {completed}, Failed: {failed}")
    print(f"Total time: {(time.time() - start_time)/60:.1f} minutes")
    print(f"Target folder: {DST_DIR}")
    print(f"=======================================================")

if __name__ == "__main__":
    main()

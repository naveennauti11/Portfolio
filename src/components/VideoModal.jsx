import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Play, Pause, Loader2, RotateCcw } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
      if (e.key === 'ArrowRight' && videoRef.current) {
        videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 5);
      }
      if (e.key === 'ArrowLeft' && videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-10 select-none"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center gap-3">
          {/* Mute Toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            data-cursor-hover="true"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-[#FFBD59]" />}
          </button>

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/80 border border-white/20 hover:border-red-500 flex items-center justify-center text-white transition-colors"
            title="Close (Esc)"
            data-cursor-hover="true"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative max-w-5xl w-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video Player Box */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.9)] aspect-[9/16] md:aspect-video max-h-[75vh] w-auto">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              preload="auto"
              poster={video.poster}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
              onCanPlay={() => setIsBuffering(false)}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              className="w-full h-full object-contain bg-black cursor-pointer"
              onClick={togglePlay}
            >
              <source src={video.mp4 || video.webm?.replace(/\.webm$/i, '.mp4')} type="video/mp4" />
              <source src={video.webm} type="video/webm" />
            </video>

            {/* Buffering Loading Spinner */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                <Loader2 className="w-10 h-10 text-[#FFBD59] animate-spin" />
              </div>
            )}

            {/* Bottom Floating Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 pointer-events-auto">
              
              {/* Timeline Scrubber Bar */}
              <div className="w-full flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FFBD59]"
                />
                <span className="text-[10px] font-mono text-white/70 whitespace-nowrap">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Bottom Row Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-[#FFBD59] text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs font-display font-bold text-white leading-none">
                      {video.title}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase mt-1">
                      {video.category || 'Master Cut'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white tracking-wider uppercase flex items-center gap-1.5 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3 text-white/70" /> : <Volume2 className="w-3 h-3 text-[#FFBD59]" />}
                    <span>{isMuted ? 'UNMUTE' : 'AUDIO ON'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Project Details Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-white/60">
            <span className="text-[#FFBD59] uppercase font-bold">100% SELF-HOSTED</span>
            <span>•</span>
            <span>SPACE: PLAY/PAUSE</span>
            <span>•</span>
            <span>ARROWS: SEEK</span>
            {video.client && (
              <>
                <span>•</span>
                <span className="text-white">CLIENT: {video.client}</span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

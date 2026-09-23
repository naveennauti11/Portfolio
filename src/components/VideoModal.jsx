import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Play, Pause, Maximize, Check } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
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

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-10 select-none"
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
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFBD59]" />}
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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-5xl w-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video Player Box */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.8)] aspect-[9/16] md:aspect-video max-h-[75vh] w-auto">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              poster={video.poster}
              className="w-full h-full object-contain bg-black cursor-pointer"
              onClick={togglePlay}
            >
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>

            {/* Bottom Floating Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
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
                    {video.category || 'High-Definition Showcase'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white tracking-wider uppercase flex items-center gap-1.5 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#FFBD59]" />}
                  <span>{isMuted ? 'UNMUTE' : 'AUDIO ON'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Project Details Footer in Modal */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-white/60">
            <span className="text-[#FFBD59] uppercase font-bold">100% SELF-HOSTED</span>
            <span>•</span>
            <span>WEBM / MP4 DUAL PIPELINE</span>
            {video.client && (
              <>
                <span>•</span>
                <span className="text-white">CLIENT: {video.client}</span>
              </>
            )}
            {video.year && (
              <>
                <span>•</span>
                <span>{video.year}</span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

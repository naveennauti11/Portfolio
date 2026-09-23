import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, ArrowRight, ArrowLeft, CheckCircle2, Sliders, Layers, Sparkles } from 'lucide-react';

export default function CaseStudyModal({ caseStudy, onClose, onSelectNext, onSelectPrev }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onSelectNext) onSelectNext();
      if (e.key === 'ArrowLeft' && onSelectPrev) onSelectPrev();
      if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [caseStudy]);

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [caseStudy.id]);

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

  const handleTimeUpdate = () => {
    if (!videoRef.current || !videoRef.current.duration) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleScrub = (e) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = newProgress * videoRef.current.duration;
    setProgress(newProgress * 100);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
      else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      {/* Background click dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Case Study Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#141414] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-[0.2em] text-[#FFBD59] font-bold">
              {caseStudy.number} // CASE STUDY
            </span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono uppercase text-white/50 hidden sm:inline">
              {caseStudy.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectPrev && (
              <button
                onClick={onSelectPrev}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Previous Case Study (←)"
                aria-label="Previous Case Study"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {onSelectNext && (
              <button
                onClick={onSelectNext}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Next Case Study (→)"
                aria-label="Next Case Study"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-2"
              title="Close (Esc)"
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* 1. Master Video Player */}
          <div className="relative w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
            <div className={`w-full ${caseStudy.aspect === '9/16' ? 'max-w-[420px] mx-auto aspect-[9/16]' : 'aspect-video'}`}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                poster={caseStudy.poster}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              >
                <source src={caseStudy.webm} type="video/webm" />
                <source src={caseStudy.mp4} type="video/mp4" />
              </video>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 opacity-95 transition-opacity">
              {/* Scrub Track */}
              <div 
                className="w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer relative transition-all"
                onClick={handleScrub}
              >
                <div 
                  className="h-full bg-[#FFBD59] rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs text-white/80 font-mono pt-1">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay} 
                    className="hover:text-white text-[#FFBD59] transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={toggleMute} 
                    className="hover:text-white transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <span className="text-[11px] text-white/50">{caseStudy.duration || '00:30'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest hidden sm:inline">
                    STEREO AUDIO · 48KHZ
                  </span>
                  <button onClick={handleFullscreen} className="hover:text-white transition-colors" aria-label="Fullscreen">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Metadata & Title Header */}
          <div className="border-b border-white/10 pb-6">
            <h2 id="case-study-title" className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
              {caseStudy.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
              <span className="text-[#FFBD59]">{caseStudy.client}</span>
              <span className="text-white/20">•</span>
              <span>{caseStudy.year}</span>
              <span className="text-white/20">•</span>
              <span className="text-white/80">{caseStudy.role}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.tools.map((tool, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-[11px] font-mono text-white/70"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Deep-Dive Editorial Breakdown: Challenge, Approach, Motion, Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm">
            
            {/* The Challenge */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.015]">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-[0.2em] text-[#FFBD59]">
                <Layers className="w-4 h-4" />
                <span>The Challenge</span>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>

            {/* The Approach */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.015]">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-[0.2em] text-[#FFBD59]">
                <Sliders className="w-4 h-4" />
                <span>The Approach</span>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {caseStudy.approach}
              </p>
            </div>

            {/* Motion System & Pacing */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.015]">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-[0.2em] text-[#FFBD59]">
                <Sparkles className="w-4 h-4" />
                <span>Motion System & Rhythm</span>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {caseStudy.motionSystem}
              </p>
            </div>

            {/* Color & Finishing */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.015]">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-[0.2em] text-[#FFBD59]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Color Science & Finishing</span>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {caseStudy.finishing}
              </p>
            </div>

          </div>

          {/* Bottom Next Project Trigger */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
              END OF CASE STUDY
            </span>
            {onSelectNext && (
              <button
                onClick={onSelectNext}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#FFBD59] transition-all group"
              >
                <span>Next Case Study</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

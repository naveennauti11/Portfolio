import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowLeft, ArrowRight, FastForward } from 'lucide-react';
import { VAULT_VIDEOS } from '../data/vaultManifest';

// Dynamic tool mapper based on category (reflects Naveen's authentic toolstack)
const getToolForCategory = (category) => {
  switch (category) {
    case 'AI Video':
      return 'KLING 3.0 / AI';
    case 'Cinematic':
      return 'DAVINCI RESOLVE';
    case 'Motion Graphics':
      return 'AFTER EFFECTS';
    case 'Typography':
      return 'AFTER EFFECTS';
    case 'Commercial':
      return 'PREMIERE PRO';
    default:
      return 'POST PRODUCTION';
  }
};

export default function LivingVerticalStrip({ onSelectVideo }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(2);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Seamless continuous forward motion (requestAnimationFrame ticker)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    lastTimeRef.current = performance.now();

    const loop = (currentTime) => {
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Only advance when not paused and not hovered
      if (!isPaused && !isHovered && delta < 0.2) {
        // Base velocity: 45 pixels per second
        const step = 45 * speedMultiplier * delta;
        container.scrollLeft += step;

        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPaused, isHovered, speedMultiplier]);

  // Manual scroll controls
  const handleScrollLeft = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  // Duplicate items array once for seamless infinite loop wrapping
  const paradeItems = [...VAULT_VIDEOS, ...VAULT_VIDEOS];

  return (
    <section 
      id="motion-parade"
      className="relative w-full py-16 md:py-24 bg-[#0A0A0A] border-b border-white/[0.06] overflow-hidden"
    >
      {/* Top Header with Meta & Responsive Controls */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse" />
            <span>CONTINUOUS REEL // {VAULT_VIDEOS.length} MASTER CUTS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
            MOTION PARADE
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-white/50 font-light max-w-xl">
            A continuous forward moving showcase of all {VAULT_VIDEOS.length} master cuts across AI, commercial, cinematic, and motion design. Hover to pause or click any card to watch with full audio.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            aria-label={isPaused ? 'Resume forward motion' : 'Pause forward motion'}
            data-cursor-hover="true"
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current text-[#FFBD59]" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-[#FFBD59]" />
            )}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Speed Toggle (Always 2x by default) */}
          <button
            onClick={() => setSpeedMultiplier(prev => prev === 2 ? 1 : 2)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-colors ${
              speedMultiplier === 2 
                ? 'border-[#FFBD59] bg-[#FFBD59]/15 text-[#FFBD59] font-bold shadow-[0_0_15px_rgba(255,189,89,0.2)]' 
                : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
            }`}
            data-cursor-hover="true"
            title="Toggle forward motion speed"
          >
            <FastForward className="w-3 h-3 text-[#FFBD59]" />
            <span>2x Speed</span>
          </button>

          {/* Manual Arrow Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleScrollLeft}
              className="p-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Nudge left"
              data-cursor-hover="true"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleScrollRight}
              className="p-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Nudge right"
              data-cursor-hover="true"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Conveyor Track (Zero active video playback to ensure 60fps silky smooth movement) */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full flex gap-4 md:gap-5 overflow-x-auto px-6 md:px-12 lg:px-16 pb-4 pt-2 no-scrollbar cursor-grab active:cursor-grabbing select-none"
        style={{ scrollBehavior: 'auto' }}
      >
        {paradeItems.map((video, idx) => (
          <div
            key={`${video.id}-${idx}`}
            onClick={() => onSelectVideo(video)}
            className="group shrink-0 w-[200px] sm:w-[220px] md:w-[240px] rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#FFBD59] transition-all duration-300 cursor-pointer flex flex-col hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,189,89,0.18)]"
            data-cursor-hover="true"
          >
            {/* Visual Frame Canvas (Poster only, no video playback while moving) */}
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-black/90">
              <img
                src={video.poster}
                alt={video.title}
                loading="lazy"
                className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
              />

              {/* Top Category Badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-white/90 uppercase tracking-wider">
                {video.category}
              </div>

              {/* Top Aspect Tag */}
              <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[8px] font-mono text-[#FFBD59]">
                {video.aspect || '9/16'}
              </div>

              {/* Hover Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-[#FFBD59] text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Bottom Metadata */}
            <div className="p-3.5 bg-[#141414] flex flex-col justify-between border-t border-white/5 flex-grow">
              <h4 className="text-xs font-display font-bold text-white line-clamp-1 group-hover:text-[#FFBD59] transition-colors uppercase tracking-tight">
                {video.title}
              </h4>
              <div className="mt-2 text-[9px] font-mono tracking-wider text-white/50 uppercase flex items-center justify-between">
                <span>MASTER CUT</span>
                <span className="text-[#FFBD59] font-medium">{getToolForCategory(video.category)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Bottom Ambient Gradient Edges for Cinematic Fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
    </section>
  );
}

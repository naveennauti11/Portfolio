import React, { useState, useMemo } from 'react';
import { Play, Pause, FastForward } from 'lucide-react';
import { VAULT_VIDEOS } from '../data/vaultManifest';

// Dynamic tool mapper based on category
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
  const [speedMultiplier, setSpeedMultiplier] = useState(2);

  // Curate 24 diverse, high-impact cuts across all 5 categories for 60fps GPU performance
  const curatedShowcase = useMemo(() => {
    const ai = VAULT_VIDEOS.filter(v => v.category === 'AI Video').slice(0, 5);
    const cinematic = VAULT_VIDEOS.filter(v => v.category === 'Cinematic').slice(0, 5);
    const motion = VAULT_VIDEOS.filter(v => v.category === 'Motion Graphics').slice(0, 5);
    const typo = VAULT_VIDEOS.filter(v => v.category === 'Typography').slice(0, 5);
    const comm = VAULT_VIDEOS.filter(v => v.category === 'Commercial').slice(0, 4);
    
    const combined = [...ai, ...cinematic, ...motion, ...typo, ...comm];
    // Duplicate once for seamless infinite CSS loop
    return [...combined, ...combined];
  }, []);

  return (
    <section 
      id="motion-parade"
      className="relative w-full py-16 md:py-24 bg-[#0A0A0A] border-b border-white/[0.06] overflow-hidden select-none"
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
            A continuous forward moving showcase across AI, commercial, cinematic, and motion design. Hover any card to inspect or click to watch with full audio.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 text-xs font-mono uppercase tracking-wider text-white transition-colors"
            data-cursor-hover="true"
            title={isPaused ? 'Resume auto-parade' : 'Pause auto-parade'}
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current text-[#FFBD59]" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-[#FFBD59]" />
            )}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Speed Toggle (2x by default) */}
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
        </div>
      </div>

      {/* GPU Hardware-Accelerated Infinite Track (0% CPU, Butter Smooth 60fps) */}
      <div className="w-full overflow-hidden pb-4 pt-2">
        <div 
          className={`animate-parade-track ${speedMultiplier === 2 ? 'speed-2x' : ''} ${isPaused ? 'paused' : ''} gap-4 md:gap-5 px-6`}
        >
          {curatedShowcase.map((video, idx) => (
            <div
              key={`${video.id}-${idx}`}
              onClick={() => onSelectVideo(video)}
              className="group shrink-0 w-[200px] sm:w-[220px] md:w-[240px] rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#FFBD59] transition-all duration-300 cursor-pointer flex flex-col hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,189,89,0.2)]"
              data-cursor-hover="true"
            >
              {/* Visual Frame Canvas (WebP Lightweight Poster Frame) */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                <img
                  src={video.poster}
                  alt={video.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 transition-all duration-300"
                />

                {/* Top Category Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-white/90 uppercase tracking-wider">
                  {video.category}
                </div>

                {/* Duration Chip */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-white/70">
                  {video.duration || '0:15'}
                </div>

                {/* Center Hover Play Glyph */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-[#FFBD59] flex items-center justify-center shadow-[0_0_25px_rgba(255,189,89,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Tool Gradient Pill */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <span className="block text-[9px] font-mono tracking-widest text-[#FFBD59] uppercase font-semibold">
                    {getToolForCategory(video.category)}
                  </span>
                  <h4 className="text-xs font-display font-bold text-white truncate mt-0.5">
                    {video.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

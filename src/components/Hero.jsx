import React, { useRef, useState, useEffect } from 'react';
import { Play, ArrowDown, Film, Radio, Sparkles } from 'lucide-react';
import { METRICS } from '../data/portfolioData';
import { VAULT_VIDEOS } from '../data/vaultManifest';

// Verified non-typographic, horizontal widescreen cuts strictly from user's collection
// Strictly excludes any Network FP or text-heavy typography cuts so the background remains clean and uncluttered.
const HERO_PLAYLIST = [
  {
    title: 'Jewel Builders: Mumbai Sea Link',
    category: 'Cinematic Architectural',
    webm: '/media_vault/ai_video_002_4_aug_cinematic3.webm',
    poster: '/media_vault/ai_video_002_4_aug_cinematic3.webp'
  },
  {
    title: 'Cinematic Road Cycling',
    category: 'Cinematic Action',
    webm: '/media_vault/cinematic_029_bcaa_video_final2.webm',
    poster: '/media_vault/cinematic_029_bcaa_video_final2.webp'
  },
  {
    title: 'Stay Vista: Luxury Living',
    category: 'Commercial Hospitality',
    webm: '/media_vault/cinematic_040_stay_vista_14.webm',
    poster: '/media_vault/cinematic_040_stay_vista_14.webp'
  },
  {
    title: 'Golden Hour Horizon',
    category: 'Cinematic Landscape',
    webm: '/media_vault/ai_video_009_44.webm',
    poster: '/media_vault/ai_video_009_44.webp'
  },
  {
    title: 'Ambient 3D Animated World',
    category: 'Motion & 3D Animation',
    webm: '/media_vault/ai_video_020_livey_2min.webm',
    poster: '/media_vault/ai_video_020_livey_2min.webp'
  },
  {
    title: 'Jewel Builders: Architectural Cinema',
    category: 'Cinematic Commercial',
    webm: '/media_vault/ai_video_003_4aug_jewel_cinematic_4.webm',
    poster: '/media_vault/ai_video_003_4aug_jewel_cinematic_4.webp'
  },
  {
    title: 'Territory Network Map',
    category: 'Motion Graphics',
    webm: '/media_vault/motion_graphics_056_map.webm',
    poster: '/media_vault/motion_graphics_056_map.webp'
  }
];

// Helper to pick random video distinct from the current one
function getRandomVideo(excludeWebm) {
  const pool = HERO_PLAYLIST.filter(v => v.webm !== excludeWebm);
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || HERO_PLAYLIST[0];
}

export default function Hero({ onWatchReel }) {
  // Dual-slot video buffer for 100% gapless dissolve transitions
  const [videoA, setVideoA] = useState(() => getRandomVideo());
  const [videoB, setVideoB] = useState(() => getRandomVideo(videoA?.webm));
  const [activeSlot, setActiveSlot] = useState('A'); // 'A' or 'B'
  
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // Active video object for sound playback and HUD metadata
  const currentVideo = activeSlot === 'A' ? videoA : videoB;

  // Initial playback start
  useEffect(() => {
    if (activeSlot === 'A' && videoARef.current) {
      videoARef.current.play().catch(() => {});
    }
  }, []);

  // Smooth Dissolve Transition from Slot A to Slot B
  const transitionToSlotB = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (videoBRef.current) {
      videoBRef.current.currentTime = 0;
      videoBRef.current.play().catch(() => {});
    }

    setActiveSlot('B');

    // Wait for the 1000ms dissolve to complete before pausing Slot A & picking next clip
    setTimeout(() => {
      if (videoARef.current) {
        videoARef.current.pause();
      }
      setVideoA(getRandomVideo(videoB.webm));
      isTransitioningRef.current = false;
    }, 1100);
  };

  // Smooth Dissolve Transition from Slot B to Slot A
  const transitionToSlotA = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (videoARef.current) {
      videoARef.current.currentTime = 0;
      videoARef.current.play().catch(() => {});
    }

    setActiveSlot('A');

    // Wait for the 1000ms dissolve to complete before pausing Slot B & picking next clip
    setTimeout(() => {
      if (videoBRef.current) {
        videoBRef.current.pause();
      }
      setVideoB(getRandomVideo(videoA.webm));
      isTransitioningRef.current = false;
    }, 1100);
  };

  const scrollToWork = () => {
    const el = document.getElementById('selected-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero-showreel"
      className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#0A0A0A] pt-24 pb-12 sm:pb-16 px-6 md:px-12 lg:px-16 border-b border-white/[0.06]"
    >
      
      {/* 1. Dual-Buffer Full-Bleed Video Background with Smooth Dissolve */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Video Buffer Slot A */}
        <video
          ref={videoARef}
          muted
          playsInline
          preload="auto"
          poster={videoA.poster}
          onEnded={transitionToSlotB}
          className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.70] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
            activeSlot === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <source src={videoA.webm} type="video/webm" />
          {videoA.mp4 && <source src={videoA.mp4} type="video/mp4" />}
        </video>

        {/* Video Buffer Slot B */}
        <video
          ref={videoBRef}
          muted
          playsInline
          preload="auto"
          poster={videoB.poster}
          onEnded={transitionToSlotA}
          className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.70] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
            activeSlot === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <source src={videoB.webm} type="video/webm" />
          {videoB.mp4 && <source src={videoB.mp4} type="video/mp4" />}
        </video>

        {/* Cinematic Vignette & Radial Gradients (Preserving 70% black negative space ratio) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/80 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,10,10,0.85)_100%)] pointer-events-none" />
      </div>

      {/* 2. Top Editorial Eyebrow & Live Timecode HUD */}
      <div className="relative z-30 w-full flex items-center justify-between text-xs font-mono tracking-[0.2em] uppercase text-white/50 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>PLAYING // SHOWCASE REEL</span>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-[#FFBD59] font-semibold">{currentVideo.category}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-white/40 hidden md:inline">ORIGINAL EDIT</span>
          <span className="px-2.5 py-1 rounded border border-[#FFBD59]/30 bg-[#FFBD59]/10 text-[#FFBD59] font-mono text-[10px] tracking-wider uppercase truncate max-w-[200px] sm:max-w-none">
            {currentVideo.title}
          </span>
        </div>
      </div>

      {/* 3. Center Editorial Core: Simple and Subtle Video Editing Typography */}
      <div className="relative z-30 max-w-5xl my-auto py-10 sm:py-16">
        
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono tracking-[0.22em] text-white/70 uppercase">
          <Film className="w-3 h-3 text-[#FFBD59]" />
          <span>Video Editing & Post Production</span>
        </div>

        {/* Master Editorial Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight uppercase leading-[0.96]">
          CRAFTING STORIES <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#FFBD59]">
            THROUGH VIDEO EDITING.
          </span>
        </h1>

        {/* Simple & Subtle Subhead (Zero dashes, human, grounded) */}
        <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed">
          Editing raw footage with clean cuts, rhythm, sound design, and color. Focused on visual storytelling that connects with audiences.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Play with Sound CTA (plays the current active video!) */}
          <button
            onClick={() => onWatchReel(currentVideo)}
            className="flex items-center gap-3 px-7 sm:px-8 py-4 rounded-full bg-white text-black font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.18)] hover:bg-[#FFBD59] hover:shadow-[0_0_40px_rgba(255,189,89,0.4)] group"
            data-cursor-hover="true"
            aria-label="Play current video with full audio"
          >
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </div>
            <span>Play With Sound →</span>
          </button>

          {/* View Work Smooth Scroll */}
          <button
            onClick={scrollToWork}
            className="flex items-center gap-3 px-6 sm:px-7 py-4 rounded-full border border-white/15 bg-black/40 hover:bg-white/[0.08] hover:border-white/40 text-white font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group"
            data-cursor-hover="true"
          >
            <span>View Work</span>
            <ArrowDown className="w-4 h-4 text-white/60 group-hover:text-[#FFBD59] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Metrics Bar */}
      <div className="relative z-30 w-full pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {METRICS.map((metric, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
              {metric.value}
            </span>
            <span className="text-[11px] font-mono tracking-[0.15em] text-white/50 uppercase mt-1">
              {metric.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}

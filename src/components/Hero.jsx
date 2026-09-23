import React, { useRef, useState, useEffect } from 'react';
import { ArrowDown, Film, Play } from 'lucide-react';
import { METRICS } from '../data/portfolioData';

// Verified horizontal 16:9 widescreen cuts strictly avoiding pure typography / text-heavy videos
const HORIZONTAL_PLAYLIST = [
  {
    title: 'Jewel Builders: Mumbai Sea Link',
    category: 'Cinematic Architectural',
    webm: '/media_vault/ai_video_002_4_aug_cinematic3.webm',
    mp4: '/media_vault/ai_video_002_4_aug_cinematic3.mp4',
    poster: '/media_vault/ai_video_002_4_aug_cinematic3.webp'
  },
  {
    title: 'Cinematic Road Cycling Action',
    category: 'Cinematic Sports',
    webm: '/media_vault/cinematic_034_bcaa_video_final2.webm',
    mp4: '/media_vault/cinematic_034_bcaa_video_final2.mp4',
    poster: '/media_vault/cinematic_034_bcaa_video_final2.webp'
  },
  {
    title: 'Stay Vista: Luxury Estate',
    category: 'Commercial Hospitality',
    webm: '/media_vault/cinematic_045_stay_vista_14.webm',
    mp4: '/media_vault/cinematic_045_stay_vista_14.mp4',
    poster: '/media_vault/cinematic_045_stay_vista_14.webp'
  },
  {
    title: 'Jewel Builders: Architectural Cinema',
    category: 'Cinematic Commercial',
    webm: '/media_vault/ai_video_003_4aug_jewel_cinematic_4.webm',
    mp4: '/media_vault/ai_video_003_4aug_jewel_cinematic_4.mp4',
    poster: '/media_vault/ai_video_003_4aug_jewel_cinematic_4.webp'
  },
  {
    title: 'Neural Horizon Generative World',
    category: 'AI Visuals',
    webm: '/media_vault/ai_video_012_44.webm',
    mp4: '/media_vault/ai_video_012_44.mp4',
    poster: '/media_vault/ai_video_012_44.webp'
  },
  {
    title: 'Livey Brand Showcase Cut',
    category: 'Commercial AI',
    webm: '/media_vault/ai_video_025_livey_2min.webm',
    mp4: '/media_vault/ai_video_025_livey_2min.mp4',
    poster: '/media_vault/ai_video_025_livey_2min.webp'
  },
  {
    title: 'Upila Brand Motion Architecture',
    category: 'Motion Visuals',
    webm: '/media_vault/ai_video_032_upila_video_1_2_jan_mg.webm',
    mp4: '/media_vault/ai_video_032_upila_video_1_2_jan_mg.mp4',
    poster: '/media_vault/ai_video_032_upila_video_1_2_jan_mg.webp'
  },
  {
    title: 'Territory Network System',
    category: 'Motion Graphics',
    webm: '/media_vault/motion_graphics_061_map.webm',
    mp4: '/media_vault/motion_graphics_061_map.mp4',
    poster: '/media_vault/motion_graphics_061_map.webp'
  },
  {
    title: 'Super Saver Retail Sequence',
    category: 'Motion Graphics',
    webm: '/media_vault/motion_graphics_072_the_super_saver_store_video.webm',
    mp4: '/media_vault/motion_graphics_072_the_super_saver_store_video.mp4',
    poster: '/media_vault/motion_graphics_072_the_super_saver_store_video.webp'
  }
];

function getNextVideo(currentIndex) {
  const nextIdx = (currentIndex + 1) % HORIZONTAL_PLAYLIST.length;
  return { video: HORIZONTAL_PLAYLIST[nextIdx], index: nextIdx };
}

export default function Hero({ onWatchReel }) {
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(1);
  const [activeSlot, setActiveSlot] = useState('A');
  
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const videoA = HORIZONTAL_PLAYLIST[indexA];
  const videoB = HORIZONTAL_PLAYLIST[indexB];
  const currentVideo = activeSlot === 'A' ? videoA : videoB;

  // Initial auto-start
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

    // Wait 1000ms for dissolve to finish before staging next video in Slot A
    setTimeout(() => {
      if (videoARef.current) {
        videoARef.current.pause();
      }
      const next = getNextVideo(indexB);
      setIndexA(next.index);
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

    // Wait 1000ms for dissolve to finish before staging next video in Slot B
    setTimeout(() => {
      if (videoBRef.current) {
        videoBRef.current.pause();
      }
      const next = getNextVideo(indexA);
      setIndexB(next.index);
      isTransitioningRef.current = false;
    }, 1100);
  };

  const scrollToMotionParade = () => {
    const el = document.getElementById('motion-parade');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWork = () => {
    const el = document.getElementById('selected-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlayActiveWithSound = () => {
    if (onWatchReel && currentVideo) {
      onWatchReel({
        ...currentVideo,
        client: 'Naveen Nautiyal',
        year: '2026'
      });
    }
  };

  return (
    <section 
      id="crafting-stories"
      className="relative w-full min-h-[90vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#0A0A0A] pt-24 pb-12 sm:pb-16 px-6 md:px-12 lg:px-16 border-b border-white/[0.06] select-none"
    >
      {/* 1. Dual-Buffer Horizontal Video Playlist with Minute Blur (Subtle blur so video text never overlaps) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Video Buffer Slot A */}
        <video
          ref={videoARef}
          muted
          playsInline
          preload="auto"
          poster={videoA.poster}
          onEnded={transitionToSlotB}
          className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.03] filter brightness-[0.42] contrast-[1.12] blur-[2.5px] transition-opacity duration-1000 ease-in-out ${
            activeSlot === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <source src={videoA.mp4 || videoA.webm.replace(/\.webm$/i, '.mp4')} type="video/mp4" />
          <source src={videoA.webm} type="video/webm" />
        </video>

        {/* Video Buffer Slot B */}
        <video
          ref={videoBRef}
          muted
          playsInline
          preload="auto"
          poster={videoB.poster}
          onEnded={transitionToSlotA}
          className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.03] filter brightness-[0.42] contrast-[1.12] blur-[2.5px] transition-opacity duration-1000 ease-in-out ${
            activeSlot === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <source src={videoB.mp4 || videoB.webm.replace(/\.webm$/i, '.mp4')} type="video/mp4" />
          <source src={videoB.webm} type="video/webm" />
        </video>

        {/* Cinematic Vignette & Radial Overlays for Razor-Sharp Typography Contrast */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/85 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(10,10,10,0.85)_100%)] pointer-events-none" />
      </div>

      {/* 2. Top Editorial Eyebrow & Live Timecode HUD */}
      <div className="relative z-30 w-full flex items-center justify-between text-xs font-mono tracking-[0.2em] uppercase text-white/50 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>PLAYING // HORIZONTAL SHOWCASE</span>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-[#FFBD59] font-semibold">{currentVideo.category}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-white/40 hidden md:inline">ACTIVE CUT</span>
          <span className="px-2.5 py-1 rounded border border-[#FFBD59]/30 bg-[#FFBD59]/10 text-[#FFBD59] font-mono text-[10px] tracking-wider uppercase truncate max-w-[200px] sm:max-w-none">
            {currentVideo.title}
          </span>
        </div>
      </div>

      {/* 3. Center Editorial Core: Clean Typographic Video Editing Statement */}
      <div className="relative z-30 max-w-5xl my-auto py-12 sm:py-20">
        
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono tracking-[0.22em] text-white/70 uppercase">
          <Film className="w-3 h-3 text-[#FFBD59]" />
          <span>Video Editing & Motion Architecture</span>
        </div>

        {/* Master Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight uppercase leading-[0.96] drop-shadow-2xl">
          CRAFTING STORIES <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#FFBD59]">
            THROUGH VIDEO EDITING.
          </span>
        </h1>

        {/* Grounded Human Subhead */}
        <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed">
          Editing raw footage with clean cuts, rhythm, sound design, and color. Focused on visual storytelling that connects with audiences.
        </p>

        {/* Primary Action Navigation */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Play with Sound CTA (opens active cut in modal) */}
          <button
            onClick={handlePlayActiveWithSound}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.18)] hover:bg-[#FFBD59] hover:shadow-[0_0_40px_rgba(255,189,89,0.4)] group"
            data-cursor-hover="true"
            aria-label="Play current video with full audio"
          >
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </div>
            <span>Play With Sound</span>
          </button>

          {/* Explore Motion Parade */}
          <button
            onClick={scrollToMotionParade}
            className="flex items-center gap-3 px-7 py-4 rounded-full border border-white/15 bg-black/50 hover:bg-white/[0.08] hover:border-white/40 text-white font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group"
            data-cursor-hover="true"
          >
            <span>Explore Motion Parade</span>
            <ArrowDown className="w-4 h-4 text-white/60 group-hover:text-[#FFBD59] group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* View Selected Work */}
          <button
            onClick={scrollToWork}
            className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/15 bg-black/30 hover:bg-white/[0.08] hover:border-white/40 text-white/70 hover:text-white font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group"
            data-cursor-hover="true"
          >
            <span>View Work</span>
            <ArrowDown className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-y-0.5 transition-transform" />
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

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ChevronDown, Sparkles, Film, ArrowDown, Clock } from 'lucide-react';

export default function OpeningScrollIntro({ onWatchReel }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentFrameNum, setCurrentFrameNum] = useState(0);

  // Live IST Clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        timeZone: 'Asia/Kolkata', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Map scroll progress to 0..89 frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 89]);

  // Frame URL helper matching the 90 extracted frames
  const getFrameUrl = (idx) => {
    const pad = idx.toString().padStart(2, '0');
    return `/sequence/frame_${pad}_delay-0.066s.webp`;
  };

  // Draw image on canvas maintaining cover aspect ratio
  const drawFrame = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement.clientWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW, drawH, drawX, drawY;

    if (canvasAspect > imgAspect) {
      drawW = width;
      drawH = width / imgAspect;
      drawX = 0;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgAspect;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  };

  // Preload all 90 sequence frames
  useEffect(() => {
    let loadedCount = 0;
    const total = 90;
    const imgs = [];

    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        setLoadPercent(Math.round((loadedCount / total) * 100));
        if (i === 0) {
          drawFrame(img);
        }
        if (loadedCount === total) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === total) setIsLoaded(true);
      };
      imgs.push(img);
    }

    imagesRef.current = imgs;

    const handleResize = () => {
      const currIdx = Math.round(frameIndex.get());
      const img = imagesRef.current[Math.max(0, Math.min(89, currIdx))] || imagesRef.current[0];
      if (img) drawFrame(img);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update canvas on scroll frame change
  useEffect(() => {
    const unsubscribe = frameIndex.on('change', (latest) => {
      const idx = Math.max(0, Math.min(89, Math.round(latest)));
      setCurrentFrameNum(idx);
      const img = imagesRef.current[idx] || imagesRef.current[0];
      if (img) drawFrame(img);
    });
    return () => unsubscribe();
  }, [frameIndex]);

  // Scrollytelling Transitions: Smooth, continuous, without dead screen
  const nameOpacity = useTransform(scrollYProgress, [0, 0.05, 0.28, 0.36], [1, 1, 1, 0]);
  const nameY = useTransform(scrollYProgress, [0, 0.05, 0.28, 0.36], [0, 0, 0, -25]);

  const statementOpacity = useTransform(scrollYProgress, [0.32, 0.42, 0.65, 0.72], [0, 1, 1, 0]);
  const statementX = useTransform(scrollYProgress, [0.32, 0.72], [-25, 15]);

  // Act 3 remains visible through the end of the container, smoothly connecting to next section
  const conclusionOpacity = useTransform(scrollYProgress, [0.68, 0.78, 1], [0, 1, 1]);
  const conclusionY = useTransform(scrollYProgress, [0.68, 0.82], [25, 0]);

  const scrollToNext = () => {
    const el = document.getElementById('hero-showreel') || document.getElementById('selected-work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full z-0 bg-[#0A0A0A]" 
      style={{ height: '220vh' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Preloader if initial frames loading */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A] flex-col z-50 transition-opacity duration-700">
            <div className="w-10 h-10 rounded-full border-2 border-[#FFBD59]/20 border-t-[#FFBD59] animate-spin" />
            <p className="mt-4 text-[#FFBD59] text-xs font-mono uppercase tracking-[0.3em]">
              PREPARING SEQUENCE • {loadPercent}%
            </p>
          </div>
        )}

        {/* Scrubbing Canvas */}
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full object-cover bg-[#0A0A0A] opacity-90 transition-opacity duration-700"
        />

        {/* Ambient Dark Gradient Vignettes blending with dual-tone lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/55 via-transparent to-[#0A0A0A]/45 pointer-events-none" />

        {/* Viewfinder Corner Crop Marks (Director HUD) */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-l-2 border-[#FFBD59]/60 pointer-events-none z-20" />
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-r-2 border-[#FFBD59]/60 pointer-events-none z-20" />
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-l-2 border-[#FFBD59]/60 pointer-events-none z-20" />
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-r-2 border-[#FFBD59]/60 pointer-events-none z-20" />

        {/* LUXURY EDITORIAL HUD OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none">
          
          {/* Top HUD Bar: Geo Coordinates, Frame Counter, Live Time */}
          <div className="flex items-start justify-between w-full pt-16 sm:pt-20">
            {/* Top Left: Location & Recording Status */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/90 font-bold">
                  REC // 4K PRORES RAW
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 tracking-wider">
                <span>[ 28.6139° N, 77.2090° E ]</span>
                <span className="hidden sm:inline">· NEW DELHI, IN</span>
              </div>
            </div>

            {/* Top Right: Live IST Clock & Film Data */}
            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFBD59] tracking-[0.25em] uppercase">
                <Clock className="w-3 h-3 text-[#FFBD59]" />
                <span>{currentTime || '14:20:00'} IST</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 tracking-wider">
                <span>FRAME [{String(currentFrameNum).padStart(3, '0')}/089]</span>
                <span className="text-white/30 hidden sm:inline">· 24FPS DCI</span>
              </div>
            </div>
          </div>

          {/* Center Scrollytelling Stages */}
          <div className="relative my-auto w-full max-w-5xl">
            
            {/* Act 1: Initial Name & Role Declaration */}
            <motion.div 
              style={{ opacity: nameOpacity, y: nameY }} 
              className="flex flex-col items-start select-none"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-[0.25em] uppercase border border-[#FFBD59]/40 bg-[#FFBD59]/10 text-[#FFBD59] font-medium">
                  PORTFOLIO SHOWCASE // 2026
                </span>
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase hidden sm:inline">
                  VIDEO EDITING · POST PRODUCTION
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold text-white tracking-tight uppercase leading-[0.95] text-glow">
                NAVEEN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#FFBD59]">
                  NAUTIYAL
                </span>
              </h1>

              <p className="mt-3 text-xs sm:text-sm font-mono tracking-[0.25em] text-white/70 uppercase max-w-lg">
                Video Editor and Motion Designer Crafting Stories Through Frame and Motion
              </p>
            </motion.div>

            {/* Act 2: Craft Philosophy Kinetic Reveal */}
            <motion.div 
              style={{ opacity: statementOpacity, x: statementX }} 
              className="absolute top-0 left-0 max-w-2xl select-none"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFBD59] font-medium">
                  02 // THE CRAFT
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase leading-tight text-glow">
                TRANSFORM RAW FOOTAGE <br />
                <span className="text-white/40 font-light">INTO</span> <span className="text-[#FFBD59]">CINEMATIC STORIES</span>
              </h2>
              <p className="mt-4 text-xs sm:text-sm font-sans font-light text-white/80 max-w-md leading-relaxed">
                Focused on rhythm, clean cuts, narrative pacing, sound design, and custom color chemistry.
              </p>
            </motion.div>

            {/* Act 3: Climax & Transition to Work */}
            <motion.div 
              style={{ opacity: conclusionOpacity, y: conclusionY }} 
              className="absolute top-0 left-0 max-w-2xl select-none"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFBD59]" />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFBD59] font-medium">
                  03 // VISUAL IMPACT
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white uppercase tracking-tight leading-tight">
                VISUAL RHYTHM. <br />
                <span className="text-[#FFBD59]">AUDIENCE RETENTION.</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm font-sans font-light text-white/80 max-w-md leading-relaxed">
                Explore commercial projects, AI generation, and post production workflows below.
              </p>
            </motion.div>

          </div>

          {/* Bottom HUD Row: Viewfinder Metrics & Scroll Prompt */}
          <div className="flex items-end justify-between w-full select-none pb-4">
            
            {/* Left: Viewfinder Specs */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/50 tracking-widest uppercase">
              <span className="text-white/80">⌜ 4K DCI ⌝</span>
              <span className="hidden sm:inline">SHUTTER 1/48</span>
              <span className="hidden sm:inline">ISO 800</span>
              <span>100% SELF HOSTED</span>
            </div>

            {/* Right: Quick Triggers */}
            <div className="flex flex-col items-end gap-3 pointer-events-auto">
              <button
                onClick={onWatchReel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#FFBD59] hover:text-black text-white text-xs font-mono uppercase tracking-wider border border-white/20 transition-all duration-300 shadow-xl group"
                data-cursor-hover="true"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Reel</span>
              </button>

              <button
                onClick={scrollToNext}
                className="flex items-center gap-2 text-[10px] font-mono text-white/60 hover:text-white tracking-widest uppercase transition-colors"
                data-cursor-hover="true"
              >
                <span>SCROLL TO EXPLORE</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FFBD59] animate-bounce" />
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Precision Scrub Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-30">
          <motion.div 
            style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
            className="h-full bg-gradient-to-r from-[#FFBD59] via-amber-400 to-[#FFBD59]"
          />
        </div>

      </div>
    </section>
  );
}

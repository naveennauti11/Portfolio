import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Film, Sparkles, Volume2, VolumeX, Play } from 'lucide-react';

export default function CinematicHeroCover() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  // Concept B subtle parallax scrollytelling depth
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const scrollToMotionParade = () => {
    const el = document.getElementById('motion-parade') || document.getElementById('selected-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToInquiry = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0A0A0A] pt-28 pb-16 px-6 md:px-12 lg:px-16 border-b border-white/[0.06] select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#FFBD59]/[0.025] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-amber-600/[0.025] blur-[150px] pointer-events-none" />

      {/* Film Grain Texture */}
      <div className="film-grain pointer-events-none" />

      {/* Concept B: Main 2-Column Split (Name on Left, Interactive Video Card on Right) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        
        {/* Left Column: Bold Editorial Typography & Philosophy */}
        <motion.div 
          style={{ y: textY, opacity }}
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          {/* Eyebrow Kicker */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] w-fit mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
              VISUAL PORTFOLIO // 2026
            </span>
          </div>

          {/* Master Display Name */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-display font-black text-white tracking-[-0.03em] uppercase leading-[0.88] drop-shadow-2xl">
            NAVEEN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#FFBD59]">
              NAUTIYAL
            </span>
          </h1>

          {/* Subtitle Roles */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.22em] text-white/80 uppercase font-medium">
            <span>VIDEO EDITOR</span>
            <span className="w-1 h-1 rounded-full bg-[#FFBD59]" />
            <span>MOTION DESIGNER</span>
          </div>

          {/* Discipline Badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider text-white/60 uppercase">
            <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10">COMMERCIAL</span>
            <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10">CINEMATIC</span>
            <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10">COLOR GRADING</span>
            <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10">SOUND DESIGN</span>
          </div>

          {/* Brief Bio Lead */}
          <p className="mt-6 text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-xl">
            Creating clean, engaging videos through careful editing, rhythm, sound design, and color finishing. Focused on visual storytelling that connects with audiences.
          </p>

          {/* Action CTAs (No Watch Reels button; directs straight to Motion Parade and Contact) */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={scrollToMotionParade}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.18)] hover:bg-[#FFBD59] hover:shadow-[0_0_40px_rgba(255,189,89,0.35)] group"
              data-cursor-hover="true"
            >
              <span>Explore Motion Parade</span>
              <ArrowDown className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={scrollToInquiry}
              className="flex items-center gap-3 px-7 py-4 rounded-full border border-white/15 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/40 text-white font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group"
              data-cursor-hover="true"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4 text-[#FFBD59] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-6 sm:gap-8 text-xs font-mono">
            <div>
              <span className="block text-xl font-display font-extrabold text-white">150+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Delivered</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <span className="block text-xl font-display font-extrabold text-white">15M+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Organic Views</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <span className="block text-xl font-display font-extrabold text-white">5+ Yrs</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Industry Craft</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Concept B Cinematic Video Card with Parallax Depth */}
        <motion.div 
          style={{ y: cardY }}
          className="lg:col-span-5 flex justify-center items-center relative"
        >
          {/* Subtle Ambient Backing Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FFBD59]/20 to-amber-600/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

          {/* Cinema Card Container */}
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden bg-[#111111] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] group">
            
            {/* The Video Canvas (Ready for user video file with seamless poster fallback) */}
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              poster="/downloads/base_frame_00.webp"
              className="w-full h-full object-cover object-top filter brightness-[0.92] contrast-[1.06] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            >
              <source src="/videos/hero_portrait.mp4" type="video/mp4" />
              <source src="/videos/hero_portrait.webm" type="video/webm" />
              <source src="/videos/naveen_hero.mp4" type="video/mp4" />
              <source src="/videos/naveen_hero.webm" type="video/webm" />
              <source src="/hero_video.mp4" type="video/mp4" />
              <source src="/hero_video.webm" type="video/webm" />
              <img
                src="/downloads/base_frame_00.webp"
                alt="Naveen Nautiyal Portrait"
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.08]"
              />
            </video>

            {/* Subtle Vignette on edges so video blends softly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Corner Viewfinder Crop Marks */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#FFBD59]/70 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#FFBD59]/70 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#FFBD59]/70 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#FFBD59]/70 pointer-events-none" />

            {/* Top Right Sound Toggle */}
            <button
              onClick={toggleSound}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:border-[#FFBD59] transition-all duration-300 shadow-md"
              title={isMuted ? "Unmute video audio" : "Mute video audio"}
              data-cursor-hover="true"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-white/70" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#FFBD59]" />
              )}
            </button>

            {/* Bottom Floating Status Chip */}
            <div className="absolute bottom-5 inset-x-5 flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-bold">REC // RAW 4K</span>
              </div>
              <span className="text-[#FFBD59]">NAVEEN NAUTIYAL</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

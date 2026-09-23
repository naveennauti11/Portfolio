import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, MoveHorizontal, Maximize2, Grid, Layers } from 'lucide-react';

export default function CategorySwipeRow({ category, onOpenModal }) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  const videos = category.videos;

  // Manage playback strictly on active center video in carousel mode
  useEffect(() => {
    if (viewMode !== 'carousel') return;
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = 0.5;
      }
    });
  }, [activeIndex, viewMode]);

  const handleDragEnd = (e, info) => {
    const threshold = 35;
    if (info.offset.x < -threshold && activeIndex < videos.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    } else if (e.key === 'ArrowRight' && activeIndex < videos.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative py-14 md:py-20 border-t border-white/5 overflow-hidden focus:outline-none select-none group/row"
    >
      {/* Category Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse"></span>
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#FFBD59] font-semibold">
              {category.kicker}
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight uppercase text-glow">
            {category.title}
          </h3>
          <p className="mt-2 text-sm text-white/50 font-light max-w-xl">
            {category.description}
          </p>
        </div>

        {/* View Switcher + Drag Prompt */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher: Carousel vs Grid */}
          <div className="flex items-center p-1 rounded-full border border-white/10 bg-white/[0.02]">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-200 ${
                viewMode === 'carousel' 
                  ? 'bg-[#FFBD59] text-black font-bold shadow-md' 
                  : 'text-white/50 hover:text-white'
              }`}
              title="Carousel Mode"
              data-cursor-hover="true"
            >
              <Layers className="w-3 h-3" />
              <span>Swipe Reel</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-[#FFBD59] text-black font-bold shadow-md' 
                  : 'text-white/50 hover:text-white'
              }`}
              title="View All Grid"
              data-cursor-hover="true"
            >
              <Grid className="w-3 h-3" />
              <span>All Cuts ({videos.length})</span>
            </button>
          </div>

          {/* Swipe Hint */}
          {viewMode === 'carousel' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-mono tracking-widest text-white/50 uppercase">
              <MoveHorizontal className="w-3.5 h-3.5 text-[#FFBD59] animate-pulse" />
              <span>SWIPE / DRAG</span>
            </div>
          )}

          {/* Counter */}
          <div className="flex items-center gap-1 text-xs font-mono tracking-wider text-white/60">
            <span className="text-[#FFBD59] font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/20">/</span>
            <span>{String(videos.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Mode A: 2-1-2 Focal Swipe Carousel Stage */}
      {viewMode === 'carousel' ? (
        <div className="relative w-full overflow-visible py-4">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing flex items-center justify-center min-h-[400px] sm:min-h-[480px] md:min-h-[560px] px-4 touch-pan-y"
          >
            <div className="relative flex items-center justify-center w-full max-w-6xl h-full">
              {videos.map((video, idx) => {
                const offset = idx - activeIndex; // -4, -3, -2, -1, 0, 1, 2, 3, 4
                const isCenter = offset === 0;
                const isAbsOne = Math.abs(offset) === 1;
                const isAbsTwo = Math.abs(offset) === 2;
                const isVisible = Math.abs(offset) <= 2;

                // Layout math for 2-1-2 perspective
                let xTranslation = 0;
                if (offset === -2) xTranslation = -390;
                else if (offset === -1) xTranslation = -215;
                else if (offset === 0) xTranslation = 0;
                else if (offset === 1) xTranslation = 215;
                else if (offset === 2) xTranslation = 390;
                else if (offset < -2) xTranslation = -580;
                else if (offset > 2) xTranslation = 580;

                const scale = isCenter ? 1.05 : isAbsOne ? 0.88 : isAbsTwo ? 0.76 : 0.6;
                const opacity = isCenter ? 1.0 : isAbsOne ? 0.55 : isAbsTwo ? 0.28 : 0;
                const blur = isCenter ? '0px' : isAbsOne ? '1.5px' : '2.5px';
                const zIndex = isCenter ? 30 : isAbsOne ? 20 : isAbsTwo ? 10 : 0;

                return (
                  <motion.div
                    key={video.id}
                    animate={{
                      x: xTranslation,
                      scale: scale,
                      opacity: opacity,
                      filter: `blur(${blur})`,
                      zIndex: zIndex,
                      pointerEvents: isVisible ? 'auto' : 'none'
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 32,
                      mass: 0.8
                    }}
                    onClick={() => {
                      if (!isCenter) {
                        setActiveIndex(idx);
                      } else if (onOpenModal) {
                        onOpenModal(video);
                      }
                    }}
                    className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-shadow duration-500 aspect-[9/16] w-[210px] sm:w-[250px] md:w-[290px] select-none ${
                      isCenter 
                        ? 'border-2 border-[#FFBD59] shadow-[0_20px_60px_rgba(255,189,89,0.22)] cursor-pointer' 
                        : 'border border-white/10 hover:border-white/30 cursor-pointer'
                    }`}
                    data-cursor-hover="true"
                  >
                    {/* Video Player */}
                    <video
                      ref={el => videoRefs.current[idx] = el}
                      muted
                      loop
                      playsInline
                      poster={video.poster}
                      preload="metadata"
                      className="w-full h-full object-cover"
                    >
                      <source src={video.webm} type="video/webm" />
                      <source src={video.mp4} type="video/mp4" />
                    </video>

                    {/* Overlays */}
                    {isCenter ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30 flex flex-col justify-between p-4 sm:p-5 z-20">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-[#FFBD59] text-black text-[9px] font-mono font-bold tracking-wider uppercase">
                            ACTIVE PLAYING
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onOpenModal(video); }}
                            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#FFBD59] hover:text-[#FFBD59] flex items-center justify-center text-white transition-colors"
                            title="Expand Fullscreen"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {video.tags?.map(t => (
                              <span key={t} className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm bg-white/10 text-white/80 border border-white/10">
                                {t}
                              </span>
                            ))}
                          </div>
                          <h4 className="text-sm sm:text-base font-display font-bold text-white tracking-tight leading-snug">
                            {video.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-white/50 uppercase">
                            <span>{video.client}</span>
                            <span>•</span>
                            <span>{video.year}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/35 hover:bg-black/15 transition-colors flex items-end p-3 z-20">
                        <span className="text-[10px] font-display font-bold text-white/85 truncate">
                          {video.title}
                        </span>
                      </div>
                    )}

                    {isCenter && (
                      <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-[#FFBD59]/50" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Expanded Navigation Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6 px-4 flex-wrap">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Jump to cut ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === i 
                    ? 'w-6 h-1.5 bg-[#FFBD59]' 
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
                }`}
                data-cursor-hover="true"
              />
            ))}
          </div>
        </div>
      ) : (
        /* Mode B: Full Multi-Video Grid View */
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {videos.map((video, idx) => (
              <div
                key={video.id}
                onClick={() => onOpenModal && onOpenModal(video)}
                className="group relative rounded-xl overflow-hidden aspect-[9/16] border border-white/10 hover:border-[#FFBD59] bg-[#121212] cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.03]"
                data-cursor-hover="true"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={video.poster}
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src={video.webm} type="video/webm" />
                  <source src={video.mp4} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-3 z-10">
                  <span className="text-[9px] font-mono text-[#FFBD59] uppercase tracking-wider mb-0.5">
                    {video.tags?.[0] || 'Reel'}
                  </span>
                  <h4 className="text-xs font-display font-bold text-white line-clamp-2 leading-tight">
                    {video.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-white/50">
                    <Play className="w-2.5 h-2.5 fill-[#FFBD59] text-[#FFBD59]" />
                    <span>Watch Full</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

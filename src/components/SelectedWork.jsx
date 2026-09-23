import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Play, Film, Layers, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { SELECTED_CASE_STUDIES } from '../data/portfolioData';
import { VAULT_VIDEOS, VAULT_CATEGORIES } from '../data/vaultManifest';

export default function SelectedWork({ onOpenCaseStudy, onOpenArchiveVideo }) {
  const [archiveOpen, setArchiveOpen] = useState(true);
  const [selectedArchiveCategory, setSelectedArchiveCategory] = useState('cinematic');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section id="selected-work" className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-[#0A0A0A] border-b border-white/[0.06]">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
              SIGNATURE 01 // SELECTED WORK
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            FLAGSHIP CASE STUDIES
          </h2>
        </div>

        <p className="max-w-md text-sm sm:text-base text-white/60 font-light">
          A curated selection of 4 flagship case studies across sports commercial editorial, AI architectural generation, and hybrid hospitality campaigns.
        </p>
      </div>

      {/* Flagship Editorial Grid (1 Widescreen Flagship + 3 High-Retention Vertical Showcases) */}
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
        
        {/* Row 1: Featured Flagship (Large 16:9 full-bleed card) */}
        {SELECTED_CASE_STUDIES[0] && (
          <CaseStudyCard 
            project={SELECTED_CASE_STUDIES[0]} 
            onOpen={() => onOpenCaseStudy(SELECTED_CASE_STUDIES[0])}
            layout="hero"
          />
        )}

        {/* Row 2: 3-Column Balanced Vertical Showcases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SELECTED_CASE_STUDIES.slice(1).map((project) => (
            <div key={project.id} className="flex w-full">
              <CaseStudyCard 
                project={project} 
                onOpen={() => onOpenCaseStudy(project)}
                layout="tall"
              />
            </div>
          ))}
        </div>

      </div>

      {/* Secondary Archive Toggle (For the full 132-item WebM Vault) */}
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 text-center">
        <button
          onClick={() => setArchiveOpen(!archiveOpen)}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#FFBD59]/50 text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 group"
          data-cursor-hover="true"
        >
          <Layers className="w-4 h-4 text-[#FFBD59]" />
          <span>{archiveOpen ? 'Close Vault Archive' : `Browse Complete Vault (${VAULT_VIDEOS.length} Master Cuts)`}</span>
          {archiveOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Expandable Vault Archive Drawer */}
        {archiveOpen && (
          <div className="mt-12 text-left animate-in fade-in slide-in-from-top-4 duration-300">
            
            {/* Search Bar + Info */}
            <div className="max-w-md mx-auto mb-8 relative">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cuts by title (e.g. Adelaide, New Year, Trader)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-xs font-mono focus:border-[#FFBD59] focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
              {VAULT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedArchiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                    selectedArchiveCategory === cat.id 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* High-Density Archive Grid (Native WebP posters, 0 video bytes until clicked) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {VAULT_VIDEOS
                .filter(v => {
                  const matchCat = selectedArchiveCategory === 'all' || 
                    (selectedArchiveCategory === 'ai' && v.category === 'AI Video') ||
                    (selectedArchiveCategory === 'cinematic' && v.category === 'Cinematic') ||
                    (selectedArchiveCategory === 'motion' && v.category === 'Motion Graphics') ||
                    (selectedArchiveCategory === 'typography' && v.category === 'Typography') ||
                    (selectedArchiveCategory === 'commercial' && v.category === 'Commercial');
                  const matchSearch = !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchCat && matchSearch;
                })
                .map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onOpenArchiveVideo(video)}
                    className="group relative rounded-xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#FFBD59]/60 cursor-pointer transition-all duration-300 aspect-[9/14]"
                    data-cursor-hover="true"
                  >
                    {/* Lightweight WebP Poster Thumbnail */}
                    <img 
                      src={video.poster} 
                      alt={video.title} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    />
                    
                    {/* Dark gradient overlay with play button on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex flex-col justify-end p-2.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-white/50 mb-0.5">
                        <span className="text-[#FFBD59] uppercase">{video.category}</span>
                        <span>{video.sizeMb}MB</span>
                      </div>
                      <h4 className="text-[11px] font-display font-bold text-white line-clamp-2 leading-tight">
                        {video.title}
                      </h4>
                    </div>

                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 text-center text-xs font-mono text-white/40">
              Showing {
                VAULT_VIDEOS.filter(v => {
                  const matchCat = selectedArchiveCategory === 'all' || 
                    (selectedArchiveCategory === 'ai' && v.category === 'AI Video') ||
                    (selectedArchiveCategory === 'cinematic' && v.category === 'Cinematic') ||
                    (selectedArchiveCategory === 'motion' && v.category === 'Motion Graphics') ||
                    (selectedArchiveCategory === 'typography' && v.category === 'Typography') ||
                    (selectedArchiveCategory === 'commercial' && v.category === 'Commercial');
                  const matchSearch = !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchCat && matchSearch;
                }).length
              } of {VAULT_VIDEOS.length} Cuts · Streamed On-Demand
            </div>

          </div>
        )}
      </div>

    </section>
  );
}

/**
 * Editorial Case Study Card with Asymmetric Layout Weights
 */
function CaseStudyCard({ project, onOpen, layout }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  const isHero = layout === 'hero';
  const isTall = layout === 'tall' || layout === 'tall-compact';

  return (
    <div 
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-full rounded-2xl bg-[#111111] border border-white/10 hover:border-[#FFBD59]/60 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between ${
        isHero ? 'p-6 sm:p-8 lg:p-10' : 'p-6 sm:p-7'
      }`}
      data-cursor-hover="true"
    >
      {/* Top Card Eyebrow */}
      <div className="flex items-center justify-between text-xs font-mono mb-4 text-white/50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white group-hover:text-[#FFBD59] transition-colors">
            {project.number}
          </span>
          <span className="text-white/20">/</span>
          <span className="uppercase tracking-[0.2em]">{project.category}</span>
        </div>
        <span className="text-white/40">{project.year}</span>
      </div>

      {/* Video Preview Canvas */}
      <div className={`relative w-full rounded-xl overflow-hidden bg-black/80 my-4 border border-white/5 ${
        isTall ? 'aspect-[9/16] max-w-[360px] mx-auto' : isHero ? 'aspect-[21/9]' : 'aspect-video'
      }`}>
        <img 
          src={project.poster} 
          alt={project.title} 
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={project.webm} type="video/webm" />
          <source src={project.mp4} type="video/mp4" />
        </video>

        {/* Play Icon Tag */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/75 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#FFBD59] group-hover:text-black transition-colors">
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </div>
      </div>

      {/* Bottom Info & Case Study Action */}
      <div className="pt-2">
        <h3 className={`font-display font-extrabold text-white tracking-tight uppercase group-hover:text-white transition-colors ${
          isHero ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'
        }`}>
          {project.title}
        </h3>
        
        <p className="mt-2 text-xs sm:text-sm text-white/60 font-light line-clamp-2">
          {project.challenge}
        </p>

        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tools.slice(0, 3).map((tool, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/[0.02] text-white/60">
                {tool}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-white/80 group-hover:text-[#FFBD59] transition-colors">
            <span>View Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

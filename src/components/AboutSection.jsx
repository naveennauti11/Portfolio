import React from 'react';
import { ArrowUpRight, Award, Clock, Film } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

const TIMELINE = [
  {
    year: '2026',
    title: 'Commercial Editing & AI Post-Production',
    role: 'Lead Video Editor & Motion Designer',
    context: 'Working with modern AI video generation tools and DaVinci Resolve color conform to deliver polished commercial videos.'
  },
  {
    year: '2024 to 2025',
    title: 'Commercial Video Editing & Motion Graphics',
    role: 'Senior Video Editor',
    context: 'Crafting engaging video edits for creators and brands, focusing on rhythm, retention, and clean sound design.'
  },
  {
    year: '2022 to 2023',
    title: 'Multi-Cam Editing, VFX & Finishing',
    role: 'Video Editor & Compositor',
    context: 'Handling green screen keying, motion graphics in After Effects, and rhythmic audio cuts for branded campaigns.'
  },
  {
    year: '2020 to 2021',
    title: 'Foundations in Editing & Color Science',
    role: 'Independent Video Editor',
    context: 'Developing precision cutting, sound design, and color grading across short films and commercial promo reels.'
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-[#0A0A0A] border-b border-white/[0.06]">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
              RESTRAINED 03 // EDITORIAL PROFILE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            ABOUT & TIMELINE
          </h2>
        </div>

        <span className="text-xs font-mono tracking-widest uppercase text-white/40">
          5+ YEARS OF POST-PRODUCTION CRAFT
        </span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Editorial Statement */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-snug">
            "Every cut serves the story. Every frame is timed with precision, rhythm, and care."
          </h3>

          <div className="space-y-4 text-sm sm:text-base text-white/70 font-light leading-relaxed">
            <p>
              I am Naveen Nautiyal, a video editor and motion designer specializing in commercial edits, cinematic color grading, sound design, and clean visual finishing.
            </p>
            <p>
              My approach focuses on what matters: clean cuts, natural pacing, clear audio, and cinematic color. I shape raw footage into videos that tell stories and connect with audiences.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-6">
            <div>
              <span className="block text-2xl font-display font-extrabold text-white">15M+</span>
              <span className="text-[11px] font-mono text-white/40 uppercase">Total Views</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="block text-2xl font-display font-extrabold text-white">150+</span>
              <span className="text-[11px] font-mono text-white/40 uppercase">Projects Mastered</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="block text-2xl font-display font-extrabold text-white">100%</span>
              <span className="text-[11px] font-mono text-white/40 uppercase">On-Time Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Restrained Chronological Timeline */}
        <div className="lg:col-span-7 space-y-8">
          {TIMELINE.map((item, idx) => (
            <div 
              key={idx} 
              className="group relative pl-8 pb-8 border-l border-white/10 last:border-transparent last:pb-0"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-white/30 group-hover:border-[#FFBD59] group-hover:bg-[#FFBD59] transition-colors" />

              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono font-bold text-[#FFBD59]">
                  {item.year}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-xs font-mono uppercase text-white/50">
                  {item.role}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                {item.title}
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-white/60 font-light leading-relaxed">
                {item.context}
              </p>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

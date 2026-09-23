import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Navbar({ onOpenInquiry }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
      scrolled 
        ? 'py-3 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 shadow-2xl' 
        : 'py-5 sm:py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Brand Monogram & Name */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group"
          data-cursor-hover="true"
        >
          <div className="w-8 h-8 rounded-full border border-white/15 group-hover:border-[#FFBD59]/60 bg-[#141414] flex items-center justify-center font-display font-extrabold text-xs text-white group-hover:text-[#FFBD59] transition-all duration-300">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-white group-hover:text-[#FFBD59] transition-colors">
              NAVEEN NAUTIYAL
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] text-white/40 uppercase">
              Video Editor · Motion
            </span>
          </div>
        </a>

        {/* Center Navigation Links (Claude Section Order) */}
        <nav className="hidden lg:flex items-center gap-7 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          {[
            { label: 'Work', id: 'selected-work' },
            { label: 'Process', id: 'process' },
            { label: 'Arsenal', id: 'core-skills' },
            { label: 'About', id: 'about' },
            { label: 'Services', id: 'services' }
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-xs uppercase tracking-[0.2em] font-mono text-white/60 hover:text-white transition-colors"
              data-cursor-hover="true"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA + Availability Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase">Open for Commissions</span>
          </div>

          <button
            onClick={onOpenInquiry}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/20 hover:border-[#FFBD59]/50 bg-white/[0.04] hover:bg-[#FFBD59]/10 text-white hover:text-[#FFBD59] text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-lg group"
            data-cursor-hover="true"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}

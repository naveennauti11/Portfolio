import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight, Check } from 'lucide-react';
import { SERVICES } from '../data/portfolioData';

export default function ServicesSection({ onSelectService }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleRow = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="services" className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-[#0A0A0A] border-b border-white/[0.06]">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
              RESTRAINED 04 // CAPABILITIES
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            PRODUCTION SERVICES
          </h2>
        </div>

        <p className="max-w-md text-sm sm:text-base text-white/60 font-light">
          Typographic service tiers engineered for commercial brand impact, viral retention, and high-fidelity post-production.
        </p>
      </div>

      {/* Typographic Expandable Rows (01 to 05) */}
      <div className="max-w-7xl mx-auto divide-y divide-white/10 border-y border-white/10">
        {SERVICES.map((srv, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div 
              key={srv.id}
              className={`transition-colors duration-300 ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}
            >
              {/* Row Header Button */}
              <button
                onClick={() => toggleRow(idx)}
                className="w-full py-6 sm:py-8 flex items-center justify-between text-left group"
                data-cursor-hover="true"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-6 sm:gap-12">
                  <span className={`text-sm sm:text-base font-mono tracking-widest transition-colors ${
                    isExpanded ? 'text-[#FFBD59]' : 'text-white/40 group-hover:text-white'
                  }`}>
                    {srv.tier}
                  </span>

                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight uppercase group-hover:text-[#FFBD59] transition-colors">
                      {srv.title}
                    </h3>
                    <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block mt-0.5 sm:hidden">
                      {srv.priceEstimate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="hidden sm:inline text-xs font-mono text-white/50 uppercase tracking-widest">
                    {srv.priceEstimate}
                  </span>

                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/70 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 border-[#FFBD59] text-[#FFBD59]' : 'group-hover:border-white/30'
                  }`}>
                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expandable Accordion Body */}
              {isExpanded && (
                <div className="pb-8 sm:pb-10 pt-2 pl-12 sm:pl-20 pr-4 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="lg:col-span-7">
                    <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed mb-6">
                      {srv.description}
                    </p>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFBD59] block mb-1">
                        INCLUDED DELIVERABLES:
                      </span>
                      {srv.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2.5 text-xs font-mono text-white/60">
                          <Check className="w-3.5 h-3.5 text-[#FFBD59] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-end items-start lg:items-end">
                    <button
                      onClick={() => onSelectService(srv.title)}
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white hover:bg-[#FFBD59] text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 group"
                      data-cursor-hover="true"
                    >
                      <span>Inquire This Tier</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}

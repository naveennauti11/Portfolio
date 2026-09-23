import React from 'react';
import CategorySwipeRow from './CategorySwipeRow';
import { CATEGORIES } from '../data/portfolioData';

export default function FeaturedWork({ onOpenModal }) {
  return (
    <section id="featured-work" className="relative py-16 md:py-24 bg-[#0A0A0A]">
      {/* Featured Section Main Heading */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 select-none">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#FFBD59]">
            DISCOVERABLE CATALOGUE // 5 CATEGORIES
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold text-white tracking-tighter uppercase text-glow">
          FEATURED WORK
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/50 font-light max-w-2xl font-sans">
          Curated portfolio categories arranged sequentially. Drag or swipe horizontally to inspect all 5 cuts per discipline.
        </p>
      </div>

      {/* Stacked Category Rows */}
      <div className="flex flex-col">
        {CATEGORIES.map((cat) => (
          <CategorySwipeRow 
            key={cat.id} 
            category={cat} 
            onOpenModal={onOpenModal} 
          />
        ))}
      </div>
    </section>
  );
}

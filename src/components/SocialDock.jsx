import React from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';

export default function SocialDock() {
  return (
    <aside 
      className="fixed left-4 md:left-7 top-1/2 -translate-y-1/2 z-40 select-none hidden md:block"
      aria-label="Social Profiles"
    >
      <div className="flex flex-col items-center gap-3 px-2.5 py-4 rounded-full border border-white/10 bg-[#0C0C0C]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-white/[0.03] text-white/50 hover:text-[#FFBD59] hover:border-[#FFBD59]/40 hover:bg-[#FFBD59]/10 transition-all duration-300 group"
            title={item.name}
            data-cursor-hover="true"
          >
            {item.name === 'Instagram' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            )}
            {item.name === 'Behance' && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300">
                <path d="M8.6 6H4v12h4.6c1.8 0 3.2-1.1 3.2-3 0-1.3-.8-2.3-2-2.7 1-.4 1.6-1.3 1.6-2.5 0-2-1.5-3.8-3.8-3.8zm-.6 4.3H6V8.2h2c.7 0 1.2.4 1.2 1 0 .7-.5 1.1-1.2 1.1zm.4 5.3H6v-2.6h2.4c.7 0 1.3.4 1.3 1.2s-.6 1.4-1.3 1.4zm11.4-4.4c0-1.7-1.2-3.2-3.1-3.2-2.1 0-3.3 1.5-3.3 3.6v1.4c0 2 1.2 3.6 3.4 3.6 1.8 0 2.9-1 3.2-2.4h-1.8c-.2.6-.7.9-1.4.9-1 0-1.5-.6-1.5-1.7H19.8v-.2zm-4.6-1.6c0-1 .5-1.4 1.3-1.4s1.2.4 1.2 1.4h-2.5zM14 6.8h5.6V8H14v-1.2z"/>
              </svg>
            )}
            {item.name === 'LinkedIn' && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            )}
          </a>
        ))}
        <div className="w-4 h-[1px] bg-white/15 my-0.5"></div>
        <span 
          className="text-[8px] font-mono tracking-[0.25em] text-white/40 uppercase rotate-180 select-none pt-1" 
          style={{ writingMode: 'vertical-lr' }}
        >
          SOCIALS
        </span>
      </div>
    </aside>
  );
}

import React, { useState, useEffect } from 'react';
import { ARSENAL_SKILLS } from '../data/portfolioData';
import { Cpu, X, Sparkles, CheckCircle2, ArrowRight, Layers, Sliders, Volume2, Film } from 'lucide-react';

// Text display component for the centered inspection modal
function SpecificationText({ text }) {
  return (
    <p className="text-sm md:text-base text-white/90 font-light leading-relaxed font-sans">
      {text}
    </p>
  );
}

// Coordinate layout for the Capability Network Graph
// Center is (50%, 50%) -> Naveen
const NETWORK_NODES = [
  { id: 'ae', symbol: 'Ae', name: 'AFTER EFFECTS', role: 'Kinetic Typography & 2.5D', x: 50, y: 15 },
  { id: 'pr', symbol: 'Pr', name: 'PREMIERE PRO', role: 'Assembly & Velocity Pacing', x: 80, y: 32 },
  { id: 'dv', symbol: 'Dv', name: 'DAVINCI RESOLVE', role: 'ACEScc Color Science', x: 78, y: 70 },
  { id: 'sc', symbol: 'Sd', name: 'SOUND & COLOR', role: 'Spatial Foley & Mastering', x: 50, y: 88 },
  { id: 'ai', symbol: 'Ai', name: 'AI VIDEO PIPELINE', role: 'Runway & Neural Latents', x: 22, y: 70 },
  { id: 'ps', symbol: 'Ps', name: 'PHOTOSHOP', role: 'Key Visuals & Textures', x: 20, y: 32 }
];

export default function CoreSkillsRadar() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedSkill(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNode = (node) => {
    const matchedSkill = ARSENAL_SKILLS.find(
      s => s.symbol.toLowerCase() === node.symbol.toLowerCase() ||
           s.name.toLowerCase().includes(node.name.toLowerCase().split(' ')[0])
    ) || ARSENAL_SKILLS[0];

    setSelectedSkill(matchedSkill);
  };

  return (
    <section id="core-skills" className="relative py-20 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0A0A0A] overflow-hidden border-b border-white/[0.06]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[#FFBD59]/[0.02] blur-[150px] pointer-events-none select-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
              SIGNATURE 03 // CAPABILITY NETWORK
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            CORE ARSENAL
          </h2>
        </div>

        <p className="max-w-md text-sm sm:text-base text-white/60 font-light">
          A capability network graph centered on end-to-end creative post-production. Select any node to inspect pipeline stages and deliverables.
        </p>
      </div>

      {/* Mobile Fallback: High-density Capability Cards */}
      <div className="md:hidden flex flex-col gap-3 max-w-md mx-auto relative z-10">
        {NETWORK_NODES.map((node) => (
          <div
            key={node.id}
            onClick={() => handleOpenNode(node)}
            className="p-4 rounded-xl bg-[#111111] border border-white/10 hover:border-[#FFBD59]/60 transition-all duration-300 cursor-pointer flex items-center justify-between"
            data-cursor-hover="true"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#181818] border border-[#FFBD59]/50 flex items-center justify-center text-xs font-mono font-bold text-[#FFBD59]">
                {node.symbol}
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white uppercase">{node.name}</h4>
                <span className="text-[10px] font-mono text-white/40 uppercase">{node.role}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-white/5 text-white/70">
              Inspect →
            </span>
          </div>
        ))}
      </div>

      {/* Desktop View: Authentic Capability Network Graph */}
      <div className="hidden md:block max-w-4xl mx-auto relative h-[600px] select-none">
        
        {/* SVG Network Connector Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          {NETWORK_NODES.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            return (
              <g key={node.id}>
                {/* Background hairline line */}
                <line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke={isHovered ? 'rgba(255, 189, 89, 0.6)' : 'rgba(255, 255, 255, 0.08)'}
                  strokeWidth={isHovered ? '0.45' : '0.25'}
                  strokeDasharray={isHovered ? 'none' : '1, 1'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Node: NAVEEN */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="relative w-28 h-28 rounded-full bg-[#0F0F0F] border-2 border-[#FFBD59]/40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,189,89,0.15)]">
            <span className="text-xs font-mono tracking-[0.2em] text-[#FFBD59] font-bold">CORE</span>
            <span className="text-sm font-display font-extrabold text-white tracking-wider uppercase mt-0.5">
              NAVEEN
            </span>
            <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20 pointer-events-none" />
          </div>
        </div>

        {/* Orbiting Capability Nodes */}
        {NETWORK_NODES.map((node) => {
          const isHovered = hoveredNodeId === node.id;

          return (
            <div
              key={node.id}
              onClick={() => handleOpenNode(node)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-20 cursor-pointer group"
              data-cursor-hover="true"
            >
              <div className={`px-4 py-3 rounded-2xl bg-[#111111]/90 backdrop-blur-md border transition-all duration-300 flex items-center gap-3.5 shadow-2xl ${
                isHovered
                  ? 'border-[#FFBD59] scale-105 shadow-[0_0_30px_rgba(255,189,89,0.25)]' 
                  : 'border-white/10 hover:border-white/30'
              }`}>
                {/* Monogram Badge */}
                <div className="w-8 h-8 rounded-lg bg-[#181818] border border-white/10 group-hover:border-[#FFBD59]/60 flex items-center justify-center text-xs font-mono font-bold text-[#FFBD59] transition-colors">
                  {node.symbol}
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-xs font-display font-bold text-white tracking-wide uppercase group-hover:text-[#FFBD59] transition-colors">
                    {node.name}
                  </span>
                  <span className="text-[10px] font-mono text-white/40 tracking-wider">
                    {node.role}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Centered Luxury Typewriter Inspection Modal */}
      {selectedSkill && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-modal-title"
        >
          <div className="fixed inset-0" onClick={() => setSelectedSkill(null)} />

          <div className="relative z-10 w-full max-w-2xl bg-[#0F0F0F] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#FFBD59]/50 flex items-center justify-center text-sm font-mono font-bold text-[#FFBD59]">
                  {selectedSkill.symbol}
                </div>
                <div>
                  <h3 id="skill-modal-title" className="text-lg sm:text-xl font-display font-extrabold text-white uppercase">
                    {selectedSkill.name}
                  </h3>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    {selectedSkill.category} // {selectedSkill.level}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kinetic Typewriter Overview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FFBD59] block mb-2 font-semibold">
                SYSTEM SPECIFICATION:
              </span>
              <SpecificationText text={selectedSkill.description} />
            </div>

            {/* Pipeline Stages & Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-6">
              <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
                <span className="text-white/40 uppercase tracking-widest block mb-2">PIPELINE STAGES</span>
                <div className="space-y-1.5 text-white/80">
                  {(selectedSkill.workflow 
                    ? selectedSkill.workflow.split(' → ') 
                    : (selectedSkill.specialties || [])
                  ).map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#FFBD59]" />
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
                <span className="text-white/40 uppercase tracking-widest block mb-2">TYPICAL DELIVERABLES</span>
                <div className="space-y-1.5 text-white/80">
                  {(typeof selectedSkill.deliverables === 'string' 
                    ? selectedSkill.deliverables.split(', ') 
                    : (selectedSkill.deliverables || [])
                  ).map((del, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Tool Switcher Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                Switch Discipline:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ARSENAL_SKILLS.map((sk) => (
                  <button
                    key={sk.symbol}
                    onClick={() => setSelectedSkill(sk)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      selectedSkill.symbol === sk.symbol
                        ? 'bg-[#FFBD59] text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {sk.symbol}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

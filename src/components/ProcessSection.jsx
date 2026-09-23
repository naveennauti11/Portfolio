import React from 'react';
import { Target, Scissors, Sparkles, Film, ArrowRight } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    name: 'UNDERSTAND',
    title: 'Brief & Direction',
    description: 'Reviewing the creative brief, raw footage, pacing direction, and audio style before starting the edit.',
    icon: Target,
    deliverables: ['Creative Brief', 'Style References', 'Footage Organization']
  },
  {
    step: '02',
    name: 'EDIT',
    title: 'Assembly & Pacing',
    description: 'Selecting the best takes and cutting footage with natural rhythm, clean continuity, and precise timing.',
    icon: Scissors,
    deliverables: ['Assembly Cut', 'Rhythm & Pacing', 'Fine Cut']
  },
  {
    step: '03',
    name: 'DESIGN',
    title: 'Motion & Visuals',
    description: 'Adding clean motion graphics, titles, subtle visual effects, and graphic elements tailored to the project.',
    icon: Sparkles,
    deliverables: ['Title Design', 'Motion Graphics', 'Visual Polish']
  },
  {
    step: '04',
    name: 'FINISH',
    title: 'Color & Sound Finishing',
    description: 'Color grading for cinematic look, dialogue cleanup, sound design, music mixing, and final 4K export.',
    icon: Film,
    deliverables: ['Color Grading', 'Sound Design & Mix', 'Master 4K Delivery']
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-[#0A0A0A] border-b border-white/[0.06]">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFBD59]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
              PROCESS 02 // METHODOLOGY
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            HOW I WORK
          </h2>
        </div>

        <p className="max-w-md text-sm sm:text-base text-white/60 font-light">
          A clear, 4-stage post-production workflow focused on precision, communication, and high quality delivery.
        </p>
      </div>

      {/* 4 Stage Typographic Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROCESS_STEPS.map((stage, idx) => {
          const Icon = stage.icon;

          return (
            <div
              key={idx}
              className="group p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 hover:border-[#FFBD59]/60 transition-all duration-300 flex flex-col justify-between"
              data-cursor-hover="true"
            >
              <div>
                {/* Step Number + Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold text-white/40 group-hover:text-[#FFBD59] transition-colors">
                    {stage.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5 text-[#FFBD59]" />
                  </div>
                </div>

                {/* Stage Name */}
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#FFBD59] uppercase font-semibold">
                  {stage.name}
                </span>

                <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight mt-1 mb-3">
                  {stage.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* Deliverables Checklist */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-1.5">
                {stage.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-[11px] font-mono text-white/50">
                    <span className="w-1 h-1 rounded-full bg-[#FFBD59]/70" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

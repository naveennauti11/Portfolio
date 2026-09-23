import React, { useState, useEffect } from 'react';
import { Mail, Check, Copy, Send, X, ArrowUpRight, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS, SERVICES } from '../data/portfolioData';

const getServiceBudgetConfig = (serviceTitle) => {
  const s = SERVICES.find(srv => srv.title.toLowerCase() === (serviceTitle || '').toLowerCase());
  if (s) {
    return {
      min: s.minBudget,
      max: s.maxBudget || 1000,
      defaultVal: s.defaultBudget || s.minBudget,
      hasNoMax: s.hasNoMax || false,
      step: s.minBudget <= 20 ? 5 : (s.minBudget <= 50 ? 10 : 25)
    };
  }
  return { min: 10, max: 50, defaultVal: 25, hasNoMax: false, step: 5 };
};

export default function ContactSection({ selectedService, setSelectedService, isOpen, setIsOpen }) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: selectedService || 'Basic Editing',
    message: ''
  });
  const [budgetVal, setBudgetVal] = useState(25);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customBudgetText, setCustomBudgetText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success

  // Auto-sync budget slider values when service changes
  useEffect(() => {
    if (selectedService) {
      const config = getServiceBudgetConfig(selectedService);
      setFormData(prev => ({ ...prev, service: selectedService }));
      setBudgetVal(config.defaultVal);
    }
  }, [selectedService]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = getServiceBudgetConfig(formData.service);
    const finalBudget = isCustomMode 
      ? (customBudgetText ? `$${customBudgetText.replace('$', '')}` : `$${budgetVal}`)
      : (config.hasNoMax && budgetVal >= config.max ? `$${config.max}+ (Open-Ended / Flexible)` : `$${budgetVal}`);

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="relative w-full py-24 md:py-36 px-6 md:px-12 lg:px-16 bg-[#0A0A0A] overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[35vw] max-w-[900px] rounded-full bg-[#FFBD59]/[0.02] blur-[160px] pointer-events-none select-none" />

      {/* Main Closing Filmic Manifesto (Claude Spec: "THE NEXT FRAME STARTS HERE") */}
      <div className="max-w-5xl mx-auto text-center relative z-10 select-none">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#FFBD59] uppercase font-semibold">
            AVAILABLE FOR 2026 COMMISSIONS
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-extrabold text-white tracking-tight uppercase leading-[0.92]">
          THE NEXT FRAME <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#FFBD59]">
            STARTS HERE.
          </span>
        </h2>

        <p className="mt-8 text-base sm:text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
          Whether you need a commercial campaign, kinetic typography, or end-to-end post-production, let's build something unforgettable.
        </p>

        {/* Action Buttons: Single Focused CTA + Email Copy */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-white text-black font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-[#FFBD59] hover:shadow-[0_0_50px_rgba(255,189,89,0.4)] group"
            data-cursor-hover="true"
          >
            <span>Initiate Inquiry →</span>
          </button>

          <button
            onClick={copyEmail}
            className="flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-full border border-white/15 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/40 text-white font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group"
            data-cursor-hover="true"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#FFBD59]" />}
            <span>{copied ? 'Email Copied' : 'Copy Email'}</span>
          </button>
        </div>

      </div>

      {/* Focused Project Inquiry Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-title"
        >
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative z-10 w-full max-w-xl bg-[#0F0F0F] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 id="inquiry-title" className="text-xl sm:text-2xl font-display font-extrabold text-white uppercase">
                  PROJECT INQUIRY
                </h3>
                <span className="text-xs font-mono text-white/50 tracking-wider">
                  DIRECT TO NAVEEN NAUTIYAL
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-display font-bold text-white uppercase">
                  INQUIRY TRANSMITTED
                </h4>
                <p className="text-sm text-white/60 font-light max-w-md mx-auto">
                  Thank you for reaching out. Naveen will review your project brief and reply within 24 hours.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setIsOpen(false); }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FFBD59] transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan / Studio Apex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:border-[#FFBD59] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@studioapex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:border-[#FFBD59] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Service Scope
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => {
                      const selected = e.target.value;
                      const nextConfig = getServiceBudgetConfig(selected);
                      setFormData({ 
                        ...formData, 
                        service: selected
                      });
                      setBudgetVal(nextConfig.defaultVal);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white focus:border-[#FFBD59] focus:outline-none transition-colors"
                  >
                    {SERVICES.map(s => (
                      <option key={s.id} value={s.title}>{s.title} ({s.priceEstimate})</option>
                    ))}
                  </select>
                </div>

                {/* Interactive Dynamic Budget Slider */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  {(() => {
                    const currentBudgetConfig = getServiceBudgetConfig(formData.service);

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                            Target Budget (Min ${currentBudgetConfig.min})
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsCustomMode(!isCustomMode)}
                            className="text-[10px] font-mono text-[#FFBD59] hover:underline uppercase tracking-wider"
                          >
                            {isCustomMode ? 'Use Interactive Slider' : 'Type Custom Amount'}
                          </button>
                        </div>

                        {isCustomMode ? (
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm">$</span>
                            <input
                              type="text"
                              placeholder="Enter budget (e.g. 500, 1500, or Retainer)"
                              value={customBudgetText}
                              onChange={(e) => setCustomBudgetText(e.target.value)}
                              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[#141414] border border-white/15 text-white font-mono text-sm focus:border-[#FFBD59] focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div>
                            {/* Live Amount Display */}
                            <div className="flex items-baseline justify-between mb-2">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                                  ${budgetVal}
                                </span>
                                {currentBudgetConfig.hasNoMax && budgetVal >= currentBudgetConfig.max && (
                                  <span className="text-xs font-mono text-[#FFBD59] font-semibold">
                                    + (No Upper Limit)
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFBD59]/10 border border-[#FFBD59]/30 text-[#FFBD59]">
                                {formData.service}
                              </span>
                            </div>

                            {/* Slider Input with Accent Color */}
                            <input
                              type="range"
                              min={currentBudgetConfig.min}
                              max={currentBudgetConfig.max}
                              step={currentBudgetConfig.step}
                              value={budgetVal}
                              onChange={(e) => setBudgetVal(Number(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFBD59]"
                            />

                            {/* Min / Max Range Indicators */}
                            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mt-2">
                              <span>Min: ${currentBudgetConfig.min}</span>
                              <span>
                                {currentBudgetConfig.hasNoMax 
                                  ? 'Client Discretion (No Limit)' 
                                  : `Max: $${currentBudgetConfig.max}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Project Brief & Timeline
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about the footage, style references, timeline, and deliverables..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:border-[#FFBD59] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#FFBD59] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{status === 'submitting' ? 'Transmitting Brief...' : 'Send Inquiry →'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Minimalist Editorial Footer */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
        <div>
          © {new Date().getFullYear()} NAVEEN NAUTIYAL. ALL RIGHTS RESERVED.
        </div>

        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 hover:text-white transition-colors group"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

    </section>
  );
}

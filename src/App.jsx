import React, { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import SocialDock from './components/SocialDock';
import Navbar from './components/Navbar';
import CinematicHeroCover from './components/CinematicHeroCover';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import CaseStudyModal from './components/CaseStudyModal';
import LivingVerticalStrip from './components/LivingVerticalStrip';
import ProcessSection from './components/ProcessSection';
import CoreSkillsRadar from './components/CoreSkillsRadar';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import VideoModal from './components/VideoModal';
import { PERSONAL_INFO, SELECTED_CASE_STUDIES } from './data/portfolioData';

export default function App() {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Play showreel with full audio (or currently active video)
  const handleWatchReel = (video) => {
    setActiveModalVideo(video ? {
      ...video,
      client: video.client || 'Naveen Nautiyal',
      year: video.year || '2026'
    } : {
      ...PERSONAL_INFO.heroReel,
      category: 'Master Reel',
      client: 'Naveen Nautiyal',
      year: '2026'
    });
  };

  // Selecting a service tier pre-fills and launches the inquiry modal
  const handleSelectService = (serviceName) => {
    setSelectedService(serviceName);
    setIsInquiryOpen(true);
  };

  // Case study navigation (Next / Prev)
  const handleNextCaseStudy = () => {
    if (!activeCaseStudy) return;
    const currentIndex = SELECTED_CASE_STUDIES.findIndex(c => c.id === activeCaseStudy.id);
    const nextIndex = (currentIndex + 1) % SELECTED_CASE_STUDIES.length;
    setActiveCaseStudy(SELECTED_CASE_STUDIES[nextIndex]);
  };

  const handlePrevCaseStudy = () => {
    if (!activeCaseStudy) return;
    const currentIndex = SELECTED_CASE_STUDIES.findIndex(c => c.id === activeCaseStudy.id);
    const prevIndex = (currentIndex - 1 + SELECTED_CASE_STUDIES.length) % SELECTED_CASE_STUDIES.length;
    setActiveCaseStudy(SELECTED_CASE_STUDIES[prevIndex]);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans overflow-x-hidden selection:bg-[#FFBD59]/30 selection:text-white">
      {/* Film Grain Texture Overlay */}
      <div className="film-grain pointer-events-none select-none" />

      {/* Interactive Custom Hardware Cursor */}
      <CustomCursor />

      {/* Fixed Vertical Social Dock */}
      <SocialDock />

      {/* Top Floating Navbar */}
      <Navbar onOpenInquiry={() => setIsInquiryOpen(true)} />

      {/* Main Narrative Flow (Claude Section Order: 3 Signature + 5 Restrained) */}
      <main className="relative w-full">
        
        {/* 0. Cinematic Opening Title Cover (Concept B: Split Editorial with Parallax Depth) */}
        <CinematicHeroCover />

        {/* 1. Hero: Film + Manifesto Merged (Signature #1) */}
        <Hero onWatchReel={handleWatchReel} />

        {/* 2. Selected Work → Flagship Case Studies (Signature #2) */}
        <SelectedWork 
          onOpenCaseStudy={(cs) => setActiveCaseStudy(cs)} 
          onOpenArchiveVideo={(vid) => setActiveModalVideo(vid)}
        />

        {/* 3. Motion Parade: CSS Native Scroll-Snap (Restrained #1) */}
        <LivingVerticalStrip onSelectVideo={(video) => setActiveModalVideo(video)} />

        {/* 4. Process: 4 Stage Typographic Flow (Restrained #2) */}
        <ProcessSection />

        {/* 5. Core Arsenal: Capability Network Graph (Signature #3) */}
        <CoreSkillsRadar />

        {/* 6. About & Timeline: Editorial Profile (Restrained #3) */}
        <AboutSection />

        {/* 7. Production Services: Typographic Expandable Rows (Restrained #4) */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 8. Contact & Inquiry: Monumental Closing Manifesto (Restrained #5) */}
        <ContactSection 
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          isOpen={isInquiryOpen}
          setIsOpen={setIsInquiryOpen}
        />

      </main>

      {/* Deep-Dive Case Study Modal */}
      {activeCaseStudy && (
        <CaseStudyModal
          caseStudy={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
          onSelectNext={handleNextCaseStudy}
          onSelectPrev={handlePrevCaseStudy}
        />
      )}

      {/* Full-Fidelity Video Lightbox Modal (For Showreel / Archive Videos) */}
      {activeModalVideo && (
        <VideoModal 
          video={activeModalVideo} 
          onClose={() => setActiveModalVideo(null)} 
        />
      )}
    </div>
  );
}

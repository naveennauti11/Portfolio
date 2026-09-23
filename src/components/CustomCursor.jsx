import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch screens or mobile
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isRunning = false;
    let animationFrameId = null;

    const render = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      }

      // If ring is close to mouse, stop the loop to save 100% CPU when idle
      if (Math.abs(mouseX - ringX) > 0.2 || Math.abs(mouseY - ringY) > 0.2) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
        animationFrameId = null;
      }
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Instant 1:1 hardware update for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      }

      // Wake up ring lerp loop only when mouse moves
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.cursorHover === 'true'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1:1 Pinpoint Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#FFBD59] pointer-events-none z-50 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />

      {/* Smooth Lag Outer Halo */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 transition-all duration-200 border ${
          isHovered
            ? 'w-12 h-12 -translate-x-1.5 -translate-y-1.5 bg-[#FFBD59]/15 border-[#FFBD59]/80 scale-110 shadow-[0_0_20px_rgba(255,189,89,0.4)]'
            : 'w-9 h-9 bg-transparent border-white/40 scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
}

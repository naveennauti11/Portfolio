import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const auraRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch screens or mobile
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let auraX = -100;
    let auraY = -100;
    let isRunning = false;
    let animationFrameId = null;

    const render = () => {
      auraX += (mouseX - auraX) * 0.28;
      auraY += (mouseY - auraY) * 0.28;

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      }

      if (Math.abs(mouseX - auraX) > 0.1 || Math.abs(mouseY - auraY) > 0.1) {
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

      // Instant 1:1 hardware update for the pinpoint dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Wake up smooth follow loop only when mouse moves
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName?.toLowerCase() === 'button' ||
        target.tagName?.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset?.cursorHover === 'true'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block">
      {/* 1:1 Precision Core Dot (Sleek luxury amber gold, zero awkward wire circle) */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 rounded-full pointer-events-none z-[999] transition-transform duration-100 ${
          isClicking ? 'scale-75' : isHovered ? 'scale-125' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="w-2 h-2 rounded-full bg-[#FFBD59] shadow-[0_0_10px_rgba(255,189,89,0.9)]" />
      </div>

      {/* Subtle Interactive Aura: Only blooms smoothly on hover over clickable elements */}
      <div
        ref={auraRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full pointer-events-none z-[998] transition-[width,height,opacity,background-color,border-color] duration-200 ease-out ${
          isHovered
            ? 'w-8 h-8 -ml-4 -mt-4 bg-[#FFBD59]/15 border border-[#FFBD59]/50 shadow-[0_0_15px_rgba(255,189,89,0.3)] opacity-100'
            : 'w-6 h-6 opacity-0 border-transparent'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}

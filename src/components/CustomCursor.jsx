import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
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
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let isRunning = false;
    let animationFrameId = null;

    const render = () => {
      // Smooth fluid lerp for center dot (smooth and silky, not harsh or jerky)
      dotX += (mouseX - dotX) * 0.32;
      dotY += (mouseY - dotY) * 0.32;

      // Gentle trailing lerp for outer circle (fluid, weighted momentum)
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      // Check if both have converged near mouse to pause loop when idle (saves 100% CPU)
      const dotDiff = Math.abs(mouseX - dotX) + Math.abs(mouseY - dotY);
      const ringDiff = Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);

      if (dotDiff > 0.1 || ringDiff > 0.1) {
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
    <div className="hidden lg:block pointer-events-none select-none">
      {/* 1. Silky Smooth Weighted Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 pointer-events-none z-[999]"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`w-2 h-2 rounded-full bg-[#FFBD59] shadow-[0_0_8px_rgba(255,189,89,0.9)] transition-transform duration-200 ease-out ${
            isClicking ? 'scale-75' : isHovered ? 'scale-125' : 'scale-100'
          }`}
        />
      </div>

      {/* 2. Fluid Trailing Luxury Outer Circle (Smooth lag follow physics) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 pointer-events-none z-[998]"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full border transition-[width,height,margin,background-color,border-color,box-shadow,transform] duration-250 ease-out ${
            isHovered
              ? 'w-14 h-14 -ml-3 -mt-3 bg-[#FFBD59]/15 border-[#FFBD59] shadow-[0_0_25px_rgba(255,189,89,0.35)] scale-105'
              : isClicking
              ? 'w-8 h-8 ml-0 mt-0 bg-[#FFBD59]/10 border-[#FFBD59]/70 scale-90'
              : 'w-8 h-8 ml-0 mt-0 bg-[#FFBD59]/[0.03] border-[#FFBD59]/40 scale-100'
          }`}
        />
      </div>
    </div>
  );
}

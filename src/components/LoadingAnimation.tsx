'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingAnimationProps {
  text?: string;
}

export default function LoadingAnimation({ text = 'Loading' }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the entrance animation
      const tl = gsap.timeline();

      // Animate "Pickabook" letters
      // Duration calculation: stagger 0.1s * 8 gaps = 0.8s. Animation duration 0.7s. Total = 1.5s.
      tl.from(".brand-letter", {
        y: 20,
        opacity: 0,
        scale: 0.5,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });

      // Continuous breathing animation for the whole container
      gsap.to(containerRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2 // Start after entrance
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center pointer-events-none select-none"
    >
      <div className="flex items-center gap-3 text-3xl md:text-5xl font-black tracking-tight">
        {/* Pickabook Word */}
        <div ref={textRef} className="flex">
          {"Pickabook".split("").map((char, i) => (
            <span key={i} className="brand-letter inline-block text-orange-500">
              {char}
            </span>
          ))}
        </div>
      </div>
      
      {/* Optional Loading Text */}
      {text && text !== 'Loading' && (
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          {text}...
        </p>
      )}
    </div>
  );
}

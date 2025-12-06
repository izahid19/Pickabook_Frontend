'use client';

import React, { useEffect, useRef } from 'react';
import { Download, RefreshCcw, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '../lib/utils';
import gsap from 'gsap';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string;
  onReset: () => void;
}

export default function ResultDisplay({ originalImage, generatedImage, onReset }: ResultDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(".image-card",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.2)" },
      "-=0.4"
    )
    .fromTo(".action-btn",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    );

  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pickabook-magic-3d.png';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback method
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'pickabook-magic-3d.png';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto opacity-0">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
          <span className="text-sm font-semibold text-indigo-700 tracking-wide uppercase">Transformation Complete</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Your 3D Masterpiece</h2>
      </div>

      <div ref={imageContainerRef} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        {/* Original Image */}
        <div className="image-card relative group w-full max-w-[400px] flex-1">
          <div className="absolute -inset-0.5 bg-linear-to-tr from-slate-200 to-slate-300 rounded-4xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative bg-white p-2 rounded-[1.75rem] shadow-xl ring-1 ring-slate-100">
            <div className="aspect-3/4 relative rounded-2xl overflow-hidden">
              <Image 
                src={originalImage} 
                alt="Original" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/50">
                ORIGINAL
              </div>
            </div>
          </div>
        </div>

        {/* Arrow / Divider */}
        <div className="flex-none z-10 flex justify-center py-2 md:py-0">
          <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-300 md:rotate-0 rotate-90">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Generated Image */}
        <div className="image-card relative group w-full max-w-[400px] flex-1">
          <div className="absolute -inset-1 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-4xl blur opacity-40 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
          <div className="relative bg-white p-2 rounded-[1.75rem] shadow-2xl ring-1 ring-slate-100/50">
            <div className="aspect-3/4 relative rounded-2xl overflow-hidden">
              <Image 
                src={generatedImage} 
                alt="Magic 3D Result" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ring-1 ring-white/20">
                ✨ 3D MAGIC
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-16 pb-12">
        <button
          onClick={onReset}
          className="action-btn group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-gray-200 font-semibold shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-slate-100 dark:border-slate-700"
        >
          <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
          <span>Transform Another</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="action-btn group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-orange-500 text-white font-semibold shadow-lg shadow-slate-900/20 dark:shadow-orange-500/20 hover:shadow-xl hover:shadow-slate-900/30 dark:hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
          <span>Download Masterpiece</span>
        </button>
      </div>
    </div>
  );
}

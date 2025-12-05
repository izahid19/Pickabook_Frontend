'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-500 ease-out overflow-hidden",
        "rounded-3xl p-12 md:p-16 text-center",
        "bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl",
        isDragging 
          ? "border-2 border-orange-500 scale-[1.02] shadow-2xl ring-4 ring-orange-500/20" 
          : "border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-2xl hover:scale-[1.01]"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Icon container */}
        <div className={cn(
          "relative p-5 rounded-2xl transition-all duration-500",
          "bg-gradient-to-br from-orange-500 to-orange-600",
          "shadow-lg shadow-orange-500/30",
          isDragging 
            ? "scale-110 rotate-6" 
            : "group-hover:scale-110 group-hover:rotate-6"
        )}>
          <UploadCloud className="w-10 h-10 text-white" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        </div>
        
        {/* Text content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Drop your photo here
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
            or click to browse your files
          </p>
        </div>

        {/* CTA Button */}
        <button className="btn-premium px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5">
          Choose Photo
        </button>

        {/* File types */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 font-medium">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>JPG, PNG, WEBP • Max 10MB</span>
        </div>
      </div>
    </div>
  );
}


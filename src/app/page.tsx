'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UploadZone from '../components/UploadZone';
import ResultDisplay from '../components/ResultDisplay';
import LoginModal from '../components/LoginModal';
import Navbar from '../components/layout/Navbar';
import FeatureSection from '../components/home/FeatureSection';
import LoadingAnimation from '../components/LoadingAnimation';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { config } from '../config/config';

export default function Home() {
  const { user, token, loading, updateCredits } = useAuth();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Minimum loading time state to ensure animation completes
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    // Force loading screen for at least 1.6 seconds (slightly more than 1.5s animation)
    const timer = setTimeout(() => {
      setMinLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const showLoadingScreen = loading || minLoading;

  useEffect(() => {
    if (showLoadingScreen) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Navbar animation - slide down
        gsap.fromTo(navRef.current,
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );

        // Hero section animations with timeline
        const tl = gsap.timeline({ delay: 0.2 });
        
        // Animate hero text elements
        tl.fromTo(".hero-text",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }
        )
        // Animate decorative elements
        .fromTo(".decorative-element",
          { opacity: 0, scale: 0, rotation: -10 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.3"
        )
        // Animate showcase images
        .fromTo(".showcase-card",
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          "-=0.2"
        );

        // Animate upload section
        gsap.fromTo(".upload-section",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: "power3.out" }
        );

        // Animate feature cards
        gsap.fromTo(".feature-card",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 1, ease: "power2.out" }
        );

        // Animate footer
        gsap.fromTo(".footer-section",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 1.3, ease: "power2.out" }
        );
      }, mainRef);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timer);
  }, [showLoadingScreen]);

  const handleFileSelect = async (file: File) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    if (user && user.credits <= 0) {
      toast.error('You have no credits remaining.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setOriginalImage(previewUrl);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${config.API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          toast.error(errorData.message || 'Insufficient credits');
          setOriginalImage(null);
          return;
        }
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (data.credits !== undefined) {
        updateCredits(data.credits);
      }

      if (data.imageUrl.url) {
          setGeneratedImage(data.imageUrl.url);
      } else if (typeof data.imageUrl === 'string') {
          setGeneratedImage(data.imageUrl);
      } else {
          setGeneratedImage(String(data.imageUrl));
      }
      
      toast.success('Image generated successfully! ✨');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate image. Please try again.');
      setOriginalImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setIsLoading(false);
  };

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (showLoadingScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <LoadingAnimation text="Loading" />
      </div>
    );
  }

  return (
    <main ref={mainRef} className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar ref={navRef} onLoginClick={() => setShowLogin(true)} />

      {/* Hero Section with Orange Gradient */}
      <section className="relative pt-24 pb-32 bg-linear-to-b from-orange-200 via-orange-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="decorative-element opacity-0 absolute top-20 left-10 w-32 h-32 border-2 border-orange-300/30 dark:border-orange-500/20 rounded-3xl rotate-12" />
        <div className="decorative-element opacity-0 absolute top-40 right-20 w-24 h-24 border-2 border-orange-300/30 dark:border-orange-500/20 rounded-2xl -rotate-12" />
        <div className="decorative-element opacity-0 absolute bottom-40 left-20 w-20 h-20 border-2 border-orange-300/30 dark:border-orange-500/20 rounded-xl rotate-45" />
        
        <div ref={heroRef} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          {/* Main Headline */}
          <h1 className="hero-text opacity-0 text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            TURN PHOTOS INTO
            <br />
            <span className="text-orange-500">BEAUTIFUL</span> 3D <span className="text-orange-500">MAGIC</span>
          </h1>
          
          {/* Subtitle */}
          <p className="hero-text opacity-0 text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Our AI instantly transforms your photos into stunning 3D Pixar-style characters.
            <br className="hidden md:block" />
            It's fast, easy, and absolutely magical.
          </p>
          
          {/* CTA Button */}
          <div className="hero-text opacity-0 inline-block">
            <button
              onClick={user ? scrollToUpload : () => setShowLogin(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              GET STARTED - IT'S FREE
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Showcase Images - Bento Grid */}
          <div className="mt-16 max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
              {/* Large left image */}
              <div className="showcase-card opacity-0 col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl group relative">
                <Image
                  src="/showcase/img1.png"
                  alt="3D Pixar Character"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Top right */}
              <div className="showcase-card opacity-0 col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-xl group relative">
                <Image
                  src="/showcase/img2.png"
                  alt="3D Pixar Character"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Top far right */}
              <div className="showcase-card opacity-0 col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-xl group relative">
                <Image
                  src="/showcase/img3.png"
                  alt="3D Pixar Character"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Bottom right wide */}
              <div className="showcase-card opacity-0 col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-xl group relative">
                <Image
                  src="/showcase/img4.png"
                  alt="3D Pixar Character"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="upload-section opacity-0 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your Magic ✨
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Upload your photo and watch the AI transform it into a 3D masterpiece
            </p>
          </div>

          {!originalImage ? (
            <div className="max-w-xl mx-auto">
              {!user ? (
                <div 
                  onClick={() => setShowLogin(true)}
                  className="cursor-pointer border-2 border-dashed border-orange-200 dark:border-orange-700 rounded-3xl p-16 text-center hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="text-6xl">🔒</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Login to Start</h3>
                    <p className="text-gray-500 dark:text-gray-400">Sign in with your email to get 10 free credits</p>
                    <button className="mt-4 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 transition-all">
                      Login Now
                    </button>
                  </div>
                </div>
              ) : user.credits <= 0 ? (
                <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-3xl p-16 text-center bg-amber-50/50 dark:bg-amber-900/20">
                  <div className="space-y-4">
                    <div className="text-6xl">💳</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">No Credits Remaining</h3>
                    <p className="text-gray-500 dark:text-gray-400">Add more credits to continue creating magic!</p>
                    <Link 
                      href="/profile"
                      className="inline-block mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-lg transition-all"
                    >
                      Add More Credits
                    </Link>
                  </div>
                </div>
              ) : (
                <UploadZone onFileSelect={handleFileSelect} />
              )}
            </div>
          ) : (
            <div className="w-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-8 bg-orange-50 dark:bg-gray-800 rounded-3xl p-12 border border-orange-100 dark:border-gray-700">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-orange-200 dark:border-orange-800 border-t-orange-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                      🪄
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Creating your 3D character...</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">This usually takes 20-30 seconds</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <ResultDisplay 
                  originalImage={originalImage}
                  generatedImage={generatedImage}
                  onReset={handleReset}
                />
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* Footer */}
      <footer className="footer-section opacity-0 py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">
            <span className="text-orange-500">Pickabook</span>Magic
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Transform your photos into magical 3D characters</p>
          <p className="text-gray-500 text-sm">© 2025 Pickabook Magic. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </main>
  );
}

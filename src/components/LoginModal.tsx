'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { X, Mail, KeyRound, Loader2, Wand2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/config';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('otp');
        setCooldown(data.cooldownSeconds || 120);
        toast.success('OTP sent to your email!');
      } else {
        setError(data.error || 'Failed to send OTP');
        toast.error(data.error || 'Failed to send OTP');
        if (data.cooldownSeconds) {
          setCooldown(data.cooldownSeconds);
        }
      }
    } catch (err) {
      setError('Failed to connect to server');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setCooldown(data.cooldownSeconds || 120);
        setError('');
        toast.success('OTP resent successfully!');
      } else {
        setError(data.error || 'Failed to resend OTP');
        toast.error(data.error || 'Failed to resend OTP');
        if (data.cooldownSeconds) {
          setCooldown(data.cooldownSeconds);
        }
      }
    } catch (err) {
      setError('Failed to connect to server');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.username}! 🎉`);
        onClose();
        setStep('email');
        setEmail('');
        setOtp('');
        setCooldown(0);
      } else {
        setError(data.error || 'Invalid OTP');
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to connect to server');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Orange gradient header */}
        <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-8 pt-8 pb-12 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl mb-4">
            <Wand2 className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to Pickabook</h2>
          <p className="text-orange-100 mt-2 text-sm">
            Create magical 3D characters from your photos
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 -mt-4 bg-white rounded-t-[28px] relative">

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2",
                  "bg-orange-500 hover:bg-orange-600",
                  (loading || cooldown > 0) && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  <>Wait {formatCooldown(cooldown)}</>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">We sent a code to</p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2",
                  "bg-orange-500 hover:bg-orange-600",
                  (loading || otp.length !== 6) && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {/* Resend OTP */}
              <div className="text-center py-2">
                {cooldown > 0 ? (
                  <p className="text-sm text-gray-400">
                    Resend OTP in <span className="font-mono font-semibold text-orange-500">{formatCooldown(cooldown)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCooldown(0); // Reset cooldown for new email
                }}
                className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
              >
                ← Use different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
